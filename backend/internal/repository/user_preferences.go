package repository

import (
	"context"
	"errors"
	"fmt"

	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
)

type UserPreference = types.UserPreference

type UserPreferencesRepository struct {
	db *gorm.DB
}

func NewUserPreferencesRepository(db database.PostgresDB) *UserPreferencesRepository {
	return &UserPreferencesRepository{db: db.DB}
}

func (r *UserPreferencesRepository) GetUserPreferences(ctx context.Context, userId string, key string) (*types.JsonMap[string, interface{}], error) {
	var userPreference UserPreference

	if err := r.db.WithContext(ctx).First(&userPreference, "user_id = ? AND key = ?", userId, key).Error; err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("error retrieve user preference: %w", err)
		} else {
			return nil, nil
		}
	}

	return &userPreference.Content, nil
}

func (r *UserPreferencesRepository) UpdateUserPreferences(ctx context.Context, userId string, key string, content types.JsonMap[string, interface{}]) (*types.JsonMap[string, interface{}], error) {
	userPreference := UserPreference{
		UserID:  userId,
		Key:     key,
		Content: content,
	}
	tx := r.db.WithContext(ctx).Save(&userPreference)
	if err := tx.Error; err != nil {
		return nil, fmt.Errorf("error while updating user preferences: %w", err)
	}

	return &userPreference.Content, nil
}
