package starrocks

import (
	"context"

	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
)

type GermlineCNVOccurrence = types.GermlineCNVOccurrence

type GermlineCNVOccurrencesRepository struct {
	db *gorm.DB
}

func NewGermlineCNVOccurrencesRepository(db database.StarrocksDB) *GermlineCNVOccurrencesRepository {
	return &GermlineCNVOccurrencesRepository{db: db.DB}
}

func (r *GermlineCNVOccurrencesRepository) GetOccurrences(ctx context.Context, caseId int, seqId int, taskId int, userQuery types.ListQuery) ([]GermlineCNVOccurrence, error) {
	return listCNVOccurrences[GermlineCNVOccurrence](ctx, r.db.WithContext(ctx), types.GermlineCNVOccurrenceTable, caseId, seqId, taskId, userQuery)
}

func (r *GermlineCNVOccurrencesRepository) CountOccurrences(ctx context.Context, _ int, seqId int, taskId int, userQuery types.CountQuery) (int64, error) {
	return countCNVOccurrences(ctx, r.db.WithContext(ctx), types.GermlineCNVOccurrenceTable, seqId, taskId, userQuery)
}

func (r *GermlineCNVOccurrencesRepository) AggregateOccurrences(ctx context.Context, _ int, seqId int, taskId int, userQuery types.AggQuery) ([]Aggregation, error) {
	return aggregateCNVOccurrences(ctx, r.db.WithContext(ctx), types.GermlineCNVOccurrenceTable, seqId, taskId, userQuery)
}

func (r *GermlineCNVOccurrencesRepository) GetStatisticsOccurrences(ctx context.Context, _ int, seqId int, taskId int, userQuery types.StatisticsQuery) (*types.Statistics, error) {
	return cnvOccurrencesStatistics(ctx, r.db.WithContext(ctx), types.GermlineCNVOccurrenceTable, seqId, taskId, userQuery)
}

func (r *GermlineCNVOccurrencesRepository) GetGenesOverlap(ctx context.Context, _ int, seqId int, taskId int, cnvId int) ([]types.CNVGeneOverlap, error) {
	return cnvGenesOverlap(ctx, r.db.WithContext(ctx), types.GermlineCNVOccurrenceTable, seqId, taskId, cnvId)
}
