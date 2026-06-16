package repository

import (
	"errors"
	"fmt"

	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
)

type Family = types.Family

type FamilyRepository struct {
	db *gorm.DB
}

func NewFamilyRepository(db *gorm.DB) *FamilyRepository {
	return &FamilyRepository{db: db}
}

func (r *FamilyRepository) GetFamilyById(familyId int) (*Family, error) {
	var family Family
	if err := r.db.Table(types.FamilyTable.Name).First(&family, familyId).Error; err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("error while fetching family: %w", err)
		} else {
			return nil, nil
		}
	}
	return &family, nil
}

func (r *FamilyRepository) CreateFamily(family *Family) error {
	return r.db.Create(family).Error
}
