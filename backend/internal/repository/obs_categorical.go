package repository

import (
	"errors"
	"fmt"

	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
)

type ObservationCategorical = types.ObsCategorical

type ObservationCategoricalRepository struct {
	db *gorm.DB
}

func NewObservationCategoricalRepository(db *gorm.DB) *ObservationCategoricalRepository {
	return &ObservationCategoricalRepository{db: db}
}

func (r *ObservationCategoricalRepository) GetById(observationId int) (*ObservationCategorical, error) {
	var obs ObservationCategorical
	if err := r.db.Table(types.ObsCategoricalTable.Name).First(&obs, observationId).Error; err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("error while fetching observation_categorical: %w", err)
		} else {
			return nil, nil
		}
	}
	return &obs, nil
}

func (r *ObservationCategoricalRepository) CreateObservationCategorical(observation *ObservationCategorical) error {
	return r.db.Create(observation).Error
}
