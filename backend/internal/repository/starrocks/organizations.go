package starrocks

import (
	"context"
	"fmt"

	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/internal/utils/joins"
	"gorm.io/gorm"
)

type OrganizationsRepository struct {
	db     *gorm.DB
	joiner joins.Joiner
}

func NewOrganizationsRepository(db database.StarrocksDB) *OrganizationsRepository {
	return &OrganizationsRepository{db: db.DB, joiner: joins.Starrocks()}
}

// ListOrganizations returns the active tenant's organizations with their category label. It reads
// through the tenant's StarRocks views (TenantQualifiedName resolves to <code>_tenant when a tenant
// is bound, else the radiant_jdbc federation), so isolation follows the same model as the other
// federated reads — no explicit tenant_code filter.
func (r *OrganizationsRepository) ListOrganizations(ctx context.Context) ([]types.OrganizationResponse, error) {
	organizations := []types.OrganizationResponse{}
	tx := r.db.WithContext(ctx).
		Table(fmt.Sprintf("%s %s", types.OrganizationTable.TenantQualifiedName(ctx), types.OrganizationTable.Alias)).
		Select("org.code, org.name, org.category_code, org_cat.name_en AS category_name")
	tx = r.joiner.OrganizationWithCategory(tx)
	if err := tx.Order("org.name").Scan(&organizations).Error; err != nil {
		return nil, fmt.Errorf("error listing organizations: %w", err)
	}
	return organizations, nil
}
