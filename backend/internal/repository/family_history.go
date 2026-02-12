package repository

import (
	"errors"
	"fmt"
	"log"

	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
)

type FamilyHistory = types.FamilyHistory

type FamilyHistoryRepository struct {
	db *gorm.DB
}

type FamilyHistoryDAO interface {
	GetById(familyHistoryId int) (*FamilyHistory, error)
	CreateFamilyHistory(familyHistory *FamilyHistory) error
}

func NewFamilyHistoryRepository(db *gorm.DB) *FamilyHistoryRepository {
	if db == nil {
		log.Print("FamilyHistoryRepository: db is nil")
		return nil
	}
	return &FamilyHistoryRepository{db: db}
}

func (r *FamilyHistoryRepository) GetById(familyHistoryId int) (*FamilyHistory, error) {
	var familyHistory FamilyHistory
	if err := r.db.Table(types.FamilyHistoryTable.Name).First(&familyHistory, familyHistoryId).Error; err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("error while fetching family_history: %w", err)
		} else {
			return nil, nil
		}
	}
	return &familyHistory, nil
}

func (r *FamilyHistoryRepository) CreateFamilyHistory(familyHistory *FamilyHistory) error {
	return r.db.Create(familyHistory).Error
}
