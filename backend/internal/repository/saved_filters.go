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
	GetSavedFiltersByUserID(userId string) (*[]SavedFilter, error)
	GetSavedFiltersByUserIDAndType(userId string, savedFilterType string) (*[]SavedFilter, error)
	CreateSavedFilter(savedFilterInput SavedFilterCreationInput, userId string) (*SavedFilter, error)
	UpdateSavedFilter(savedFilterInput SavedFilterUpdateInput, savedFilterId int, userId string) (*SavedFilter, error)
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
	existingSavedFilter, err := r.GetSavedFilterByID(savedFilterId)
	if err != nil || existingSavedFilter == nil {
		return nil, fmt.Errorf("error retrieving saved filter by ID: %w", err)
	}
	if existingSavedFilter.UserID != userId {
		return nil, fmt.Errorf("saved filter user ID does not match user ID")
	}
	savedFilter := SavedFilter{
		Favorite:  savedFilterInput.Favorite,
		Name:      savedFilterInput.Name,
		Queries:   savedFilterInput.Queries,
		UpdatedOn: time.Now(),
	}
	if err := r.db.Where("id = ?", savedFilterId).Updates(&savedFilter).Error; err != nil {
		return nil, fmt.Errorf("error updating saved filter: %w", err)
	}

	return r.GetSavedFilterByID(savedFilterId)
}
