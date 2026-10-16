package starrocks

import (
	"context"
	"fmt"
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

func (r *PcxPatientsRepository) SearchPatients(ctx context.Context, query types.ListQuery) ([]types.PatientListItem, int64, error) {
	db := r.db.WithContext(ctx)
	// patient_name only exists where the caller can read PHI, so a name criterion never matches a restricted patient.
	list := db.Table(types.PcxPatientListTable.TenantQualifiedName(ctx)).
		Select(fmt.Sprintf("*, CASE WHEN can_read_phi THEN concat(given_name, ' ', family_name) END AS patient_name, %s AS age_at_initial_dx_group", ageAtInitialDxGroupSQL))
	tx := db.Table(fmt.Sprintf("(?) %s", types.PcxPatientListTable.Alias), list)
	utils.AddWhere(query, tx)

	var count int64
	if err := tx.Count(&count).Error; err != nil {
		return nil, 0, fmt.Errorf("error counting patients: %w", err)
	}

	columns := make([]string, len(query.SelectedFields()))
	for i, field := range query.SelectedFields() {
		columns[i] = fmt.Sprintf("%s.%s AS %s", field.Table.Alias, field.Name, field.GetAlias())
	}
	tx = tx.Select(columns)
	utils.AddPaginationAndSort(tx, query)

	patients := []types.PatientListItem{}
	if err := tx.Find(&patients).Error; err != nil {
		return nil, 0, fmt.Errorf("error searching patients: %w", err)
	}
	return patients, count, nil
}

// AutocompletePatients suggests identifiers that start with prefix and, where the caller can read PHI, full names
// with a word that starts with it: "pat" finds "William Patel". Case-insensitive; % and _ in prefix are literal.
func (r *PcxPatientsRepository) AutocompletePatients(ctx context.Context, prefix string, limit int) ([]types.AutocompleteResult, error) {
	db := r.db.WithContext(ctx)
	view := types.PcxPatientListTable.TenantQualifiedName(ctx)
	escaped := likeEscaper.Replace(strings.ToLower(prefix))

	ids := db.Table(view).Select("'patient_id' AS type, patient_id AS value").
		Where("lower(patient_id) LIKE ?", escaped+"%")
	names := db.Table(view).Select("'patient_name' AS type, concat(given_name, ' ', family_name) AS value").
		Where("can_read_phi AND lower(concat(' ', given_name, ' ', family_name)) LIKE ?", "% "+escaped+"%")

	results := []types.AutocompleteResult{}
	tx := db.Table("(? UNION ?) suggestions", ids, names).Order("value asc, type asc").Limit(limit)
	if err := tx.Find(&results).Error; err != nil {
		return nil, fmt.Errorf("error autocompleting patients: %w", err)
	}
	return results, nil
}

var likeEscaper = strings.NewReplacer(`\`, `\\`, `%`, `\%`, `_`, `\_`)

// 36 months is 1,096 days (3 x 365.25, rounded up). The view turns every non-numeric age (-1, Not Reported...) into NULL.
const ageAtInitialDxGroupSQL = "CASE WHEN age_at_initial_dx_days < 1096 THEN 'under_36_months' WHEN age_at_initial_dx_days >= 1096 THEN '36_months_and_over' ELSE 'unknown' END"

func booleanFilterSQL(column string) string {
	return fmt.Sprintf("CASE WHEN %s THEN 'true' WHEN NOT %s THEN 'false' END", column, column)
}

var booleanFilterLabels = map[string]string{"true": "Yes", "false": "No"}

// GetPatientsFilters returns the values of the list filters among the patients the caller can see.
func (r *PcxPatientsRepository) GetPatientsFilters(ctx context.Context) (*types.PatientFilters, error) {
	db := r.db.WithContext(ctx)
	view := types.PcxPatientListTable.TenantQualifiedName(ctx)
	filters := types.PatientFilters{
		VitalStatus: []types.FiltersValue{}, OrganizationCode: []types.FiltersValue{}, CnsIntegratedDiagnosis: []types.FiltersValue{},
		DiagnosisTypeCohort: []types.FiltersValue{}, AgeAtInitialDxGroup: []types.FiltersValue{},
		HadInitialRadiation: []types.FiltersValue{}, HadInitialMethotrexate: []types.FiltersValue{},
	}

	for _, filter := range []struct {
		name  string
		key   string
		order string
		dest  *[]types.FiltersValue
	}{
		{"vital_status", "vital_status", "`key` asc", &filters.VitalStatus},
		{"cns_integrated_diagnosis", "cns_integrated_diagnosis", "`key` asc", &filters.CnsIntegratedDiagnosis},
		{"diagnosis_type_cohort", "diagnosis_type_cohort", "`key` asc", &filters.DiagnosisTypeCohort},
		{"age_at_initial_dx_group", ageAtInitialDxGroupSQL, "CASE `key` WHEN 'under_36_months' THEN 1 WHEN '36_months_and_over' THEN 2 ELSE 3 END", &filters.AgeAtInitialDxGroup},
		{"had_initial_radiation", booleanFilterSQL("had_initial_radiation"), "`key` desc", &filters.HadInitialRadiation},
		{"had_initial_methotrexate", booleanFilterSQL("had_initial_methotrexate"), "`key` desc", &filters.HadInitialMethotrexate},
	} {
		keys := db.Table(view).Select(fmt.Sprintf("%s AS `key`", filter.key))
		tx := db.Table("(?) k", keys).Distinct("`key`").Where("`key` IS NOT NULL").Order(filter.order)
		if err := tx.Find(filter.dest).Error; err != nil {
			return nil, fmt.Errorf("error fetching patient filter %s: %w", filter.name, err)
		}
	}
	for _, values := range [][]types.FiltersValue{filters.HadInitialRadiation, filters.HadInitialMethotrexate} {
		for i := range values {
			values[i].Label = booleanFilterLabels[values[i].Key]
		}
	}

	tx := db.Table(view).Select("organization_code AS `key`, max(organization_name) AS label").
		Where("organization_code IS NOT NULL").Group("organization_code").Order("label asc, `key` asc")
	if err := tx.Find(&filters.OrganizationCode).Error; err != nil {
		return nil, fmt.Errorf("error fetching patient filter organization_code: %w", err)
	}
	return &filters, nil
}
