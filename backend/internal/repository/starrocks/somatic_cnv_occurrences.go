package starrocks

import (
	"context"

	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
)

type SomaticCNVOccurrence = types.SomaticCNVOccurrence

type SomaticCNVOccurrencesRepository struct {
	db *gorm.DB
}

func NewSomaticCNVOccurrencesRepository(db database.StarrocksDB) *SomaticCNVOccurrencesRepository {
	return &SomaticCNVOccurrencesRepository{db: db.DB}
}

// The seqId these methods scope on is the tumor sequencing id: somatic CNV is germline-shaped and
// keys on seq_id, unlike somatic SNV with its tumor_seq_id/normal_seq_id pair.
func (r *SomaticCNVOccurrencesRepository) GetOccurrences(ctx context.Context, caseId int, seqId int, taskId int, userQuery types.ListQuery) ([]SomaticCNVOccurrence, error) {
	return listCNVOccurrences[SomaticCNVOccurrence](ctx, r.db.WithContext(ctx), types.SomaticCNVOccurrenceTable, caseId, seqId, taskId, userQuery)
}

func (r *SomaticCNVOccurrencesRepository) CountOccurrences(ctx context.Context, _ int, seqId int, taskId int, userQuery types.CountQuery) (int64, error) {
	return countCNVOccurrences(ctx, r.db.WithContext(ctx), types.SomaticCNVOccurrenceTable, seqId, taskId, userQuery)
}

func (r *SomaticCNVOccurrencesRepository) AggregateOccurrences(ctx context.Context, _ int, seqId int, taskId int, userQuery types.AggQuery) ([]Aggregation, error) {
	return aggregateCNVOccurrences(ctx, r.db.WithContext(ctx), types.SomaticCNVOccurrenceTable, seqId, taskId, userQuery)
}

func (r *SomaticCNVOccurrencesRepository) GetStatisticsOccurrences(ctx context.Context, _ int, seqId int, taskId int, userQuery types.StatisticsQuery) (*types.Statistics, error) {
	return cnvOccurrencesStatistics(ctx, r.db.WithContext(ctx), types.SomaticCNVOccurrenceTable, seqId, taskId, userQuery)
}

func (r *SomaticCNVOccurrencesRepository) GetGenesOverlap(ctx context.Context, _ int, seqId int, taskId int, cnvId int) ([]types.CNVGeneOverlap, error) {
	return cnvGenesOverlap(ctx, r.db.WithContext(ctx), types.SomaticCNVOccurrenceTable, seqId, taskId, cnvId)
}
