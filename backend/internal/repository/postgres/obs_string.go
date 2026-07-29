package postgres

import (
	"context"
	"errors"
	"fmt"

	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
)

type ObservationString = types.ObsString

type ObservationStringRepository struct {
	db *gorm.DB
}

func NewObservationStringRepository(db database.PostgresDB) *ObservationStringRepository {
	return &ObservationStringRepository{db: db.DB}
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
	if observation == nil {
		return fmt.Errorf("create obs_string: %w", ErrNilRecord)
	}
	if err := validateSubjectXOR(observation.PatientID, observation.FetusID); err != nil {
		return fmt.Errorf("create obs_string for case %d: %w", observation.CaseID, err)
	}
	return r.db.WithContext(ctx).Create(observation).Error
}

// DeleteNonFetusObsStringByCaseID clears only the patient-owned rows, see
// DeleteNonFetusFamilyByCaseID.
func (r *ObservationStringRepository) DeleteNonFetusObsStringByCaseID(ctx context.Context, caseID int) error {
	return r.db.WithContext(ctx).Where("case_id = ? AND fetus_id IS NULL", caseID).Delete(&ObservationString{}).Error
}
