package postgres

import (
	"context"
	"errors"
	"fmt"

	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
)

type ProjectsRepository struct {
	db *gorm.DB
}

func NewProjectsRepository(db database.PostgresDB) *ProjectsRepository {
	return &ProjectsRepository{db: db.DB}
}

// ListByTenant scopes on the tenant explicitly rather than through WithTenant, which is a no-op
// until TENANT_VIEWS_READ_ENABLED is on: a beacon must never list another tenant's datasets.
func (r *ProjectsRepository) ListByTenant(ctx context.Context, tenantCode string) ([]types.Project, error) {
	projects := []types.Project{}
	err := r.db.WithContext(ctx).Model(&types.Project{}).
		Where("tenant_code = ?", tenantCode).
		Order("code").
		Find(&projects).Error
	if err != nil {
		return nil, fmt.Errorf("error listing projects for tenant %q: %w", tenantCode, err)
	}
	return projects, nil
}

func (r *ProjectsRepository) GetByCode(ctx context.Context, tenantCode, code string) (*types.Project, error) {
	var project types.Project
	err := r.db.WithContext(ctx).Model(&types.Project{}).
		Where("tenant_code = ? AND code = ?", tenantCode, code).
		Take(&project).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, fmt.Errorf("error fetching project %q for tenant %q: %w", code, tenantCode, err)
	}
	return &project, nil
}
