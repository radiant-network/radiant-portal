package postgres

import (
	"context"
	"errors"
	"fmt"
	"slices"

	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type CaseGroupsRepository struct {
	db *gorm.DB
}

func NewCaseGroupsRepository(db database.PostgresDB) *CaseGroupsRepository {
	return &CaseGroupsRepository{db: db.DB}
}

// UpsertCaseGroup creates the group or, when the name already exists in the tenant, replaces its
// membership (created_on / created_by keep the original values). Every id must be a case of the
// tenant; otherwise nothing is written and the missing ids come back as *types.UnknownCaseIDsError
// so the handler can answer 400 with the list. Returns the group and its case ids in case_id order.
func (r *CaseGroupsRepository) UpsertCaseGroup(ctx context.Context, tenantCode, name string, caseIDs []int, createdBy string) (*types.CaseGroup, []int, error) {
	ids := types.NormalizeCaseIDs(caseIDs)
	if err := r.checkCasesExist(ctx, tenantCode, ids); err != nil {
		return nil, nil, err
	}
	group := types.CaseGroup{TenantCode: tenantCode, Name: name, CreatedBy: createdBy}
	err := r.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		// DO UPDATE (not DO NOTHING) so RETURNING fills the id on the conflict path too.
		if err := tx.Clauses(clause.OnConflict{
			Columns:   []clause.Column{{Name: "tenant_code"}, {Name: "name"}},
			DoUpdates: clause.Assignments(map[string]interface{}{"name": name}),
		}).Create(&group).Error; err != nil {
			return fmt.Errorf("upsert case group %q in tenant %q: %w", name, tenantCode, err)
		}
		if err := tx.Where("case_group_id = ?", group.ID).Delete(&types.CaseGroupCase{}).Error; err != nil {
			return fmt.Errorf("clear membership of case group %q: %w", name, err)
		}
		if len(ids) == 0 {
			return nil
		}
		rows := make([]types.CaseGroupCase, len(ids))
		for i, id := range ids {
			rows[i] = types.CaseGroupCase{CaseGroupID: group.ID, CaseID: id}
		}
		if err := tx.Create(&rows).Error; err != nil {
			return fmt.Errorf("insert membership of case group %q: %w", name, err)
		}
		return nil
	})
	if err != nil {
		return nil, nil, err
	}
	return r.GetCaseGroupByName(ctx, tenantCode, name)
}

func (r *CaseGroupsRepository) checkCasesExist(ctx context.Context, tenantCode string, caseIDs []int) error {
	if len(caseIDs) == 0 {
		return nil
	}
	var existing []int
	err := r.db.WithContext(ctx).
		Table(types.CaseTable.Name).
		Where("tenant_code = ? AND id IN ?", tenantCode, caseIDs).
		Pluck("id", &existing).Error
	if err != nil {
		return fmt.Errorf("error checking cases %v in tenant %q: %w", caseIDs, tenantCode, err)
	}
	missing := []int{}
	for _, id := range caseIDs {
		if !slices.Contains(existing, id) {
			missing = append(missing, id)
		}
	}
	if len(missing) > 0 {
		return &types.UnknownCaseIDsError{IDs: missing}
	}
	return nil
}

// GetCaseGroupByName returns the group and its case ids in case_id order (the junction's primary
// key order), or (nil, nil, nil) when the name does not exist in the tenant.
func (r *CaseGroupsRepository) GetCaseGroupByName(ctx context.Context, tenantCode, name string) (*types.CaseGroup, []int, error) {
	var group types.CaseGroup
	err := r.db.WithContext(ctx).
		Where("tenant_code = ? AND name = ?", tenantCode, name).
		First(&group).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil, nil
		}
		return nil, nil, fmt.Errorf("error retrieving case group %q in tenant %q: %w", name, tenantCode, err)
	}
	caseIDs := []int{}
	err = r.db.WithContext(ctx).
		Table(types.CaseGroupCaseTable.Name).
		Where("case_group_id = ?", group.ID).
		Order("case_id").
		Pluck("case_id", &caseIDs).Error
	if err != nil {
		return nil, nil, fmt.Errorf("error retrieving cases of case group %q: %w", name, err)
	}
	return &group, caseIDs, nil
}
