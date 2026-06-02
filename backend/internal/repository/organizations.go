package repository

import (
	"errors"
	"fmt"

	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
)

type OrganizationRepository struct {
	db *gorm.DB
}

type OrganizationDAO interface {
	GetOrganizationByCode(organizationCode string) (*types.Organization, error)
	GetOrganizationCodesByTenant(tenantCode string) ([]string, error)
}

func NewOrganizationRepository(db *gorm.DB) *OrganizationRepository {
	return &OrganizationRepository{db: db}
}

func (r *OrganizationRepository) GetOrganizationByCode(organizationCode string) (*types.Organization, error) {
	var organization types.Organization
	tx := r.db.Table(types.OrganizationTable.Name).Where("code = ?", organizationCode)
	if err := tx.First(&organization).Error; err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("error retrieving organization by code: %w", err)
		}
		return nil, nil
	}
	return &organization, nil
}

func (r *OrganizationRepository) GetOrganizationCodesByTenant(tenantCode string) ([]string, error) {
	var codes []string
	if err := r.db.Raw(`SELECT code FROM organization WHERE tenant_code = ? ORDER BY code`, tenantCode).
		Scan(&codes).Error; err != nil {
		return nil, fmt.Errorf("error retrieving organization codes by tenant: %w", err)
	}
	return codes, nil
}
