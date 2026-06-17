package repository

import (
	"context"
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

func (r *ObservationCategoricalRepository) GetById(ctx context.Context, observationId int) (*ObservationCategorical, error) {
	var obs ObservationCategorical
	if err := r.db.WithContext(ctx).Table(types.ObsCategoricalTable.Name).First(&obs, observationId).Error; err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("error while fetching observation_categorical: %w", err)
		} else {
			return nil, nil
		}
	}
	return &obs, nil
}

func (r *ObservationCategoricalRepository) CreateObservationCategorical(ctx context.Context, observation *ObservationCategorical) error {
	return r.db.WithContext(ctx).Create(observation).Error
}
