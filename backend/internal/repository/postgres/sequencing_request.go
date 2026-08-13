package postgres

import (
	"context"
	"errors"
	"fmt"

	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type SequencingRequest = types.SequencingRequest

type SequencingRequestRepository struct {
	db *gorm.DB
}

func NewSequencingRequestRepository(db database.PostgresDB) *SequencingRequestRepository {
	return &SequencingRequestRepository{db: db.DB}
}

// UpsertSequencingRequest writes a request, matching on the natural key
// (case_id, submitter_sequencing_request_id). It has to be an upsert rather than an insert:
// update_case resends the whole payload, so the same request is posted repeatedly and would
// otherwise be duplicated. sr.ID is populated from RETURNING on both paths, which is what lets
// the caller link a delivered experiment to the request it fulfills.
func (r *SequencingRequestRepository) UpsertSequencingRequest(ctx context.Context, sr *SequencingRequest) error {
	tx := r.db.WithContext(ctx).
		Clauses(
			clause.OnConflict{
				Columns:   []clause.Column{{Name: "case_id"}, {Name: "submitter_sequencing_request_id"}},
				DoUpdates: clause.AssignmentColumns([]string{"service_id", "patient_id", "status_code", "updated_on"}),
			},
			clause.Returning{Columns: []clause.Column{{Name: "id"}}},
		).
		Create(sr)
	if tx.Error != nil {
		return fmt.Errorf("upsert sequencing request %q: %w", sr.SubmitterSequencingRequestID, tx.Error)
	}
	return nil
}

func (r *SequencingRequestRepository) GetSequencingRequestsByCaseId(ctx context.Context, caseID int) ([]types.SequencingRequest, error) {
	var requests []types.SequencingRequest
	tx := r.db.WithContext(ctx).
		Table(types.SequencingRequestTable.Name).
		Where("case_id = ?", caseID).
		Order("id asc")
	if err := tx.Find(&requests).Error; err != nil {
		return nil, fmt.Errorf("fetch sequencing requests for case %d: %w", caseID, err)
	}
	return requests, nil
}

func (r *SequencingRequestRepository) GetSequencingRequestByCaseIdAndSubmitterId(ctx context.Context, caseID int, submitterSequencingRequestID string) (*types.SequencingRequest, error) {
	var request types.SequencingRequest
	tx := r.db.WithContext(ctx).
		Table(types.SequencingRequestTable.Name).
		Where("case_id = ? AND submitter_sequencing_request_id = ?", caseID, submitterSequencingRequestID)
	if err := tx.First(&request).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, fmt.Errorf("fetch sequencing request %q of case %d: %w", submitterSequencingRequestID, caseID, err)
	}
	return &request, nil
}
