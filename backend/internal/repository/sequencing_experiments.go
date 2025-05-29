package repository

import (
	"errors"
	"fmt"
	"log"

	"github.com/Ferlab-Ste-Justine/radiant-api/internal/types"
	"gorm.io/gorm"
)

type Sequencing = types.Sequencing

type SequencingExperimentsRepository struct {
	db *gorm.DB
}

type SequencingExperimentsDAO interface {
	GetSequencing(seqId int) (*Sequencing, error)
}

func NewSequencingExperimentsRepository(db *gorm.DB) *SequencingExperimentsRepository {
	if db == nil {
		log.Fatal("SequencingExperimentsRepository: db is nil")
		return nil
	}
	return &SequencingExperimentsRepository{db: db}
}

func (r *SequencingExperimentsRepository) GetSequencing(seqId int) (*Sequencing, error) {
	tx := r.db.Table("sequencing_experiment").Where("seq_id = ?", seqId)
	var sequencing types.Sequencing
	err := tx.First(&sequencing).Error
	if err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("error while fetching sequencing: %w", err)
		} else {
			return nil, nil
		}
	}

	if sequencing.AnalysisType == "germline" {
		sequencing.ExperimentType = "WGS"
	}
	return &sequencing, err
}
