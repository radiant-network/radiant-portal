package repository

import (
	"errors"
	"fmt"
	"log"

	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
)

type Sequencing = types.Sequencing

type SequencingRepository struct {
	db *gorm.DB
}

type SequencingDAO interface {
	GetSequencing(seqId int) (*Sequencing, error)
}

func NewSequencingRepository(db *gorm.DB) *SequencingRepository {
	if db == nil {
		log.Fatal("SequencingRepository: db is nil")
		return nil
	}
	return &SequencingRepository{db: db}
}

func (r *SequencingRepository) GetSequencing(seqId int) (*Sequencing, error) {
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
