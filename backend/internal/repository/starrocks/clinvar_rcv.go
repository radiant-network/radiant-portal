package repository

import (
	"context"
	"fmt"
	"strings"

	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/internal/utils"
	"gorm.io/gorm"
)

type ClinvarRCV = types.ClinvarRCV

type ClinvarRCVRepository struct {
	db *gorm.DB
}

func NewClinvarRCVRepository(db database.StarrocksDB) *ClinvarRCVRepository {
	return &ClinvarRCVRepository{db: db.DB}
}

func (r *ClinvarRCVRepository) GetVariantClinvarConditions(ctx context.Context, locusId int) ([]ClinvarRCV, error) {
	var clinvarRCV []ClinvarRCV

	columns := utils.PrefixColumns(types.ClinvarRCVTable.Alias, []string{
		"locus_id",
		"clinvar_id",
		"accession",
		"clinical_significance",
		"date_last_evaluated",
		"submission_count",
		"review_status",
		"review_status_stars",
		"version",
		"traits",
		"origins",
	})

	err := r.db.WithContext(ctx).
		Table(fmt.Sprintf("%s %s", types.VariantTable.TenantQualifiedName(ctx), types.VariantTable.Alias)).
		Select(strings.Join(columns, ",")).
		Joins(fmt.Sprintf("JOIN %s %s ON %s.clinvar_name = %s.clinvar_id", types.ClinvarRCVTable.TenantQualifiedName(ctx), types.ClinvarRCVTable.Alias, types.VariantTable.Alias, types.ClinvarRCVTable.Alias)).
		Where(fmt.Sprintf("%s.locus_id = ?", types.VariantTable.Alias), locusId).
		Find(&clinvarRCV).Error
	if err != nil {
		return nil, fmt.Errorf("error while fetching clinvar RCV: %w", err)
	}

	return clinvarRCV, nil
}
