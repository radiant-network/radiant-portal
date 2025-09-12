package repository

import (
	"errors"
	"fmt"
	"log"

	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
)

type SavedFilter = types.SavedFilter

type SavedFiltersRepository struct {
	db *gorm.DB
}

type SavedFiltersDAO interface {
	GetSavedFilterByID(savedFilterId int) (*SavedFilter, error)
	GetSavedFiltersByUserID(userId string) (*[]SavedFilter, error)
	GetSavedFiltersByUserIDAndType(userId string, savedFilterType string) (*[]SavedFilter, error)
}

func NewSavedFiltersRepository(db *gorm.DB) *SavedFiltersRepository {
	if db == nil {
		log.Fatal("SavedFiltersRepository: db is nil")
		return nil
	}
	return &SavedFiltersRepository{db: db}
}

func (r *SavedFiltersRepository) GetSavedFilterByID(savedFilterId int) (*SavedFilter, error) {
	var savedFilter SavedFilter

	tx := r.db.
		Table(types.SavedFilterTable.Name).Where("id = ?", savedFilterId)

	if err := tx.First(&savedFilter).Error; err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("error retrieve saved filter its ID: %w", err)
		} else {
			return nil, nil
		}
	}

	return &savedFilter, nil
}

func (r *SavedFiltersRepository) GetSavedFiltersByUserID(userId string) (*[]SavedFilter, error) {
	var savedFilters []SavedFilter

	tx := r.db.
		Table(types.SavedFilterTable.Name).Where("user_id = ?", userId)

	if err := tx.Find(&savedFilters).Error; err != nil {
		return nil, fmt.Errorf("error retrieve saved filter by user ID: %w", err)
	}

	return &savedFilters, nil
}

func (r *SavedFiltersRepository) GetSavedFiltersByUserIDAndType(userId string, savedFilterType string) (*[]SavedFilter, error) {
	var savedFilters []SavedFilter

	tx := r.db.
		Table(types.SavedFilterTable.Name).Where("user_id = ? and type = ?", userId, savedFilterType)

	if err := tx.Find(&savedFilters).Error; err != nil {
		return nil, fmt.Errorf("error retrieve saved filter by user ID and type: %w", err)
	}

	return &savedFilters, nil
}
