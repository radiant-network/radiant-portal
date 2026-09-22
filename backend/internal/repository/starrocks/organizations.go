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
	var rows []struct {
		Code               string
		Name               string
		CategoryCode       string
		CategoryName       string
		NotificationEmails *string
	}
	tx := r.db.WithContext(ctx).
		Table(fmt.Sprintf("%s %s", types.OrganizationTable.TenantQualifiedName(ctx), types.OrganizationTable.Alias)).
		Select("org.code, org.name, org.category_code, org.notification_emails, org_cat.name_en AS category_name")
	tx = r.joiner.OrganizationWithCategory(tx)
	if err := tx.Order("lower(org.name)").Scan(&rows).Error; err != nil {
		return nil, fmt.Errorf("error listing organizations: %w", err)
	}
	organizations := make([]types.OrganizationResponse, 0, len(rows))
	for _, row := range rows {
		org := types.OrganizationResponse{Code: row.Code, Name: row.Name, CategoryCode: row.CategoryCode, CategoryName: row.CategoryName}
		if row.NotificationEmails != nil {
			org.NotificationEmails = *row.NotificationEmails
		}
		organizations = append(organizations, org)
	}
	return organizations, nil
}
