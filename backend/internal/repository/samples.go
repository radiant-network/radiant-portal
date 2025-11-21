package repository

import (
	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
)

type Sample = types.Sample

type SamplesRepository struct {
	db *gorm.DB
}

type SamplesDAO interface {
	CreateSample(newSample *Sample) error
}

func NewSamplesRepository(db *gorm.DB) *SamplesRepository {
	return &SamplesRepository{db: db}
}

func (r *SamplesRepository) CreateSample(newSample *Sample) error {
	return r.db.Create(newSample).Error
}
