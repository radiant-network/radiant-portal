package repository

import (
	"log/slog"

	"github.com/radiant-network/radiant-api/internal/client"
	"gorm.io/gorm"
)

type PostgresRepository struct {
	db              *gorm.DB
	Interpretations *InterpretationsRepository
	UserSets        *UserSetsRepository
}

func NewPostgresRepository(db *gorm.DB, pubmedClient client.PubmedClientService) *PostgresRepository {
	return &PostgresRepository{db: db, Interpretations: NewInterpretationsRepository(db, pubmedClient), UserSets: NewUserSetsRepository(db)}
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
