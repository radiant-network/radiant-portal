package repository

import (
	"errors"
	"fmt"
	"log"
	"time"

	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
)

type SavedFilter = types.SavedFilter
type SavedFilterCreationInput = types.SavedFilterCreationInput
type SavedFilterUpdateInput = types.SavedFilterUpdateInput

type SavedFiltersRepository struct {
	db *gorm.DB
}

type SavedFiltersDAO interface {
	GetSavedFilterByID(savedFilterId int) (*SavedFilter, error)
	GetSavedFiltersByUserID(userId string, savedFilterType string) (*[]SavedFilter, error)
	CreateSavedFilter(savedFilterInput SavedFilterCreationInput, userId string) (*SavedFilter, error)
	UpdateSavedFilter(savedFilterInput SavedFilterUpdateInput, savedFilterId int, userId string) (*SavedFilter, error)
	DeleteSavedFilter(savedFilterId int, userId string) error
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

func (r *SavedFiltersRepository) GetSavedFiltersByUserID(userId string, savedFilterType string) (*[]SavedFilter, error) {
	var savedFilters []SavedFilter
	var tx *gorm.DB

	if savedFilterType != "" {
		tx = r.db.
			Table(types.SavedFilterTable.Name).Where("user_id = ? and type = ?", userId, savedFilterType)
	} else {
		tx = r.db.
			Table(types.SavedFilterTable.Name).Where("user_id = ?", userId)
	}

	if err := tx.Find(&savedFilters).Error; err != nil {
		return nil, fmt.Errorf("error retrieve saved filter by user ID and type: %w", err)
	}

	return &savedFilters, nil
}

func (r *SavedFiltersRepository) CreateSavedFilter(savedFilterInput SavedFilterCreationInput, userId string) (*SavedFilter, error) {
	savedFilter := SavedFilter{
		Name:      savedFilterInput.Name,
		Type:      savedFilterInput.Type,
		UserID:    userId,
		Queries:   savedFilterInput.Queries,
		CreatedOn: time.Now(),
		UpdatedOn: time.Now(),
	}
	if err := r.db.Create(&savedFilter).Error; err != nil {
		return nil, fmt.Errorf("error creating saved filter: %w", err)
	}

	return r.GetSavedFilterByID(savedFilter.ID)
}

func (r *SavedFiltersRepository) UpdateSavedFilter(savedFilterInput SavedFilterUpdateInput, savedFilterId int, userId string) (*SavedFilter, error) {
	savedFilter := SavedFilter{
		Favorite:  savedFilterInput.Favorite,
		Name:      savedFilterInput.Name,
		Queries:   savedFilterInput.Queries,
		UpdatedOn: time.Now(),
	}
	if err := r.db.Where("id = ? and user_id = ?", savedFilterId, userId).Updates(&savedFilter).Error; err != nil {
		return nil, fmt.Errorf("error updating saved filter: %w", err)
	}

	return r.GetSavedFilterByID(savedFilterId)
}

func (r *SavedFiltersRepository) DeleteSavedFilter(savedFilterId int, userId string) error {
	if err := r.db.Where("id = ? and user_id = ?", savedFilterId, userId).Delete(&SavedFilter{}).Error; err != nil {
		return fmt.Errorf("error deleting saved filter: %w", err)
	}
	return nil
}
