package starrocks

import (
	"log/slog"

	"github.com/radiant-network/radiant-api/internal/database"
	"gorm.io/gorm"
)

type StarrocksRepository struct {
	db *gorm.DB
}

func NewStarrocksRepository(db database.StarrocksDB) *StarrocksRepository {
	return &StarrocksRepository{db: db.DB}
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
