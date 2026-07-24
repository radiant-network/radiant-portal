package postgres

import (
	"context"
	"errors"
	"fmt"

	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
)

type Document = types.Document

type DocumentsRepository struct {
	db *gorm.DB
}

func NewDocumentsRepository(db database.PostgresDB) *DocumentsRepository {
	return &DocumentsRepository{db: db.DB}
}

func (r *DocumentsRepository) CreateDocument(ctx context.Context, document *Document) error {
	return r.db.WithContext(ctx).Create(&document).Error
}

func (r *DocumentsRepository) GetDocumentByUrl(ctx context.Context, url string) (*Document, error) {
	var document Document
	txUrl := r.db.WithContext(ctx).Table(types.DocumentTable.Name).Where("url = ?", url)
	if err := txUrl.First(&document).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, fmt.Errorf("error while fetching document by url: %w", err)
	}
	return &document, nil
}
