package postgres

import (
	"log/slog"

	"github.com/radiant-network/radiant-api/internal/database"
	"gorm.io/gorm"
)

type PostgresRepository struct {
	db *gorm.DB
}

func NewPostgresRepository(db database.PostgresDB) *PostgresRepository {
	return &PostgresRepository{db: db.DB}
}

func (r *PostgresRepository) CheckDatabaseConnection() string {
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
