package repository

import (
	"context"
	"errors"
	"fmt"
	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
)

type Exomiser = types.Exomiser
type ExomiserACMGClassificationCounts = types.ExomiserACMGClassificationCounts

type ExomiserRepository struct {
	db *gorm.DB
}

func NewExomiserRepository(db *gorm.DB) *ExomiserRepository {
	return &ExomiserRepository{db: db}
}

func (r *ExomiserRepository) GetExomiser(ctx context.Context, locusId int) ([]Exomiser, error) {
	var exomiser []Exomiser
	tx := r.db.WithContext(ctx).Table(types.ExomiserTable.TenantQualifiedName(ctx))
	tx = tx.Select("part, seq_id, locus_id, id, locus_hash, moi, variant_score, gene_combined_score, variant_rank, rank, symbol, acmg_classification, acmg_evidence")
	tx = tx.Where("locus_id = ?", locusId)

	if err := tx.Find(&exomiser).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		} else {
			return nil, fmt.Errorf("error while fetching Exomiser: %w", err)
		}
	} else if len(exomiser) == 0 {
		return nil, nil
	}

	return exomiser, nil
}

func (r *ExomiserRepository) GetExomiserACMGClassificationCounts(ctx context.Context, locusId int) (map[string]int, error) {
	var exomiser []ExomiserACMGClassificationCounts
	tx := r.db.WithContext(ctx).Table(types.ExomiserTable.TenantQualifiedName(ctx))
	tx = tx.Select("acmg_classification, COUNT(1) as acmg_classification_count")
	tx = tx.Where("locus_id = ? and variant_rank=1", locusId)
	tx = tx.Group("acmg_classification")
	tx = tx.Order("acmg_classification_count DESC")

	if err := tx.Find(&exomiser).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		} else {
			return nil, fmt.Errorf("error while fetching Exomiser ACMG Classification Counts: %w", err)
		}
	} else if len(exomiser) == 0 {
		return nil, nil
	}

	results := make(map[string]int)
	for _, record := range exomiser {
		results[record.AcmgClassification] = record.AcmgClassificationCount
	}

	return results, nil
}
