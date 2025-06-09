package repository

import (
	"errors"
	"fmt"
	"github.com/Ferlab-Ste-Justine/radiant-api/internal/types"
	"gorm.io/gorm"
	"log"
)

type Request = types.Request

type RequestsRepository struct {
	db *gorm.DB
}

type RequestsDAO interface {
	GetRequests() (*[]Request, error)
}

func NewRequestsRepository(db *gorm.DB) *RequestsRepository {
	if db == nil {
		log.Fatal("RequestsRepository: db is nil")
		return nil
	}
	return &RequestsRepository{db: db}
}

func (r *RequestsRepository) GetRequests() (*[]Request, error) {
	tx := r.db.Table(types.RequestTable.Name).
		Preload("Organization").
		Preload("Priority")
	var requests []Request
	if err := tx.Find(&requests).Error; err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("error while fetching requests: %w", err)
		} else {
			return nil, nil
		}
	}

	return &requests, nil
}
