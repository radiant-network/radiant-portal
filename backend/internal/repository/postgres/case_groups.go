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

// UpsertCaseGroup creates the group or, when the name already exists in the tenant, overwrites
// its case list (created_on / created_by keep the original values). Every id must be a case of
// the tenant; otherwise nothing is written and the missing ids come back as
// *types.UnknownCaseIDsError so the handler can answer 400 with the list.
func (r *CaseGroupsRepository) UpsertCaseGroup(ctx context.Context, tenantCode, name string, caseIDs []int, createdBy string) (*types.CaseGroup, error) {
	if err := r.checkCasesExist(ctx, tenantCode, caseIDs); err != nil {
		return nil, err
	}
	group := types.CaseGroup{
		TenantCode: tenantCode,
		Name:       name,
		CaseIDs:    types.JoinCaseIDs(caseIDs),
		CreatedBy:  createdBy,
	}
	err := r.db.WithContext(ctx).
		Clauses(clause.OnConflict{
			Columns:   []clause.Column{{Name: "tenant_code"}, {Name: "name"}},
			DoUpdates: clause.AssignmentColumns([]string{"case_ids"}),
		}).
		Create(&group).Error
	if err != nil {
		return nil, fmt.Errorf("error upserting case group %q in tenant %q: %w", name, tenantCode, err)
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
		slices.Sort(missing)
		return &types.UnknownCaseIDsError{IDs: slices.Compact(missing)}
	}
	return nil
}

func (r *CaseGroupsRepository) GetCaseGroupByName(ctx context.Context, tenantCode, name string) (*types.CaseGroup, error) {
	var group types.CaseGroup
	err := r.db.WithContext(ctx).
		Where("tenant_code = ? AND name = ?", tenantCode, name).
		First(&group).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, fmt.Errorf("error retrieving case group %q in tenant %q: %w", name, tenantCode, err)
	}
	return &group, nil
}
