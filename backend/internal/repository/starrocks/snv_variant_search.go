package starrocks

import (
	"fmt"

	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/internal/utils"
	"gorm.io/gorm"
)

const maxVariantSearchHits = 100

// SearchSNVVariants returns the variants of one run whose identifier equals the searched value. It reads only the
// run's variant part of snv__variant_partitioned, semi-joined to the run's occurrences (colocated on locus_id).
func SearchSNVVariants(snvTable types.Table, seqId int, taskId int, identifier types.VariantIdentifier, db *gorm.DB) ([]types.VariantSearchHit, error) {
	column, err := identifier.Field.Column()
	if err != nil {
		return nil, fmt.Errorf("search variants: %w", err)
	}
	seqIdColumn, err := snvSeqIdColumn(snvTable)
	if err != nil {
		return nil, fmt.Errorf("search variants: %w", err)
	}
	part, err := utils.GetSequencingPart(seqId, db)
	if err != nil {
		return nil, fmt.Errorf("search variants: %w", err)
	}

	ctx := utils.CtxOf(db)
	vp := types.VariantPartitionedTable
	o := snvTable.Alias
	tx := db.Table(fmt.Sprintf("%s %s", vp.TenantQualifiedName(ctx), vp.Alias)).
		Select(fmt.Sprintf("%[1]s.hgvsg, %[1]s.locus, %[1]s.rsnumber, %[1]s.clinvar_name AS clinvar_id, %[1]s.symbol, %[1]s.aa_change", vp.Alias)).
		Joins(fmt.Sprintf("LEFT SEMI JOIN %s %s ON %s.locus_id = %s.locus_id AND %s.part = ? AND %s.%s = ? AND %s.task_id = ?",
			snvTable.TenantQualifiedName(ctx), o, o, vp.Alias, o, o, seqIdColumn, o), part, seqId, taskId).
		Where(fmt.Sprintf("%s.part = ? AND %s.%s = ?", vp.Alias, vp.Alias, column), part/types.PartsPerVariantPart, identifier.Value).
		Order(fmt.Sprintf("%s.locus_id", vp.Alias)).
		Limit(maxVariantSearchHits)

	var hits []types.VariantSearchHit
	if err := tx.Find(&hits).Error; err != nil {
		return nil, fmt.Errorf("search variants: %w", err)
	}
	return hits, nil
}
