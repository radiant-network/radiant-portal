package repository

import (
	"fmt"
	"log"

	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
)

type Onset = types.Onset

type OnsetsRepository struct {
	db *gorm.DB
}

type OnsetsDAO interface {
	GetOnsetCodes() ([]string, error)
}

func NewOnsetsRepository(db *gorm.DB) *OnsetsRepository {
	if db == nil {
		log.Print("OnsetsRepository: db is nil")
		return nil
	}
	return &OnsetsRepository{db: db}
}

func (r *OnsetsRepository) GetOnsetCodes() ([]string, error) {
	var onsetCodes []string
	tx := r.db.
		Table(types.OnsetTable.Name).
		Select("code").
		Order("code asc")
	if err := tx.Find(&onsetCodes).Error; err != nil {
		return nil, fmt.Errorf("error retrieving onset codes: %w", err)
	}
	return onsetCodes, nil
}
