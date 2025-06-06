package repository

import (
	"errors"
	"fmt"
	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
	"log"
)

type SequencingExperiment = types.SequencingExperiment

type SequencingExperimentsRepository struct {
	db *gorm.DB
}

type SequencingExperimentsDAO interface {
	GetSequencingExperiments() (*[]SequencingExperiment, error)
}

func NewSequencingExperimentsRepository(db *gorm.DB) *SequencingExperimentsRepository {
	if db == nil {
		log.Fatal("SequencingExperimentsRepository: db is nil")
		return nil
	}
	return &SequencingExperimentsRepository{db: db}
}

func (r *SequencingExperimentsRepository) GetSequencingExperiments() (*[]SequencingExperiment, error) {
	tx := r.db.Table(types.SequencingExperimentTable.Name).
		Preload("Case").
		Preload("Patient").
		Preload("Sample").
		Preload("ExperimentalStrategy").
		Preload("Status").
		Preload("Request").
		Preload("PerformerLab").
		Preload("Platform")
	var sequencingExperiments []SequencingExperiment
	if err := tx.Find(&sequencingExperiments).Error; err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("error while fetching sequencingExperiments: %w", err)
		} else {
			return nil, nil
		}
	}

	return &sequencingExperiments, nil
}
