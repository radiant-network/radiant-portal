package repository

import (
	"errors"
	"fmt"
	"github.com/Ferlab-Ste-Justine/radiant-api/internal/types"
	"gorm.io/gorm"
	"log"
)

type Sample = types.Sample

type SamplesRepository struct {
	db *gorm.DB
}

type SamplesDAO interface {
	GetSamples() (*[]Sample, error)
}

func NewSamplesRepository(db *gorm.DB) *SamplesRepository {
	if db == nil {
		log.Fatal("SamplesRepository: db is nil")
		return nil
	}
	return &SamplesRepository{db: db}
}

func (r *SamplesRepository) GetSamples() (*[]Sample, error) {
	tx := r.db.Table(types.SampleTable.Name).
		Preload("Category").
		Preload("Type").
		Preload("ParentSample").
		Preload("HistologyType")
	var samples []Sample
	if err := tx.Find(&samples).Error; err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("error while fetching samples: %w", err)
		} else {
			return nil, nil
		}
	}

	return &samples, nil
}
