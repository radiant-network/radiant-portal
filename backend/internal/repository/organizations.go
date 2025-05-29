package repository

import (
	"errors"
	"fmt"
	"log"

	"gorm.io/gorm"
)

type OrganizationsRepository struct {
	db *gorm.DB
}

type OrganizationsDAO interface {
	GetOrganizations() (*[]string, error)
}

func NewOrganizationsRepository(db *gorm.DB) *OrganizationsRepository {
	if db == nil {
		log.Fatal("OrganizationsRepository: db is nil")
		return nil
	}
	return &OrganizationsRepository{db: db}
}

func (r *OrganizationsRepository) GetOrganizations() (*[]string, error) {
	tx := r.db.Table("radiant_jdbc.public.organization").Select("code")
	var codes []string
	err := tx.Find(&codes).Error
	if err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("error while fetching organizations: %w", err)
		} else {
			return nil, nil
		}
	}

	return &codes, err
}
