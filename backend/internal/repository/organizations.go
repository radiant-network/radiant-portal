package repository

import (
	"errors"
	"fmt"
	"log"

	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
)

type Organization = types.Organization

type OrganizationsRepository struct {
	db *gorm.DB
}

type OrganizationsDAO interface {
	GetOrganizations() (*[]Organization, error)
}

func NewOrganizationsRepository(db *gorm.DB) *OrganizationsRepository {
	if db == nil {
		log.Fatal("OrganizationsRepository: db is nil")
		return nil
	}
	return &OrganizationsRepository{db: db}
}

func (r *OrganizationsRepository) GetOrganizations() (*[]Organization, error) {
	tx := r.db.Table(types.OrganizationTable.Name).
		Preload("Category")
	var organizations []Organization
	if err := tx.Find(&organizations).Error; err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("error while fetching organizations: %w", err)
		} else {
			return nil, nil
		}
	}

	return &organizations, nil
}
