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

// GetDocumentByUrl resolves a document by its URL within the tenant. document.url carries no
// UNIQUE constraint, so two tenants may legitimately register the same S3 URL; without the
// tenant_code predicate the other tenant's row would surface here and the caller would reject
// the batch as DOCUMENT-005.
func (r *DocumentsRepository) GetDocumentByUrl(ctx context.Context, url string, tenantCode string) (*Document, error) {
	var document Document
	txUrl := r.db.WithContext(ctx).Table(types.DocumentTable.Name).Where("url = ? AND tenant_code = ?", url, tenantCode)
	if err := txUrl.First(&document).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, fmt.Errorf("error while fetching document by url: %w", err)
	}
	return &document, nil
}
