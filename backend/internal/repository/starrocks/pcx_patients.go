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
		Select("*, CASE WHEN can_read_phi THEN concat(given_name, ' ', family_name) END AS patient_name")
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

// AutocompletePatients suggests identifiers and, where the caller can read PHI, full names that start with prefix
// (case-insensitive). The prefix is matched literally: % and _ are escaped.
func (r *PcxPatientsRepository) AutocompletePatients(ctx context.Context, prefix string, limit int) ([]types.AutocompleteResult, error) {
	db := r.db.WithContext(ctx)
	view := types.PcxPatientListTable.TenantQualifiedName(ctx)
	pattern := likeEscaper.Replace(strings.ToLower(prefix)) + "%"

	ids := db.Table(view).Select("'patient_id' AS type, patient_id AS value").
		Where("lower(patient_id) LIKE ?", pattern)
	names := db.Table(view).Select("'patient_name' AS type, concat(given_name, ' ', family_name) AS value").
		Where("can_read_phi AND lower(concat(given_name, ' ', family_name)) LIKE ?", pattern)

	results := []types.AutocompleteResult{}
	tx := db.Table("(? UNION ?) suggestions", ids, names).Order("value asc, type asc").Limit(limit)
	if err := tx.Find(&results).Error; err != nil {
		return nil, fmt.Errorf("error autocompleting patients: %w", err)
	}
	return results, nil
}

var likeEscaper = strings.NewReplacer(`\`, `\\`, `%`, `\%`, `_`, `\_`)
