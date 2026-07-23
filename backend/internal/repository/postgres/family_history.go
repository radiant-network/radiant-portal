package repository

import (
	"context"
	"errors"
	"fmt"

	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
)

type FamilyHistory = types.FamilyHistory

type FamilyHistoryRepository struct {
	db *gorm.DB
}

func NewFamilyHistoryRepository(db database.PostgresDB) *FamilyHistoryRepository {
	return &FamilyHistoryRepository{db: db.DB}
}

func (r *FamilyHistoryRepository) GetById(ctx context.Context, familyHistoryId int) (*FamilyHistory, error) {
	var familyHistory FamilyHistory
	if err := r.db.WithContext(ctx).Table(types.FamilyHistoryTable.Name).First(&familyHistory, familyHistoryId).Error; err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("error while fetching family_history: %w", err)
		} else {
			return nil, nil
		}
	}
	return &familyHistory, nil
}

func (r *FamilyHistoryRepository) CreateFamilyHistory(ctx context.Context, familyHistory *FamilyHistory) error {
	return r.db.WithContext(ctx).Create(familyHistory).Error
}

func (r *FamilyHistoryRepository) DeleteFamilyHistoryByCaseID(ctx context.Context, caseID int) error {
	return r.db.WithContext(ctx).Where("case_id = ?", caseID).Delete(&FamilyHistory{}).Error
}
