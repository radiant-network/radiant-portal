package repository

import (
	"context"
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

func (r *ObservationStringRepository) GetById(ctx context.Context, observationId int) (*ObservationString, error) {
	var obs ObservationString
	if err := r.db.WithContext(ctx).Table(types.ObsStringTable.Name).First(&obs, observationId).Error; err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("error while fetching obs_string: %w", err)
		} else {
			return nil, nil
		}
	}
	return &obs, nil
}

func (r *ObservationStringRepository) CreateObservationString(ctx context.Context, observation *ObservationString) error {
	return r.db.WithContext(ctx).Create(observation).Error
}

func (r *ObservationStringRepository) DeleteObsStringByCaseID(ctx context.Context, caseID int) error {
	return r.db.WithContext(ctx).Where("case_id = ?", caseID).Delete(&ObservationString{}).Error
}
