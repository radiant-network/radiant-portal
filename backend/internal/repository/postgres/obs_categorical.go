package postgres

import (
	"context"
	"errors"
	"fmt"

	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
)

type ObservationCategorical = types.ObsCategorical

type ObservationCategoricalRepository struct {
	db *gorm.DB
}

func NewObservationCategoricalRepository(db database.PostgresDB) *ObservationCategoricalRepository {
	return &ObservationCategoricalRepository{db: db.DB}
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
	if observation == nil {
		return fmt.Errorf("create obs_categorical: %w", ErrNilRecord)
	}
	if err := validateSubjectXOR(observation.PatientID, observation.FetusID); err != nil {
		return fmt.Errorf("create obs_categorical for case %d: %w", observation.CaseID, err)
	}
	return r.db.WithContext(ctx).Create(observation).Error
}

// DeleteNonFetusObsCategoricalByCaseID clears only the patient-owned rows, see
// DeleteNonFetusFamilyByCaseID.
func (r *ObservationCategoricalRepository) DeleteNonFetusObsCategoricalByCaseID(ctx context.Context, caseID int) error {
	return r.db.WithContext(ctx).Where("case_id = ? AND fetus_id IS NULL", caseID).Delete(&ObservationCategorical{}).Error
}
