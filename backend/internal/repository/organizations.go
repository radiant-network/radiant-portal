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
	GetOrganizationById(id int) (*types.Organization, error)
	GetOrganizationByCode(organizationCode string) (*types.Organization, error)
}

func NewOrganizationRepository(db *gorm.DB) *OrganizationRepository {
	return &OrganizationRepository{db: db}
}

func (r *OrganizationRepository) GetOrganizationById(id int) (*types.Organization, error) {
	var organization types.Organization
	tx := r.db.Table(types.OrganizationTable.Name).Where("id = ?", id)
	if err := tx.First(&organization).Error; err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("error retrieving organization by id: %w", err)
		}
		return nil, nil
	}
	return &organization, nil
}

func (r *OrganizationRepository) GetOrganizationByCode(organizationCode string) (*types.Organization, error) {
	var organization types.Organization
	tx := r.db.Table(types.OrganizationTable.Name).Where("code = ?", organizationCode)
	if err := tx.First(&organization).Error; err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("error retrieving organization by code: %w", err)
		} else {
			return nil, nil
		}
	}
	return &organization, nil
}
