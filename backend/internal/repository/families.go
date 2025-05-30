package repository

import (
	"errors"
	"fmt"
	"github.com/Ferlab-Ste-Justine/radiant-api/internal/types"
	"gorm.io/gorm"
	"log"
)

type Family = types.Family

type FamiliesRepository struct {
	db *gorm.DB
}

type FamiliesDAO interface {
	GetFamilies() (*[]Family, error)
}

func NewFamiliesRepository(db *gorm.DB) *FamiliesRepository {
	if db == nil {
		log.Print("FamiliesRepository: db is nil")
		return nil
	}
	return &FamiliesRepository{db: db}
}

func (r *FamiliesRepository) GetFamilies() (*[]Family, error) {
	tx := r.db.Table(types.FamilyTable.Name).
		Preload("Case").
		Preload("FamilyMember").
		Preload("RelationshipToProband").
		Preload("AffectedStatus")
	var families []Family
	err := tx.Find(&families).Error
	if err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("error while fetching families: %w", err)
		} else {
			return nil, nil
		}
	}

	return &families, err
}
