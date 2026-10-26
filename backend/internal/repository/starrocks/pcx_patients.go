package starrocks

import (
	"context"
	"encoding/json"
	"fmt"
	"sort"
	"strings"

	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/internal/utils"
	"gorm.io/gorm"
)

// PcxPatientsRepository reads the PCX 3.0 patient views. They are secured views read as the caller, so
// every row is already resolved for them: no PHI rule is applied here.
type PcxPatientsRepository struct {
	db *gorm.DB
}

func NewPcxPatientsRepository(db database.StarrocksDB) *PcxPatientsRepository {
	return &PcxPatientsRepository{db: db.DB}
}

type pcxPatientListRow struct {
	types.PatientListItem
	TotalCount int64
}

// SearchPatients reads the page and the total in one query: every read of the view re-runs the grant
// lookups of the secured views it is built on.
func (r *PcxPatientsRepository) SearchPatients(ctx context.Context, query types.ListQuery) ([]types.PatientListItem, int64, error) {
	db := r.db.WithContext(ctx)
	matching := func() *gorm.DB {
		// patient_name only exists where the caller can read PHI, so a name criterion never matches a restricted patient.
		list := db.Table(types.PcxPatientListTable.TenantQualifiedName(ctx)).
			Select(fmt.Sprintf("*, CASE WHEN can_read_phi THEN concat(given_name, ' ', family_name) END AS patient_name, %s AS age_at_initial_dx_group", ageAtInitialDxGroupSQL))
		tx := db.Table(fmt.Sprintf("(?) %s", types.PcxPatientListTable.Alias), list)
		utils.AddWhere(query, tx)
		return tx
	}

	columns := make([]string, 0, len(query.SelectedFields())+1)
	for _, field := range query.SelectedFields() {
		columns = append(columns, fmt.Sprintf("%s.%s AS %s", field.Table.Alias, field.Name, field.GetAlias()))
	}
	columns = append(columns, "count(*) OVER () AS total_count")
	tx := matching().Select(columns)
	utils.AddPaginationAndSort(tx, query)

	rows := []pcxPatientListRow{}
	if err := tx.Find(&rows).Error; err != nil {
		return nil, 0, fmt.Errorf("error searching patients: %w", err)
	}

	patients := make([]types.PatientListItem, len(rows))
	for i, row := range rows {
		patients[i] = row.PatientListItem
	}
	if len(rows) > 0 {
		return patients, rows[0].TotalCount, nil
	}

	// A page past the last match has no row to carry the total.
	var count int64
	if err := matching().Count(&count).Error; err != nil {
		return nil, 0, fmt.Errorf("error counting patients: %w", err)
	}
	return patients, count, nil
}

// AutocompletePatients suggests identifiers that start with prefix and, where the caller can read PHI, full names
// with a word that starts with it: "pat" finds "William Patel". Case-insensitive; % and _ in prefix are literal.
// It reads the demographics view once, each patient unnested into one candidate per suggestion type.
func (r *PcxPatientsRepository) AutocompletePatients(ctx context.Context, prefix string, limit int) ([]types.AutocompleteResult, error) {
	db := r.db.WithContext(ctx)
	escaped := likeEscaper.Replace(strings.ToLower(prefix))

	results := []types.AutocompleteResult{}
	tx := db.Table(fmt.Sprintf("%s d, unnest(['patient_id', 'patient_name']) AS u(type)", types.PcxDemographicsTable.TenantQualifiedName(ctx))).
		Distinct("u.type AS type", "CASE u.type WHEN 'patient_id' THEN d.patient_id ELSE concat(d.given_name, ' ', d.family_name) END AS value").
		Where("(u.type = 'patient_id' AND lower(d.patient_id) LIKE ?) OR (u.type = 'patient_name' AND d.can_read_phi AND lower(concat(' ', d.given_name, ' ', d.family_name)) LIKE ?)",
			escaped+"%", "% "+escaped+"%").
		Order("value asc, type asc").Limit(limit)
	if err := tx.Find(&results).Error; err != nil {
		return nil, fmt.Errorf("error autocompleting patients: %w", err)
	}
	return results, nil
}

var likeEscaper = strings.NewReplacer(`\`, `\\`, `%`, `\%`, `_`, `\_`)

// HPO onset groups. Negative and non-numeric ages are already NULL in the view, so antenatal cannot be told apart.
const ageAtInitialDxGroupSQL = `CASE WHEN age_at_initial_dx_days IS NULL THEN 'unknown'
	WHEN age_at_initial_dx_days = 0 THEN 'congenital'
	WHEN age_at_initial_dx_days < 28 THEN 'neonatal'
	WHEN age_at_initial_dx_days < 365.25 THEN 'infantile'
	WHEN age_at_initial_dx_days < 5 * 365.25 THEN 'childhood'
	WHEN age_at_initial_dx_days < 16 * 365.25 THEN 'juvenile'
	WHEN age_at_initial_dx_days < 40 * 365.25 THEN 'young_adult'
	WHEN age_at_initial_dx_days < 60 * 365.25 THEN 'middle_age'
	ELSE 'senior' END`

var ageAtInitialDxGroups = []string{"congenital", "neonatal", "infantile", "childhood", "juvenile", "young_adult", "middle_age", "senior", "unknown"}

func booleanFilterSQL(column string) string {
	return fmt.Sprintf("CASE WHEN %s THEN 'true' WHEN NOT %s THEN 'false' END", column, column)
}

var booleanFilterLabels = map[string]string{"true": "Yes", "false": "No"}

// A patient without agents unnests to one NULL so the lateral join keeps them for the other filters.
const unnestedAgentsSQL = "unnest(CASE WHEN array_length(pl.chemotherapy_agents) > 0 THEN pl.chemotherapy_agents ELSE [CAST(NULL AS VARCHAR)] END)"

type pcxPatientFilterArrays struct {
	VitalStatus            *string
	CnsIntegratedDiagnosis *string
	DiagnosisTypeCohort    *string
	GotRadiationEver       *string
	ChemotherapyAgents     *string
	Organizations          *string
}

// GetPatientsFilters returns the values of the list filters among the patients the caller can see, all from
// one scan of the view.
func (r *PcxPatientsRepository) GetPatientsFilters(ctx context.Context) (*types.PatientFilters, error) {
	db := r.db.WithContext(ctx)
	var arrays pcxPatientFilterArrays
	tx := db.Table(fmt.Sprintf("%s pl, %s AS u(agent)", types.PcxPatientListTable.TenantQualifiedName(ctx), unnestedAgentsSQL)).Select(fmt.Sprintf(`array_agg(DISTINCT vital_status) AS vital_status,
		array_agg(DISTINCT cns_integrated_diagnosis) AS cns_integrated_diagnosis,
		array_agg(DISTINCT diagnosis_type_cohort) AS diagnosis_type_cohort,
		array_agg(DISTINCT %s) AS got_radiation_ever,
		array_agg(DISTINCT u.agent) AS chemotherapy_agents,
		array_agg(DISTINCT [organization_code, organization_name]) AS organizations`, booleanFilterSQL("got_radiation_ever")))
	if err := tx.Scan(&arrays).Error; err != nil {
		return nil, fmt.Errorf("error fetching patient filters: %w", err)
	}

	filters := types.PatientFilters{AgeAtInitialDxGroup: []types.FiltersValue{}}
	for _, group := range ageAtInitialDxGroups {
		filters.AgeAtInitialDxGroup = append(filters.AgeAtInitialDxGroup, types.FiltersValue{Key: group})
	}
	var err error
	if filters.VitalStatus, err = filterValues(arrays.VitalStatus); err != nil {
		return nil, fmt.Errorf("error reading patient filter vital_status: %w", err)
	}
	if filters.CnsIntegratedDiagnosis, err = filterValues(arrays.CnsIntegratedDiagnosis); err != nil {
		return nil, fmt.Errorf("error reading patient filter cns_integrated_diagnosis: %w", err)
	}
	if filters.DiagnosisTypeCohort, err = filterValues(arrays.DiagnosisTypeCohort); err != nil {
		return nil, fmt.Errorf("error reading patient filter diagnosis_type_cohort: %w", err)
	}
	if filters.ChemotherapyAgents, err = filterValues(arrays.ChemotherapyAgents); err != nil {
		return nil, fmt.Errorf("error reading patient filter chemotherapy_agents: %w", err)
	}
	if filters.GotRadiationEver, err = filterValues(arrays.GotRadiationEver); err != nil {
		return nil, fmt.Errorf("error reading patient filter got_radiation_ever: %w", err)
	}
	sort.SliceStable(filters.GotRadiationEver, func(i, j int) bool {
		return filters.GotRadiationEver[i].Key > filters.GotRadiationEver[j].Key
	})
	for i := range filters.GotRadiationEver {
		filters.GotRadiationEver[i].Label = booleanFilterLabels[filters.GotRadiationEver[i].Key]
	}
	if filters.OrganizationCode, err = organizationFilterValues(arrays.Organizations); err != nil {
		return nil, fmt.Errorf("error reading patient filter organization_code: %w", err)
	}
	return &filters, nil
}

type pcxPatientIdentifier struct {
	organizationCode, patientIDType, patientID string
}

// pcxDayDate selects an age column as text (the views mix INT and VARCHAR with sentinels) and a date column as a
// DATE, NULL when it is not one.
func pcxDayDate(ageColumn, dateColumn, as string) string {
	return fmt.Sprintf("CAST(%s AS VARCHAR) AS %s_day, CAST(%s AS DATE) AS %s_date", ageColumn, as, dateColumn, as)
}

func dayDate(day *string, date *types.DateISO8601) types.PatientDayDate {
	return types.PatientDayDate{Day: pcxDay(day), Date: date}
}

// GetPatient returns the patient page of patient_key, nil when the key matches no patient the caller can see.
// Every view is read as the caller, with the identifier the caller sees, so PHI is already resolved per row.
func (r *PcxPatientsRepository) GetPatient(ctx context.Context, patientKey string) (*types.PatientEntity, error) {
	db := r.db.WithContext(ctx)
	columns := make([]string, len(types.PcxPatientsQueryConfig.DefaultFields))
	for i, field := range types.PcxPatientsQueryConfig.DefaultFields {
		columns[i] = fmt.Sprintf("%s.%s AS %s", field.Table.Alias, field.Name, field.GetAlias())
	}
	var items []types.PatientListItem
	tx := db.Table(fmt.Sprintf("%s %s", types.PcxPatientListTable.TenantQualifiedName(ctx), types.PcxPatientListTable.Alias)).
		Select(columns).Where("pl.patient_key = ?", patientKey).Limit(1)
	if err := tx.Find(&items).Error; err != nil {
		return nil, fmt.Errorf("error fetching patient: %w", err)
	}
	if len(items) == 0 {
		return nil, nil
	}

	patient := types.PatientEntity{PatientListItem: items[0]}
	id := pcxPatientIdentifier{patient.OrganizationCode, patient.PatientIDType, patient.PatientID}
	for _, fill := range []func(context.Context, *gorm.DB, pcxPatientIdentifier, *types.PatientEntity) error{
		fillPcxDemographics, fillPcxVitalStatus, fillPcxEvents, fillPcxSurgeries, fillPcxRadiations, fillPcxTherapies,
		fillPcxImaging, fillPcxTreatmentSummary,
	} {
		if err := fill(ctx, db, id, &patient); err != nil {
			return nil, err
		}
	}
	cases, err := r.patientCases(ctx, patient.RadiantPatientID)
	if err != nil {
		return nil, err
	}
	patient.Cases = cases
	caseIDs := make([]int, len(cases))
	for i, c := range cases {
		caseIDs[i] = c.CaseID
	}
	if patient.Interpretations, err = r.patientInterpretations(ctx, caseIDs); err != nil {
		return nil, err
	}
	patient.KeyDates = pcxKeyDates(patient.TreatmentSummary, patient.Events, patient.VitalStatusAt)
	return &patient, nil
}

func pcxView(ctx context.Context, db *gorm.DB, table types.Table, id pcxPatientIdentifier) *gorm.DB {
	return db.Table(table.TenantQualifiedName(ctx)).
		Where("organization_code = ? AND patient_id_type = ? AND patient_id = ?", id.organizationCode, id.patientIDType, id.patientID)
}

func fillPcxDemographics(ctx context.Context, db *gorm.DB, id pcxPatientIdentifier, p *types.PatientEntity) error {
	var rows []struct {
		BirthDate           *types.DateISO8601
		Race                *string
		Ethnicity           *string
		AddressPostalCode   *string
		DiagnosisTypeCohort *string
		DataTypeCohort      *string
	}
	tx := pcxView(ctx, db, types.PcxDemographicsTable, id).
		Select("CAST(birth_date AS DATE) AS birth_date, race, ethnicity, address_postal_code, diagnosis_type_cohort, data_type_cohort").Limit(1)
	if err := tx.Find(&rows).Error; err != nil {
		return fmt.Errorf("error fetching patient demographics: %w", err)
	}
	if len(rows) == 1 {
		row := rows[0]
		p.BirthDate, p.Race, p.Ethnicity, p.PostalCode = row.BirthDate, row.Race, row.Ethnicity, row.AddressPostalCode
		p.DiagnosisTypeCohort, p.DataTypeCohort = row.DiagnosisTypeCohort, row.DataTypeCohort
	}
	return nil
}

func fillPcxVitalStatus(ctx context.Context, db *gorm.DB, id pcxPatientIdentifier, p *types.PatientEntity) error {
	var rows []struct {
		VitalDay  *string
		VitalDate *types.DateISO8601
	}
	tx := pcxView(ctx, db, types.PcxPatientLevelTable, id).Select(pcxDayDate("age_at_vital_status_days", "vital_status_date", "vital")).Limit(1)
	if err := tx.Find(&rows).Error; err != nil {
		return fmt.Errorf("error fetching patient vital status: %w", err)
	}
	if len(rows) == 1 {
		p.VitalStatusAt = dayDate(rows[0].VitalDay, rows[0].VitalDate)
	}
	return nil
}

// pcxOrderByDay sorts on a day column of mixed INT/VARCHAR values: known days first, in order.
func pcxOrderByDay(column string) string {
	day := fmt.Sprintf("CASE WHEN CAST(%s AS VARCHAR) REGEXP '^[0-9]+$' THEN CAST(%s AS BIGINT) END", column, column)
	return fmt.Sprintf("%s IS NULL, %s", day, day)
}

func fillPcxEvents(ctx context.Context, db *gorm.DB, id pcxPatientIdentifier, p *types.PatientEntity) error {
	var rows []struct {
		EventType                    *string
		EventDay                     *string
		EventDate                    *types.DateISO8601
		CnsDiagnosisCategory         *string
		CnsIntegratedDiagnosis       *string
		CnsIntegratedDiagnosisSource *string
		TumorLocations               *string
		TumorLocationOther           *string
		Metastasis                   *string
		MetastasisLocation           *string
		MetastasisLocationOther      *string
	}
	tx := pcxView(ctx, db, types.PcxEventLevelTable, id).
		Select("event_type, " + pcxDayDate("age_at_event_days", "event_date", "event") + ", cns_diagnosis_category, " +
			"cns_integrated_diagnosis, cns_integrated_diagnosis_source, tumor_locations, tumor_location_other, metastasis, " +
			"metastasis_location, metastasis_location_other").
		Order(pcxOrderByDay("age_at_event_days") + ", event_type")
	if err := tx.Find(&rows).Error; err != nil {
		return fmt.Errorf("error fetching patient events: %w", err)
	}
	p.Events = make([]types.PatientEvent, len(rows))
	for i, row := range rows {
		eventType, err := pcxEventType(row.EventType)
		if err != nil {
			return err
		}
		p.Events[i] = types.PatientEvent{
			PatientDayDate: dayDate(row.EventDay, row.EventDate), EventType: eventType,
			CnsDiagnosisCategory: row.CnsDiagnosisCategory, CnsIntegratedDiagnosis: row.CnsIntegratedDiagnosis,
			CnsIntegratedDiagnosisSource: row.CnsIntegratedDiagnosisSource,
			TumorLocations:               pcxList(row.TumorLocations, ";"), TumorLocationOther: row.TumorLocationOther,
			Metastasis: row.Metastasis, MetastasisLocations: pcxList(row.MetastasisLocation, ";"),
			MetastasisLocationOther: row.MetastasisLocationOther,
		}
	}
	return nil
}

func fillPcxSurgeries(ctx context.Context, db *gorm.DB, id pcxPatientIdentifier, p *types.PatientEntity) error {
	var rows []struct {
		SurgeryDay             *string
		SurgeryDate            *types.DateISO8601
		ExtentOfTumorResection *string
		IsInitialTreatment     *string
	}
	tx := pcxView(ctx, db, types.PcxSurgeryLevelTable, id).
		Select(pcxDayDate("age_at_surgery_days", "surgery_date", "surgery") + ", extent_of_tumor_resection, is_initial_treatment").
		Order(pcxOrderByDay("age_at_surgery_days"))
	if err := tx.Find(&rows).Error; err != nil {
		return fmt.Errorf("error fetching patient surgeries: %w", err)
	}
	p.Surgeries = make([]types.PatientSurgery, len(rows))
	for i, row := range rows {
		p.Surgeries[i] = types.PatientSurgery{PatientDayDate: dayDate(row.SurgeryDay, row.SurgeryDate),
			ExtentOfTumorResection: row.ExtentOfTumorResection, IsInitialTreatment: pcxYesNo(row.IsInitialTreatment)}
	}
	return nil
}

func fillPcxRadiations(ctx context.Context, db *gorm.DB, id pcxPatientIdentifier, p *types.PatientEntity) error {
	var rows []struct {
		StartDay                    *string
		StartDate                   *types.DateISO8601
		StopDay                     *string
		StopDate                    *types.DateISO8601
		RadiationSite               *string
		RadiationSiteOther          *string
		RadiationType               *string
		RadiationTypeOther          *string
		TotalRadiationDose          *string
		TotalRadiationDoseUnit      *string
		TotalRadiationDoseFocal     *string
		TotalRadiationDoseFocalUnit *string
		IsInitialTreatment          *string
	}
	tx := pcxView(ctx, db, types.PcxRadiationLevelTable, id).
		Select(pcxDayDate("age_at_radiation_start_days", "radiation_start_date", "start") + ", " +
			pcxDayDate("age_at_radiation_stop_days", "radiation_stop_date", "stop") + ", radiation_site, radiation_site_other, " +
			"radiation_type, radiation_type_other, CAST(total_radiation_dose AS VARCHAR) AS total_radiation_dose, " +
			"total_radiation_dose_unit, CAST(total_radiation_dose_focal AS VARCHAR) AS total_radiation_dose_focal, " +
			"total_radiation_dose_focal_unit, is_initial_treatment").
		Order(pcxOrderByDay("age_at_radiation_start_days"))
	if err := tx.Find(&rows).Error; err != nil {
		return fmt.Errorf("error fetching patient radiations: %w", err)
	}
	p.Radiations = make([]types.PatientRadiation, len(rows))
	for i, row := range rows {
		craniospinal := types.PatientDose{Value: row.TotalRadiationDose, Unit: row.TotalRadiationDoseUnit}
		primary := types.PatientDose{Value: row.TotalRadiationDoseFocal, Unit: row.TotalRadiationDoseFocalUnit}
		p.Radiations[i] = types.PatientRadiation{
			Start: dayDate(row.StartDay, row.StartDate), Stop: dayDate(row.StopDay, row.StopDate),
			Site: row.RadiationSite, SiteOther: row.RadiationSiteOther, Type: row.RadiationType, TypeOther: row.RadiationTypeOther,
			CraniospinalDose: craniospinal, TotalPrimaryDose: primary, FocalBoostDose: pcxFocalBoost(craniospinal, primary),
			IsInitialTreatment: pcxYesNo(row.IsInitialTreatment),
		}
	}
	return nil
}

func fillPcxTherapies(ctx context.Context, db *gorm.DB, id pcxPatientIdentifier, p *types.PatientEntity) error {
	var rows []struct {
		StartDay           *string
		StartDate          *types.DateISO8601
		StopDay            *string
		StopDate           *types.DateISO8601
		ProtocolNameAndArm *string
		ProtocolName       *string
		ProtocolArm        *string
		ChemotherapyType   *string
		ChemotherapyAgents *string
		IsInitialTreatment *string
	}
	tx := pcxView(ctx, db, types.PcxMedicalTherapyTable, id).
		Select(pcxDayDate("age_at_regimen_start_days", "regimen_start_date", "start") + ", " +
			pcxDayDate("age_at_regimen_stop_days", "regimen_stop_date", "stop") + ", protocol_name_and_arm, protocol_name, " +
			"protocol_arm, chemotherapy_type, chemotherapy_agents, is_initial_treatment").
		Order(pcxOrderByDay("age_at_regimen_start_days"))
	if err := tx.Find(&rows).Error; err != nil {
		return fmt.Errorf("error fetching patient therapies: %w", err)
	}
	p.Therapies = make([]types.PatientTherapy, len(rows))
	for i, row := range rows {
		p.Therapies[i] = types.PatientTherapy{
			Start: dayDate(row.StartDay, row.StartDate), Stop: dayDate(row.StopDay, row.StopDate),
			ProtocolNameAndArm: row.ProtocolNameAndArm, ProtocolName: row.ProtocolName, ProtocolArm: row.ProtocolArm,
			ChemotherapyType: row.ChemotherapyType, ChemotherapyAgents: pcxList(row.ChemotherapyAgents, ","),
			IsInitialTreatment: pcxYesNo(row.IsInitialTreatment),
		}
	}
	return nil
}

func fillPcxImaging(ctx context.Context, db *gorm.DB, id pcxPatientIdentifier, p *types.PatientEntity) error {
	var rows []struct {
		SessionDay      *string
		SessionDate     *types.DateISO8601
		SessionID       string
		SessionName     string
		AnatomicalSite  *string
		ImagingModality *string
		FlywheelURL     *string `gorm:"column:flywheel_url"`
	}
	tx := pcxView(ctx, db, types.PcxMriImagesTable, id).
		Select(pcxDayDate("age_at_session_days", "session_date", "session") + ", session_id, session_name, anatomical_site, " +
			"imaging_modality, flywheel_url").
		Order(pcxOrderByDay("age_at_session_days") + ", session_id")
	if err := tx.Find(&rows).Error; err != nil {
		return fmt.Errorf("error fetching patient imaging: %w", err)
	}
	p.Imaging = make([]types.PatientImagingSession, len(rows))
	for i, row := range rows {
		p.Imaging[i] = types.PatientImagingSession{PatientDayDate: dayDate(row.SessionDay, row.SessionDate),
			SessionID: row.SessionID, SessionName: row.SessionName, AnatomicalSite: row.AnatomicalSite,
			ImagingModality: row.ImagingModality, FlywheelURL: row.FlywheelURL}
	}
	return nil
}

func fillPcxTreatmentSummary(ctx context.Context, db *gorm.DB, id pcxPatientIdentifier, p *types.PatientEntity) error {
	var rows []struct {
		InitialDxDay              *string
		InitialDxDate             *types.DateISO8601
		FirstEventDay             *string
		FirstEventDate            *types.DateISO8601
		FirstRadiationEverDay     *string
		FirstRadiationEverDate    *types.DateISO8601
		InitialRadiationDay       *string
		InitialRadiationDate      *types.DateISO8601
		FirstChemoEverDay         *string
		FirstChemoEverDate        *types.DateISO8601
		InitialChemoDay           *string
		InitialChemoDate          *types.DateISO8601
		FirstMethotrexateEverDay  *string
		FirstMethotrexateEverDate *types.DateISO8601
		HadInitialRadiation       *string
		HadInitialChemo           *string
		HadInitialMethotrexate    *string
		InitialTreatmentOrder     *string
	}
	selects := []string{}
	for _, m := range []string{"initial_dx", "first_event", "first_radiation_ever", "initial_radiation", "first_chemo_ever",
		"initial_chemo", "first_methotrexate_ever"} {
		selects = append(selects, pcxDayDate("age_at_"+m+"_days", m+"_date", m))
	}
	tx := pcxView(ctx, db, types.PcxTreatmentSummaryTable, id).
		Select(strings.Join(selects, ", ") + ", had_initial_radiation, had_initial_chemo, had_initial_methotrexate, initial_treatment_order").
		Limit(1)
	if err := tx.Find(&rows).Error; err != nil {
		return fmt.Errorf("error fetching patient treatment summary: %w", err)
	}
	if len(rows) == 0 {
		return nil
	}
	row := rows[0]
	yes := func(v *string) bool { b := pcxYesNo(v); return b != nil && *b }
	p.TreatmentSummary = &types.PatientTreatmentSummary{
		InitialDx:              dayDate(row.InitialDxDay, row.InitialDxDate),
		FirstEvent:             dayDate(row.FirstEventDay, row.FirstEventDate),
		FirstRadiationEver:     dayDate(row.FirstRadiationEverDay, row.FirstRadiationEverDate),
		InitialRadiation:       dayDate(row.InitialRadiationDay, row.InitialRadiationDate),
		FirstChemoEver:         dayDate(row.FirstChemoEverDay, row.FirstChemoEverDate),
		InitialChemo:           dayDate(row.InitialChemoDay, row.InitialChemoDate),
		FirstMethotrexateEver:  dayDate(row.FirstMethotrexateEverDay, row.FirstMethotrexateEverDate),
		HadInitialRadiation:    yes(row.HadInitialRadiation),
		HadInitialChemo:        yes(row.HadInitialChemo),
		HadInitialMethotrexate: yes(row.HadInitialMethotrexate),
		InitialTreatmentOrder:  row.InitialTreatmentOrder,
	}
	return nil
}

// patientCases are the portal cases of the patient, as proband or as a family member. The family table also lists
// the proband of each case, hence the exclusion in the second part.
func (r *PcxPatientsRepository) patientCases(ctx context.Context, radiantPatientID *int) ([]types.PatientCase, error) {
	cases := []types.PatientCase{}
	if radiantPatientID == nil {
		return cases, nil
	}
	db := r.db.WithContext(ctx)
	caseTable := fmt.Sprintf("%s c", types.CaseTable.TenantQualifiedName(ctx))
	asProband := db.Table(caseTable).Select("c.id AS case_id, 'proband' AS relationship").Where("c.proband_id = ?", *radiantPatientID)
	asMember := db.Table(caseTable).
		Joins(fmt.Sprintf("JOIN %s f ON f.case_id = c.id", types.FamilyTable.TenantQualifiedName(ctx))).
		Select("c.id AS case_id, f.relationship_to_proband_code AS relationship").
		Where("f.family_member_id = ? AND f.family_member_id <> c.proband_id", *radiantPatientID)
	mondo := db.Table(types.MondoTable.TenantQualifiedName(ctx)).Select("id, max(name) AS name").Group("id")

	tx := db.Table("(? UNION ?) pc", asProband, asMember).
		Joins(fmt.Sprintf("JOIN %s ON c.id = pc.case_id", caseTable)).
		Joins(fmt.Sprintf("LEFT JOIN %s ca ON ca.id = c.analysis_catalog_id", types.AnalysisCatalogTable.TenantQualifiedName(ctx))).
		Joins("LEFT JOIN (?) mondo ON mondo.id = c.primary_condition", mondo).
		Joins(fmt.Sprintf("LEFT JOIN %s org ON org.code = c.ordering_organization_code AND org.tenant_code = c.tenant_code",
			types.OrganizationTable.TenantQualifiedName(ctx))).
		Joins("LEFT JOIN (?) members_count ON members_count.case_id = c.id", caseMembersCount(ctx, db)).
		Select("pc.case_id, pc.relationship, c.status_code, c.priority_code, c.case_type_code, " + caseTypeColumn + ", " +
			"ca.code AS analysis_catalog_code, ca.name AS analysis_catalog_name, c.primary_condition AS primary_condition_id, " +
			"mondo.name AS primary_condition_name, c.ordering_organization_code, org.name AS ordering_organization_name, " +
			"c.diagnosis_lab_code, c.updated_on").
		Order("c.updated_on desc, pc.case_id desc")
	if err := tx.Find(&cases).Error; err != nil {
		return nil, fmt.Errorf("error fetching patient cases: %w", err)
	}
	return cases, nil
}

// patientInterpretations are the germline and somatic interpretations of the given cases, latest first. Gene and
// amino acid change come from the interpreted transcript, not the picked consequence. The interpretation tables
// store case, sequencing and locus ids as text.
func (r *PcxPatientsRepository) patientInterpretations(ctx context.Context, caseIDs []int) ([]types.PatientInterpretation, error) {
	interpretations := []types.PatientInterpretation{}
	if len(caseIDs) == 0 {
		return interpretations, nil
	}
	db := r.db.WithContext(ctx)
	part := func(table types.Table, origin, classification string) *gorm.DB {
		return db.Table(fmt.Sprintf("%s i", table.TenantQualifiedName(ctx))).
			Joins(fmt.Sprintf("JOIN %s c ON c.id = CAST(i.case_id AS INT)", types.CaseTable.TenantQualifiedName(ctx))).
			Joins(fmt.Sprintf("LEFT JOIN %s ca ON ca.id = c.analysis_catalog_id", types.AnalysisCatalogTable.TenantQualifiedName(ctx))).
			Joins(fmt.Sprintf("LEFT JOIN %s v ON v.locus_id = CAST(i.locus_id AS BIGINT)", types.VariantTable.TenantQualifiedName(ctx))).
			Joins(fmt.Sprintf("LEFT JOIN %s csq ON csq.locus_id = CAST(i.locus_id AS BIGINT) AND csq.transcript_id = i.transcript_id",
				types.ConsequenceTable.TenantQualifiedName(ctx))).
			Select(fmt.Sprintf("'%s' AS origin, CAST(i.case_id AS INT) AS case_id, CAST(i.sequencing_id AS INT) AS sequencing_id, "+
				"i.locus_id, v.hgvsg, csq.symbol, csq.aa_change, %s AS classification, ca.code AS analysis_catalog_code, "+
				"ca.name AS analysis_catalog_name, i.updated_at", origin, classification)).
			Where("CAST(i.case_id AS INT) IN ?", caseIDs)
	}
	tx := db.Table("(? UNION ALL ?) interpretations",
		part(types.InterpretationGermlineTable, "germline", "i.classification"),
		part(types.InterpretationSomaticTable, "somatic", "i.oncogenicity")).
		Order("updated_at desc, case_id desc, locus_id, origin")
	if err := tx.Find(&interpretations).Error; err != nil {
		return nil, fmt.Errorf("error fetching patient interpretations: %w", err)
	}
	return interpretations, nil
}

// pcxKeyDates: the initial diagnosis follows the list's age_at_initial_dx_days, the treatment summary's initial
// diagnosis when known, else the first Initial CNS Tumor event with a known day. The latest encounter is the last
// known vital status, which the source records at an encounter.
func pcxKeyDates(summary *types.PatientTreatmentSummary, events []types.PatientEvent, vitalStatusAt types.PatientDayDate) types.PatientKeyDates {
	keyDates := types.PatientKeyDates{
		InitialDiagnosis: types.PatientKeyDate{Source: "clinical"},
		LatestEncounter:  types.PatientKeyDate{PatientDayDate: vitalStatusAt, Source: "registry"},
	}
	for _, event := range events {
		if event.Day != nil && event.EventType == "initial_cns_tumor" {
			keyDates.InitialDiagnosis.PatientDayDate = event.PatientDayDate
			break
		}
	}
	if summary != nil && summary.InitialDx.Day != nil {
		keyDates.InitialDiagnosis.PatientDayDate = summary.InitialDx
	}
	return keyDates
}

// filterValues turns a JSON array of keys into sorted filter values, without nulls or empty keys.
func filterValues(raw *string) ([]types.FiltersValue, error) {
	values := []types.FiltersValue{}
	if raw == nil {
		return values, nil
	}
	var keys []*string
	if err := json.Unmarshal([]byte(*raw), &keys); err != nil {
		return nil, err
	}
	for _, key := range keys {
		if key != nil && *key != "" {
			values = append(values, types.FiltersValue{Key: *key})
		}
	}
	sort.Slice(values, func(i, j int) bool { return values[i].Key < values[j].Key })
	return values, nil
}

// organizationFilterValues turns a JSON array of [code, name] pairs into values labelled by name, one per code.
func organizationFilterValues(raw *string) ([]types.FiltersValue, error) {
	values := []types.FiltersValue{}
	if raw == nil {
		return values, nil
	}
	var pairs [][]*string
	if err := json.Unmarshal([]byte(*raw), &pairs); err != nil {
		return nil, err
	}
	indexByCode := map[string]int{}
	for _, pair := range pairs {
		if len(pair) != 2 || pair[0] == nil {
			continue
		}
		name := ""
		if pair[1] != nil {
			name = *pair[1]
		}
		i, seen := indexByCode[*pair[0]]
		if !seen {
			indexByCode[*pair[0]] = len(values)
			values = append(values, types.FiltersValue{Key: *pair[0], Label: name})
		} else if name > values[i].Label {
			values[i].Label = name
		}
	}
	sort.Slice(values, func(i, j int) bool {
		if values[i].Label != values[j].Label {
			return values[i].Label < values[j].Label
		}
		return values[i].Key < values[j].Key
	})
	return values, nil
}
