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

// ListTasks returns the tasks of the case and sequencing that have germline CNV rows for the
// sequencing, newest first. The rows decide, not the task type: the CNV annotation task is attached
// to every family member's sequencing but has rows under the proband's only, and the proband's
// alignment task has rows only if the ETL loaded it before the family's slivar VCF.
func (r *GermlineCNVOccurrencesRepository) ListTasks(ctx context.Context, caseId int, seqId int) ([]types.TaskOccurrenceType, error) {
	db := r.db.WithContext(ctx)
	part, err := utils.GetSequencingPart(seqId, db)
	if err != nil {
		return nil, fmt.Errorf("error fetching part of seq %d: %w", seqId, err)
	}
	withRows := db.Table(types.GermlineCNVOccurrenceTable.TenantQualifiedName(ctx)).
		Select("DISTINCT task_id").
		Where("part = ? AND seq_id = ?", part, seqId)

	var tasks []types.TaskOccurrenceType
	err = db.Table(fmt.Sprintf("%s tctx", types.TaskContextTable.TenantQualifiedName(ctx))).
		Select("t.id, t.task_type_code, tt.name_en AS task_type_name, t.pipeline_name, t.pipeline_version, t.genome_build, t.created_on").
		Joins(fmt.Sprintf("JOIN %s t ON t.id = tctx.task_id", types.TaskTable.TenantQualifiedName(ctx))).
		Joins(fmt.Sprintf("JOIN %s tt ON tt.code = t.task_type_code", types.TaskTypeTable.TenantQualifiedName(ctx))).
		Where("tctx.sequencing_experiment_id = ? AND (tctx.case_id = ? OR tctx.case_id IS NULL)", seqId, caseId).
		Where("t.id IN (?)", withRows).
		Order("t.created_on DESC, t.id DESC").
		Find(&tasks).Error
	if err != nil {
		return nil, fmt.Errorf("error listing germline CNV tasks of case %d / seq %d: %w", caseId, seqId, err)
	}
	return tasks, nil
}
