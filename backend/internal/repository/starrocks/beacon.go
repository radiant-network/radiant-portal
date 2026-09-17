package starrocks

import (
	"context"
	"errors"
	"fmt"

	"github.com/radiant-network/radiant-api/internal/beacon"
	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
)

// BeaconVariantsRepository answers Beacon v2 genomicVariation queries from the tenant's
// snv__variant catalog alone: no occurrence scan, so boolean and count answers stay cheap.
type BeaconVariantsRepository struct {
	db *gorm.DB
}

func NewBeaconVariantsRepository(db database.StarrocksDB) *BeaconVariantsRepository {
	return &BeaconVariantsRepository{db: db.DB}
}

func (r *BeaconVariantsRepository) variants(ctx context.Context) *gorm.DB {
	return r.db.WithContext(ctx).Table(fmt.Sprintf("%s %s", types.VariantTable.TenantQualifiedName(ctx), types.VariantTable.Alias))
}

// applyQuery translates a parsed Beacon query (already 1-based, see internal/beacon) into
// predicates on snv__variant. `start`/`end` are backticked: `end` is a reserved word.
func applyQuery(tx *gorm.DB, q beacon.VariantQuery) *gorm.DB {
	if q.Chromosome != "" {
		tx = tx.Where("v.chromosome = ?", q.Chromosome)
	}
	switch q.Kind {
	case beacon.KindSequence:
		tx = tx.Where("v.`start` = ? AND v.reference = ? AND v.alternate = ?", q.Start, q.ReferenceBases, q.AlternateBases)
	case beacon.KindRange:
		tx = tx.Where("v.`start` <= ? AND v.`end` >= ?", q.End, q.Start)
	case beacon.KindGene:
		tx = tx.Where("v.symbol = ?", q.GeneSymbol)
	}
	if q.Kind != beacon.KindSequence && q.AlternateBases != "" {
		tx = tx.Where("v.alternate = ?", q.AlternateBases)
	}
	if q.AminoacidChange != "" {
		tx = tx.Where("v.aa_change = ?", q.AminoacidChange)
	}
	if q.VariantClass != "" {
		tx = tx.Where("v.variant_class = ?", q.VariantClass)
	}
	if q.MinLength > 0 {
		tx = tx.Where("GREATEST(LENGTH(v.reference), LENGTH(v.alternate)) >= ?", q.MinLength)
	}
	if q.MaxLength > 0 {
		tx = tx.Where("GREATEST(LENGTH(v.reference), LENGTH(v.alternate)) <= ?", q.MaxLength)
	}
	return tx
}

func (r *BeaconVariantsRepository) Exists(ctx context.Context, q beacon.VariantQuery) (bool, error) {
	var ids []int64
	if err := applyQuery(r.variants(ctx), q).Select("v.locus_id").Limit(1).Find(&ids).Error; err != nil {
		return false, fmt.Errorf("error checking beacon variant existence: %w", err)
	}
	return len(ids) > 0, nil
}

func (r *BeaconVariantsRepository) Count(ctx context.Context, q beacon.VariantQuery) (int64, error) {
	var count int64
	if err := applyQuery(r.variants(ctx), q).Count(&count).Error; err != nil {
		return 0, fmt.Errorf("error counting beacon variants: %w", err)
	}
	return count, nil
}

func (r *BeaconVariantsRepository) List(ctx context.Context, q beacon.VariantQuery, skip, limit int) ([]types.BeaconVariant, error) {
	rows := []types.BeaconVariant{}
	tx := applyQuery(r.variants(ctx), q).
		Select(types.BeaconVariantColumns).
		Order("v.chromosome, v.`start`, v.locus_id").
		Offset(skip).Limit(limit)
	if err := tx.Find(&rows).Error; err != nil {
		return nil, fmt.Errorf("error listing beacon variants: %w", err)
	}
	return rows, nil
}

func (r *BeaconVariantsRepository) GetByLocusID(ctx context.Context, locusID int64) (*types.BeaconVariant, error) {
	var row types.BeaconVariant
	err := r.variants(ctx).Select(types.BeaconVariantColumns).Where("v.locus_id = ?", locusID).Take(&row).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, fmt.Errorf("error fetching beacon variant %d: %w", locusID, err)
	}
	return &row, nil
}
