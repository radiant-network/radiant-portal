package repository

import (
	"log/slog"

	"gorm.io/gorm"
)

type StarrocksRepository struct {
	db *gorm.DB
}

func NewStarrocksRepository(db *gorm.DB) *StarrocksRepository {
	if db == nil {
		slog.Error("StarrocksRepository: db is nil")
		return nil
	}
	return &StarrocksRepository{db: db}
}

func (r *StarrocksRepository) CheckDatabaseConnection() string {
	if r == nil || r.db == nil {
		return "down"
	}
	sqlDb, err := r.db.DB()
	if err != nil {
		slog.Error("failed to get database object", slog.Any("error", err))
		return "down"
	}

	if err = sqlDb.Ping(); err != nil {
		slog.Error("failed to ping database", slog.Any("error", err))
		return "down"
	}
	return "up"
}
