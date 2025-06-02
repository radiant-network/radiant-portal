package repository

import (
	"errors"
	"fmt"
	"github.com/Ferlab-Ste-Justine/radiant-api/internal/types"
	"gorm.io/gorm"
	"log"
)

type ObservationCoding = types.ObservationCoding

type ObservationCodingRepository struct {
	db *gorm.DB
}

type ObservationCodingDAO interface {
	GetObservationCoding() (*[]ObservationCoding, error)
}

func NewObservationCodingRepository(db *gorm.DB) *ObservationCodingRepository {
	if db == nil {
		log.Fatal("ObservationCodingRepository: db is nil")
		return nil
	}
	return &ObservationCodingRepository{db: db}
}

func (r *ObservationCodingRepository) GetObservationCoding() (*[]ObservationCoding, error) {
	tx := r.db.Table(types.ObservationCodingTable.Name).
		Preload("Case").
		Preload("Patient").
		Preload("Observation").
		Preload("Onset").
		Preload("Interpretation")
	var observationCoding []ObservationCoding
	if err := tx.Find(&observationCoding).Error; err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("error while fetching observation coding: %w", err)
		} else {
			return nil, nil
		}
	}

	return &observationCoding, nil
}
