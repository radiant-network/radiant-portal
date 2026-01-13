package repository

import (
	"fmt"
	"log"

	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
)

type Status = types.Status

type StatusRepository struct {
	db *gorm.DB
}

type StatusDAO interface {
	GetStatusCodes() ([]string, error)
}

func NewStatusRepository(db *gorm.DB) *StatusRepository {
	if db == nil {
		log.Print("StatusRepository: db is nil")
		return nil
	}
	return &StatusRepository{db: db}
}

func (r *StatusRepository) GetStatusCodes() ([]string, error) {
	var statusCodes []string
	tx := r.db.
		Table(types.StatusTable.Name).
		Select("code").
		Order("code asc")
	if err := tx.Find(&statusCodes).Error; err != nil {
		return nil, fmt.Errorf("error retrieving status codes: %w", err)
	}
	return statusCodes, nil
}
