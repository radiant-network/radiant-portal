package repository

import (
	"fmt"
	"log"

	"github.com/Goldziher/go-utils/sliceutils"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/internal/utils"
	"gorm.io/gorm"
)

type SomaticSNVOccurrence = types.SomaticSNVOccurrence

type SomaticSNVOccurrencesRepository struct {
	db *gorm.DB
}

type SomaticSNVOccurrencesDAO interface {
	GetOccurrences(caseId int, seqId int, userFilter types.ListQuery) ([]SomaticSNVOccurrence, error)
	CountOccurrences(caseId int, seqId int, userQuery types.CountQuery) (int64, error)
	AggregateOccurrences(caseId int, seqId int, userQuery types.AggQuery) ([]Aggregation, error)
	GetStatisticsOccurrences(caseId int, seqId int, userQuery types.StatisticsQuery) (*Statistics, error)
}

func NewSomaticSNVOccurrencesRepository(db *gorm.DB) *SomaticSNVOccurrencesRepository {
	if db == nil {
		log.Print("SomaticSNVOccurrencesRepository: db is nil")
		return nil
	}
	return &SomaticSNVOccurrencesRepository{db: db}
}

func (r *SomaticSNVOccurrencesRepository) GetOccurrences(caseId int, seqId int, userQuery types.ListQuery) ([]SomaticSNVOccurrence, error) {
	var occurrences []SomaticSNVOccurrence

	tx, part, err := PrepareSNVListOrCountQuery(types.SomaticSNVOccurrenceTable, seqId, userQuery, r.db)
	if err != nil {
		return nil, fmt.Errorf("error during query preparation %w", err)
	}
	var columns = sliceutils.Map(userQuery.SelectedFields(), func(field types.Field, index int, slice []types.Field) string {
		return fmt.Sprintf("%s.%s as %s", field.Table.Alias, field.Name, field.GetAlias())
	})
	columns = append(columns, "i.locus_id IS NOT NULL AS has_interpretation")
	columns = append(columns, "note.occurrence_id IS NOT NULL AS has_note")
	columns = append(columns, "v.locus")

	utils.AddLimitAndSort(tx, userQuery)
	// we build a TOP-N query like :
	// SELECT s_snv_o.locus_id, s_snv_o.quality, s_snv_o.ad_ratio, ...., v.variant_class, v.hgvsg..., i.locus_id IS NOT NULL AS has_interpretation
	// FROM (somatic__snv__occurrence o, snv__variant v)
	// 		LEFT JOIN (SELECT DISTINCT locus_id, sequencing_id FROM radiant_jdbc.public.interpretation_somatic) i ON i.locus_id = s_snv_o.locus_id AND i.sequencing_id = ?
	// 		LEFT JOIN (SELECT DISTINCT occurrence_id, case_id, seq_id, task_id FROM radiant_jdbc.public.occurrence_note) note ON note.occurrence_id = s_snv_o.locus_id AND note.task_id = s_snv_o.task_id AND note.seq_id = ? AND note.case_id = ?
	// WHERE s_snv_o.locus_id in (
	//	SELECT s_snv_o.locus_id FROM somatic__snv__occurrence JOIN ... WHERE quality > 100 ORDER BY ad_ratio DESC LIMIT 10
	// ) AND s_snv_o.tumor_seq_id=? AND s_snv_o.part=? AND v.locus_id=s_snv_o.locus_id ORDER BY ad_ratio DESC
	tx = tx.Select("s_snv_o.locus_id")
	tx = r.db.Table("(somatic__snv__occurrence s_snv_o, snv__variant v)").
		Joins("LEFT JOIN (SELECT DISTINCT locus_id, case_id, sequencing_id FROM radiant_jdbc.public.interpretation_somatic) i ON i.locus_id = s_snv_o.locus_id AND i.sequencing_id = ? AND i.case_id = ?", fmt.Sprintf("%d", seqId), fmt.Sprintf("%d", caseId)).
		Joins("LEFT JOIN (SELECT DISTINCT occurrence_id, case_id, seq_id, task_id FROM radiant_jdbc.public.occurrence_note) note ON note.occurrence_id = s_snv_o.locus_id AND note.task_id = s_snv_o.task_id AND note.seq_id = ? AND note.case_id = ?", seqId, caseId).
		Select(columns).
		Where("s_snv_o.tumor_seq_id = ? and part=? and v.locus_id = s_snv_o.locus_id and s_snv_o.locus_id in (?)", seqId, part, tx)

	utils.AddSort(tx, userQuery) //We re-apply the sort on the outer query

	if err = tx.Find(&occurrences).Error; err != nil {
		return nil, fmt.Errorf("error fetching occurrences: %w", err)
	}
	return occurrences, nil
}

func (r *SomaticSNVOccurrencesRepository) CountOccurrences(_ int, seqId int, userQuery types.CountQuery) (int64, error) {
	return CountSNV(types.SomaticSNVOccurrenceTable, seqId, userQuery, r.db)
}

func (r *SomaticSNVOccurrencesRepository) AggregateOccurrences(_ int, seqId int, userQuery types.AggQuery) ([]Aggregation, error) {
	return AggregateSNV(types.SomaticSNVOccurrenceTable, seqId, userQuery, r.db)
}

func (r *SomaticSNVOccurrencesRepository) GetStatisticsOccurrences(_ int, seqId int, userQuery types.StatisticsQuery) (*types.Statistics, error) {
	return StatisticsSNV(types.SomaticSNVOccurrenceTable, seqId, userQuery, r.db)
}
