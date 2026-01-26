package repository

import (
	"fmt"
	"log"

	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
)

type ResolutionStatus = types.ResolutionStatus

type ResolutionStatusRepository struct {
	db *gorm.DB
}

type ResolutionStatusDAO interface {
	GetResolutionStatusCodes() ([]string, error)
}

func NewResolutionStatusRepository(db *gorm.DB) *ResolutionStatusRepository {
	if db == nil {
		log.Print("OnsetsRepository: db is nil")
		return nil
	}
	return &ResolutionStatusRepository{db: db}
}

func (r *ResolutionStatusRepository) GetResolutionStatusCodes() ([]string, error) {
	var rsCodes []string
	tx := r.db.
		Table(types.ResolutionStatusTable.Name).
		Select("code").
		Order("code asc")
	if err := tx.Find(&rsCodes).Error; err != nil {
		return nil, fmt.Errorf("error retrieving resolution status codes: %w", err)
	}
	return rsCodes, nil
}
