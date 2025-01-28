package repository

import (
	"log"

	"github.com/Ferlab-Ste-Justine/radiant-api/internal/client"
	"gorm.io/gorm"
)

type PostgresRepository struct {
	db *gorm.DB
	Interpretations *InterpretationsRepository
}

type PostgresDAO interface {
	CheckDatabaseConnection() string
}

func NewPostgresRepository(db *gorm.DB, pubmedClient * client.PubmedClient) *PostgresRepository {
	return &PostgresRepository{db: db, Interpretations: NewInterpretationsRepository(db, pubmedClient)}
}

func (r *PostgresRepository) CheckDatabaseConnection() string {
	sqlDb, err := r.db.DB()
	if err != nil {
		log.Fatal("failed to get database object:", err)
		return "down"
	}

	if err = sqlDb.Ping(); err != nil {
		log.Fatal("failed to ping database", err)
		return "down"
	}
	return "up"
}
