package repository

import (
	"gorm.io/gorm"
)

type SamplesRepository struct {
	db *gorm.DB
}

type SamplesDAO interface{}

func NewSamplesRepository(db *gorm.DB) *SamplesRepository {
	return &SamplesRepository{db: db}
}
