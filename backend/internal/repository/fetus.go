package repository

import (
	"context"
	"errors"
	"fmt"

	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
)

type Fetus = types.Fetus

type FetusRepository struct {
	db *gorm.DB
}

func NewFetusRepository(db *gorm.DB) *FetusRepository {
	return &FetusRepository{db: db}
}

func (r *FetusRepository) GetFetusById(ctx context.Context, fetusId int) (*Fetus, error) {
	var fetus Fetus
	if err := r.db.WithContext(ctx).Table(types.FetusTable.Name).First(&fetus, fetusId).Error; err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("error while fetching fetus: %w", err)
		}
		return nil, nil
	}
	return &fetus, nil
}

func (r *FetusRepository) CreateFetus(ctx context.Context, fetus *Fetus) error {
	return r.db.WithContext(ctx).Create(fetus).Error
}
