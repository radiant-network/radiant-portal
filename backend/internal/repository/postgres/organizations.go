package postgres

import (
	"context"
	"errors"
	"fmt"

	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
)

type OrganizationRepository struct {
	db *gorm.DB
}

func NewOrganizationRepository(db database.PostgresDB) *OrganizationRepository {
	return &OrganizationRepository{db: db.DB}
}

func (r *OrganizationRepository) GetOrganizationByCode(ctx context.Context, organizationCode string) (*types.Organization, error) {
	var organization types.Organization
	tx := r.db.WithContext(ctx).Table(types.OrganizationTable.Name).Where("code = ?", organizationCode)
	if err := tx.First(&organization).Error; err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("error retrieving organization by code: %w", err)
		}
		return nil, nil
	}
	return &organization, nil
}

// CreateOrganization inserts an organization in the tenant. A duplicate (code, tenant_code) maps
// to types.ErrOrganizationCodeExists and an unknown category_code (the organization_category FK)
// to types.ErrOrganizationUnknownCategory, so the handler can answer 409 / 400 without knowing
// the DB driver.
func (r *OrganizationRepository) CreateOrganization(ctx context.Context, org types.Organization) error {
	if err := r.db.WithContext(ctx).Omit("Category").Create(&org).Error; err != nil {
		switch {
		case isUniqueViolation(err):
			return types.ErrOrganizationCodeExists
		case isForeignKeyViolation(err):
			return types.ErrOrganizationUnknownCategory
		}
		return fmt.Errorf("error creating organization %q: %w", org.Code, err)
	}
	return nil
}

// UpdateOrganization updates an organization's name within the tenant. Code and category are
// immutable, so only name is written. A code that does not exist in the tenant (or belongs to
// another tenant) affects no rows and maps to types.ErrOrganizationNotFound → 404.
func (r *OrganizationRepository) UpdateOrganization(ctx context.Context, tenantCode, code, name string) error {
	tx := r.db.WithContext(ctx).
		Table(types.OrganizationTable.Name).
		Where("code = ? AND tenant_code = ?", code, tenantCode).
		Update("name", name)
	if tx.Error != nil {
		return fmt.Errorf("error updating organization %q: %w", code, tx.Error)
	}
	if tx.RowsAffected == 0 {
		return types.ErrOrganizationNotFound
	}
	return nil
}
