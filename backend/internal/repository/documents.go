package repository

import (
	"errors"
	"fmt"
	"github.com/Ferlab-Ste-Justine/radiant-api/internal/types"
	"gorm.io/gorm"
	"log"
)

type Document = types.Document

type DocumentsRepository struct {
	db *gorm.DB
}

type DocumentsDAO interface {
	GetDocuments() (*[]Document, error)
}

func NewDocumentsRepository(db *gorm.DB) *DocumentsRepository {
	if db == nil {
		log.Fatal("DocumentsRepository: db is nil")
		return nil
	}
	return &DocumentsRepository{db: db}
}

func (r *DocumentsRepository) GetDocuments() (*[]Document, error) {
	tx := r.db.Table(types.DocumentTable.Name).
		Preload("DataCategory").
		Preload("DataType").
		Preload("FileFormat").
		Preload("Patients")
	var documents []Document
	if err := tx.Find(&documents).Error; err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("error while fetching documents: %w", err)
		} else {
			return nil, nil
		}
	}

	return &documents, nil
}
