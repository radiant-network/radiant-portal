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
