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
}

func NewOrganizationRepository(db *gorm.DB) *OrganizationRepository {
	return &OrganizationRepository{db: db}
}

func (r *OrganizationRepository) GetOrganizationByCode(organizationCode string) (*types.Organization, error) {
	var organization types.Organization
	tx := r.db.
		Table("organization").
		Where("code = ?", organizationCode)
	if err := tx.First(&organization).Error; err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("error retrieve organization its ID: %w", err)
		} else {
			return nil, nil
		}
	}
	return &organization, nil
}
