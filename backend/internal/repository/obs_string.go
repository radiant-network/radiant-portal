package repository

import (
	"errors"
	"fmt"

	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
)

type ObservationString = types.ObsString

type ObservationStringRepository struct {
	db *gorm.DB
}

func NewObservationStringRepository(db *gorm.DB) *ObservationStringRepository {
	return &ObservationStringRepository{db: db}
}

func (r *ObservationStringRepository) GetById(observationId int) (*ObservationString, error) {
	var obs ObservationString
	if err := r.db.Table(types.ObsStringTable.Name).First(&obs, observationId).Error; err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("error while fetching obs_string: %w", err)
		} else {
			return nil, nil
		}
	}
	return &obs, nil
}

func (r *ObservationStringRepository) CreateObservationString(observation *ObservationString) error {
	return r.db.Create(observation).Error
}
