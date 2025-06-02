package repository

import (
	"log"

	"gorm.io/gorm"
)

type StarrocksRepository struct {
	db *gorm.DB
}

type StarrocksDAO interface {
	CheckDatabaseConnection() string
}

func NewStarrocksRepository(db *gorm.DB) *StarrocksRepository {
	if db == nil {
		log.Fatal("StarrocksRepository: db is nil")
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
		log.Fatal("failed to get database object:", err)
		return "down"
	}

	if err = sqlDb.Ping(); err != nil {
		log.Fatal("failed to ping database", err)
		return "down"
	}
	return "up"
}
