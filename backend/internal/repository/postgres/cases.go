package postgres

import (
	"context"
	"errors"
	"fmt"

	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type Case = types.Case
type AnalysisCatalog = types.AnalysisCatalog

type CasesRepository struct {
	db *gorm.DB
}

func NewCasesRepository(db database.PostgresDB) *CasesRepository {
	return &CasesRepository{db: db.DB}
}

func (r *CasesRepository) CreateCase(ctx context.Context, c *Case) error {
	return r.db.WithContext(ctx).Create(c).Error
}

func (r *CasesRepository) UpdateCaseDiagnosisLabCode(ctx context.Context, caseID int, code string) error {
	return r.db.WithContext(ctx).Table(types.CaseTable.Name).
		Where("id = ?", caseID).
		Update("diagnosis_lab_code", code).Error
}

// UpdateCase replaces a case's scalar fields (used by PUT /cases/batch). It leaves
// proband_id, project_id, submitter_case_id and tenant_code untouched — those are the
// natural key + immutable identity, not updatable fields.
//
// priority_code and resolution_status_code are FK-backed and DB-defaulted columns; unlike
// the plain text fields, writing an empty string for them (an omitted optional field) would
// violate the FK rather than fall back to the default the way a fresh INSERT would. So an
// empty value leaves the existing column untouched instead of clearing it.
func (r *CasesRepository) UpdateCase(ctx context.Context, caseID int, c *Case) error {
	updates := map[string]any{
		"case_type_code":             c.CaseTypeCode,
		"status_code":                c.StatusCode,
		"diagnosis_lab_code":         c.DiagnosisLabCode,
		"condition_code_system":      c.ConditionCodeSystem,
		"primary_condition":          c.PrimaryCondition,
		"case_category_code":         c.CaseCategoryCode,
		"analysis_catalog_id":        c.AnalysisCatalogID,
		"note":                       c.Note,
		"ordering_organization_code": c.OrderingOrganizationCode,
		"ordering_physician":         c.OrderingPhysician,
	}
	if c.PriorityCode != "" {
		updates["priority_code"] = c.PriorityCode
	}
	if c.ResolutionStatusCode != "" {
		updates["resolution_status_code"] = c.ResolutionStatusCode
	}

	tx := r.db.WithContext(ctx).Table(types.CaseTable.Name).Where("id = ?", caseID).Updates(updates)
	if tx.Error != nil {
		return fmt.Errorf("error updating case: %w", tx.Error)
	}
	return nil
}

func (r *CasesRepository) CreateCaseHasSequencingExperiment(ctx context.Context, caseHasSeqExp *types.CaseHasSequencingExperiment) error {
	return r.db.WithContext(ctx).
		Clauses(clause.OnConflict{
			Columns:   []clause.Column{{Name: "case_id"}, {Name: "sequencing_experiment_id"}},
			DoNothing: true,
		}).
		Create(caseHasSeqExp).Error
}

func (r *CasesRepository) GetCaseAnalysisCatalogIdByCode(ctx context.Context, code string) (*AnalysisCatalog, error) {
	var analysisCatalog AnalysisCatalog
	tx := r.db.WithContext(ctx).Table(types.AnalysisCatalogTable.Name).Where("code = ?", code)
	if err := tx.First(&analysisCatalog).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &analysisCatalog, nil
}

func (r *CasesRepository) GetCaseBySubmitterCaseIdAndProjectId(ctx context.Context, submitterCaseId string, projectId int) (*Case, error) {
	var c Case
	tx := r.db.WithContext(ctx).Table(fmt.Sprintf("%s %s", types.CaseTable.Name, types.CaseTable.Alias))
	tx = tx.Where("c.submitter_case_id = ? AND c.project_id = ?", submitterCaseId, projectId)
	if err := tx.First(&c).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, fmt.Errorf("error fetching case by submitter_case_id and project_id: %w", err)
	}
	return &c, nil
}
