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
