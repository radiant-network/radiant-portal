package repository

import (
	"fmt"
	"log"

	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
)

type Observation = types.Observation

type ObservationsRepository struct {
	db *gorm.DB
}

type ObservationsDAO interface {
	GetObservationCodes() ([]string, error)
}

func NewObservationsRepository(db *gorm.DB) *ObservationsRepository {
	if db == nil {
		log.Print("ObservationsRepository: db is nil")
		return nil
	}
	return &ObservationsRepository{db: db}
}

func (r *ObservationsRepository) GetObservationCodes() ([]string, error) {
	var observationCodes []string
	tx := r.db.
		Table(types.ObservationTable.Name).
		Select("code").
		Order("code asc")
	if err := tx.Find(&observationCodes).Error; err != nil {
		return nil, fmt.Errorf("error retrieving observation codes: %w", err)
	}
	return observationCodes, nil
}
