package repository

import (
	"errors"
	"fmt"
	"log"

	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
)

type ObservationString = types.ObsString

type ObservationStringRepository struct {
	db *gorm.DB
}

type ObservationStringDAO interface {
	GetById(obsId int) (*ObservationString, error)
	CreateObservationString(observation *ObservationString) error
}

func NewObservationStringRepository(db *gorm.DB) *ObservationStringRepository {
	if db == nil {
		log.Print("ObservationStringRepository: db is nil")
		return nil
	}
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
