package repository

import (
	"errors"
	"fmt"
	"log"

	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
)

type UserPreference = types.UserPreference
type TableConfig = types.TableConfig

type UserPreferencesRepository struct {
	db *gorm.DB
}

type UserPreferencesDAO interface {
	GetUserPreferences(userId string) (*UserPreference, error)
	UpdateUserPreferences(userId string, userPreference UserPreference) (*UserPreference, error)
}

func NewUserPreferencesRepository(db *gorm.DB) *UserPreferencesRepository {
	if db == nil {
		log.Fatal("UserPreferencesRepository: db is nil")
		return nil
	}
	return &UserPreferencesRepository{db: db}
}

func (r *UserPreferencesRepository) GetUserPreferences(userId string) (*UserPreference, error) {
	var userPreference UserPreference

	if err := r.db.First(&userPreference, "user_id = ?", userId).Error; err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("error retrieve user preference: %w", err)
		} else {
			return nil, nil
		}
	}

	return &userPreference, nil
}

func (r *UserPreferencesRepository) UpdateUserPreferences(userId string, userPreference UserPreference) (*UserPreference, error) {
	userPreference.UserID = userId
	tx := r.db.Save(&userPreference)
	if err := tx.Error; err != nil {
		return nil, fmt.Errorf("error while updating user preferences: %w", err)
	}

	return &userPreference, nil
}
