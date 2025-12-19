package repository

import (
	"log"

	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
)

type Family = types.Family

type FamilyRepository struct {
	db *gorm.DB
}

type FamilyDAO interface {
	GetFamilyById(familyId int) (*Family, error)
	CreateFamily(family *types.Family) error
}

func NewFamilyRepository(db *gorm.DB) *FamilyRepository {
	if db == nil {
		log.Print("FamilyRepository: db is nil")
		return nil
	}
	return &FamilyRepository{db: db}
}

func (r *FamilyRepository) GetFamilyById(familyId int) (*Family, error) {
	var family Family
	if err := r.db.Table(types.FamilyTable.Name).First(&family, familyId).Error; err != nil {
		return nil, err
	}
	return &family, nil
}

func (r *FamilyRepository) CreateFamily(family *types.Family) error {
	return r.db.Create(family).Error
}
