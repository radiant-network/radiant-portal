package repository

import (
	"context"
	"errors"
	"fmt"

	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
)

type Family = types.Family

type FamilyRepository struct {
	db *gorm.DB
}

func NewFamilyRepository(db database.PostgresDB) *FamilyRepository {
	return &FamilyRepository{db: db.DB}
}

func (r *FamilyRepository) GetFamilyById(ctx context.Context, familyId int) (*Family, error) {
	var family Family
	if err := r.db.WithContext(ctx).Table(types.FamilyTable.Name).First(&family, familyId).Error; err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("error while fetching family: %w", err)
		} else {
			return nil, nil
		}
	}
	return &family, nil
}

func (r *FamilyRepository) CreateFamily(ctx context.Context, family *Family) error {
	return r.db.WithContext(ctx).Create(family).Error
}

func (r *FamilyRepository) DeleteFamilyByCaseID(ctx context.Context, caseID int) error {
	return r.db.WithContext(ctx).Where("case_id = ?", caseID).Delete(&Family{}).Error
}
