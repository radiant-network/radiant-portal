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

// lockCaseDiagnosisLab returns the lab a case belongs to and holds the case row until the
// transaction ends, or returns types.ErrCaseNotFound when the tenant holds no such case. It
// takes the handle rather than hanging off CasesRepository so a caller can run it inside its own
// transaction. AuthRepository.OrgsForCase answers the same question for the authorization
// middleware, unlocked, in the shape a resolver needs.
//
// The lock is what makes a read-decide-write on a case serial. Without it two concurrent writers
// read the same state, and Postgres' READ COMMITTED lets each one miss what the other is about
// to commit: two replacements of the assignee set would end up merged rather than one winning.
// Taking it on the case row rather than on what is being written also pins the lab itself, so a
// decision cannot be made against a lab the case has since left. Every writer takes this lock
// first, so they queue in one order and cannot deadlock against each other.
func lockCaseDiagnosisLab(tx *gorm.DB, tenantCode string, caseID int) (string, error) {
	labs := []string{}
	err := tx.Table(types.CaseTable.Name).
		Clauses(clause.Locking{Strength: "UPDATE"}).
		Where("id = ? AND tenant_code = ?", caseID, tenantCode).
		Pluck("diagnosis_lab_code", &labs).Error
	if err != nil {
		return "", fmt.Errorf("error resolving lab of case %d: %w", caseID, err)
	}
	if len(labs) == 0 {
		return "", types.ErrCaseNotFound
	}
	return labs[0], nil
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
// priority_code is a FK-backed, DB-defaulted column; unlike the plain text fields, writing an
// empty string for it (an omitted optional field) would violate the FK rather than fall back to
// the default the way a fresh INSERT would. So an empty value leaves the existing column
// untouched instead of clearing it.
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
		"diagnosis_hypothesis":       c.DiagnosisHypothesis,
		"ordering_organization_code": c.OrderingOrganizationCode,
		"ordering_physician":         c.OrderingPhysician,
	}
	if c.PriorityCode != "" {
		updates["priority_code"] = c.PriorityCode
	}

	tx := r.db.WithContext(ctx).Table(types.CaseTable.Name).Where("id = ?", caseID).Updates(updates)
	if tx.Error != nil {
		return fmt.Errorf("error updating case: %w", tx.Error)
	}
	return nil
}

// PatchCase writes only the fields the given case actually carries and reports whether such a
// case exists.
func (r *CasesRepository) PatchCase(ctx context.Context, caseID int, c *Case) (bool, error) {
	updates := map[string]any{}
	if c.StatusCode != "" {
		updates["status_code"] = c.StatusCode
	}
	if len(updates) == 0 {
		return false, fmt.Errorf("no field to update on case %d", caseID)
	}

	tx := r.db.WithContext(ctx).Model(&types.Case{}).
		Scopes(WithTenant(ctx)).
		Where("id = ?", caseID).
		Updates(updates)
	if tx.Error != nil {
		return false, fmt.Errorf("error patching case %d: %w", caseID, tx.Error)
	}
	return tx.RowsAffected > 0, nil
}

func (r *CasesRepository) CreateCaseHasSequencingExperiment(ctx context.Context, caseHasSeqExp *types.CaseHasSequencingExperiment) error {
	return r.db.WithContext(ctx).
		Clauses(clause.OnConflict{
			Columns:   []clause.Column{{Name: "case_id"}, {Name: "sequencing_experiment_id"}},
			DoNothing: true,
		}).
		Create(caseHasSeqExp).Error
}

// GetCaseAnalysisCatalogIdByCode resolves an analysis code within the tenant — analysis_catalog
// is unique per (code, tenant_code) since migration 000013.
func (r *CasesRepository) GetCaseAnalysisCatalogIdByCode(ctx context.Context, code string, tenantCode string) (*AnalysisCatalog, error) {
	var analysisCatalog AnalysisCatalog
	tx := r.db.WithContext(ctx).Table(types.AnalysisCatalogTable.Name).Where("code = ? AND tenant_code = ?", code, tenantCode)
	if err := tx.First(&analysisCatalog).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &analysisCatalog, nil
}

func (r *CasesRepository) GetCaseBySubmitterCaseIdAndProjectId(ctx context.Context, submitterCaseId string, projectId int, tenantCode string) (*Case, error) {
	var c Case
	tx := r.db.WithContext(ctx).Table(fmt.Sprintf("%s %s", types.CaseTable.Name, types.CaseTable.Alias))
	tx = tx.Where("c.submitter_case_id = ? AND c.project_id = ? AND c.tenant_code = ?", submitterCaseId, projectId, tenantCode)
	if err := tx.First(&c).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, fmt.Errorf("error fetching case by submitter_case_id and project_id: %w", err)
	}
	return &c, nil
}
