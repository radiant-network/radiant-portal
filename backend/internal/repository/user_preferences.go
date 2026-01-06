package repository

import (
	"errors"
	"fmt"
	"log"

	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
)

type UserPreference = types.UserPreference

type UserPreferencesRepository struct {
	db *gorm.DB
}

type UserPreferencesDAO interface {
	GetUserPreferences(userId string, key string) (*types.JsonMap[string, interface{}], error)
	UpdateUserPreferences(userId string, key string, content types.JsonMap[string, interface{}]) (*types.JsonMap[string, interface{}], error)
}

func NewUserPreferencesRepository(db *gorm.DB) *UserPreferencesRepository {
	if db == nil {
		log.Fatal("UserPreferencesRepository: db is nil")
		return nil
	}
	return &UserPreferencesRepository{db: db}
}

func (r *UserPreferencesRepository) GetUserPreferences(userId string, key string) (*types.JsonMap[string, interface{}], error) {
	var userPreference UserPreference

	if err := r.db.First(&userPreference, "user_id = ? AND key = ?", userId, key).Error; err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("error retrieve user preference: %w", err)
		} else {
			return nil, nil
		}
	}

	return &userPreference.Content, nil
}

func (r *UserPreferencesRepository) UpdateUserPreferences(userId string, key string, content types.JsonMap[string, interface{}]) (*types.JsonMap[string, interface{}], error) {
	userPreference := UserPreference{
		UserID:  userId,
		Key:     key,
		Content: content,
	}
	tx := r.db.Save(&userPreference)
	if err := tx.Error; err != nil {
		return nil, fmt.Errorf("error while updating user preferences: %w", err)
	}

	return &userPreference.Content, nil
}
