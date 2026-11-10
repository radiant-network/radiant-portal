package starrocks

import (
	"context"
	"fmt"

	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/internal/utils"
	"gorm.io/gorm"
)

type GermlineCNVOccurrence = types.GermlineCNVOccurrence

type GermlineCNVOccurrencesRepository struct {
	db *gorm.DB
}

func NewGermlineCNVOccurrencesRepository(db database.StarrocksDB) *GermlineCNVOccurrencesRepository {
	return &GermlineCNVOccurrencesRepository{db: db.DB}
}

func (r *GermlineCNVOccurrencesRepository) GetOccurrences(ctx context.Context, caseId int, seqId int, taskId int, userQuery types.OccurrenceListQuery) ([]GermlineCNVOccurrence, error) {
	return listCNVOccurrences[GermlineCNVOccurrence](ctx, r.db.WithContext(ctx), types.GermlineCNVOccurrenceTable, types.GermlineCNVVariantFrequencyTable, caseId, seqId, taskId, userQuery)
}

func (r *GermlineCNVOccurrencesRepository) CountOccurrences(ctx context.Context, caseId int, seqId int, taskId int, userQuery types.OccurrenceCountQuery) (types.OccurrenceCount, error) {
	return countCNVOccurrences(ctx, r.db.WithContext(ctx), types.GermlineCNVOccurrenceTable, types.GermlineCNVVariantFrequencyTable, caseId, seqId, taskId, userQuery)
}

func (r *GermlineCNVOccurrencesRepository) AggregateOccurrences(ctx context.Context, _ int, seqId int, taskId int, userQuery types.AggQuery) ([]Aggregation, error) {
	return aggregateCNVOccurrences(ctx, r.db.WithContext(ctx), types.GermlineCNVOccurrenceTable, types.GermlineCNVVariantFrequencyTable, seqId, taskId, userQuery)
}

func (r *GermlineCNVOccurrencesRepository) GetStatisticsOccurrences(ctx context.Context, _ int, seqId int, taskId int, userQuery types.StatisticsQuery) (*types.Statistics, error) {
	return cnvOccurrencesStatistics(ctx, r.db.WithContext(ctx), types.GermlineCNVOccurrenceTable, types.GermlineCNVVariantFrequencyTable, seqId, taskId, userQuery)
}

func (r *GermlineCNVOccurrencesRepository) GetGenesOverlap(ctx context.Context, _ int, seqId int, taskId int, cnvId int) ([]types.CNVGeneOverlap, error) {
	return cnvGenesOverlap(ctx, r.db.WithContext(ctx), types.GermlineCNVOccurrenceTable, seqId, taskId, cnvId)
}

// TaskIDsWithOccurrences returns the ids among taskIds that have at least one germline CNV row for
// the sequencing.
func (r *GermlineCNVOccurrencesRepository) TaskIDsWithOccurrences(ctx context.Context, seqId int, taskIds []int) ([]int, error) {
	if len(taskIds) == 0 {
		return nil, nil
	}
	db := r.db.WithContext(ctx)
	part, err := utils.GetSequencingPart(seqId, db)
	if err != nil {
		return nil, fmt.Errorf("error fetching part of seq %d: %w", seqId, err)
	}
	var ids []int
	err = db.Table(types.GermlineCNVOccurrenceTable.TenantQualifiedName(ctx)).
		Where("part = ? AND seq_id = ? AND task_id IN ?", part, seqId, taskIds).
		Distinct("task_id").
		Pluck("task_id", &ids).Error
	if err != nil {
		return nil, fmt.Errorf("error fetching germline CNV task ids of seq %d: %w", seqId, err)
	}
	return ids, nil
}
