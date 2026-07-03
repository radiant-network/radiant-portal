package repository

import (
	"context"
	"errors"
	"fmt"

	"github.com/radiant-network/radiant-api/internal/utils"

	"github.com/Goldziher/go-utils/sliceutils"
	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
)

type GermlineSNVOccurrence = types.GermlineSNVOccurrence
type Aggregation = types.Aggregation
type Statistics = types.Statistics
type ExpandedGermlineSNVOccurrence = types.ExpandedGermlineSNVOccurrence
type OmimGenePanel = types.OmimGenePanel
type Consequence = types.Consequence
type Transcript = types.Transcript

type GermlineSNVOccurrencesRepository struct {
	db *gorm.DB
}

func NewGermlineSNVOccurrencesRepository(db *gorm.DB) *GermlineSNVOccurrencesRepository {
	return &GermlineSNVOccurrencesRepository{db: db}
}

func (r *GermlineSNVOccurrencesRepository) GetOccurrences(ctx context.Context, caseId int, seqId int, taskId int, userQuery types.ListQuery) ([]GermlineSNVOccurrence, error) {
	var occurrences []GermlineSNVOccurrence

	db := r.db.WithContext(ctx)
	schema := types.TenantSchema(ctx)
	tx, part, err := PrepareSNVListOrCountQuery(types.GermlineSNVOccurrenceTable, seqId, taskId, userQuery, db)
	if err != nil {
		return nil, fmt.Errorf("error during query preparation %w", err)
	}
	var columns = sliceutils.Map(userQuery.SelectedFields(), func(field types.Field, index int, slice []types.Field) string {
		return fmt.Sprintf("%s.%s as %s", field.Table.Alias, field.Name, field.GetAlias())
	})
	columns = append(columns, "i.locus_id IS NOT NULL AS has_interpretation")
	columns = append(columns, "note.occurrence_id IS NOT NULL AS has_note")
	columns = append(columns, "flag.flag_type")
	columns = append(columns, "v.locus")

	utils.AddLimitAndSort(tx, userQuery)
	// we build a TOP-N query like :
	// SELECT g_snv_o.locus_id, g_snv_o.quality, g_snv_o.ad_ratio, ...., v.variant_class, v.hgvsg..., i.locus_id IS NOT NULL AS has_interpretation
	// FROM (germline__snv__occurrence o, snv__variant v)
	// 		LEFT JOIN (SELECT DISTINCT locus_id, case_id, sequencing_id FROM <schema>.interpretation_germline) i ON i.locus_id = g_snv_o.locus_id AND i.sequencing_id = ?
	// 		LEFT JOIN (SELECT DISTINCT occurrence_id, case_id, seq_id, task_id FROM <schema>.occurrence_note WHERE deleted = false) note ON note.occurrence_id = g_snv_o.locus_id AND note.task_id = g_snv_o.task_id AND note.seq_id = ? AND note.case_id = ?
	// 		LEFT JOIN <schema>.occurrence_flag flag ON flag.occurrence_id = g_snv_o.locus_id AND flag.task_id = g_snv_o.task_id AND flag.seq_id = ? AND flag.case_id = ?
	// WHERE g_snv_o.locus_id in (
	//	SELECT g_snv_o.locus_id FROM germline__snv__occurrence JOIN ... WHERE quality > 100 ORDER BY ad_ratio DESC LIMIT 10
	// ) AND g_snv_o.seq_id=? AND g_snv_o.task_id=? AND g_snv_o.part=? AND v.locus_id=g_snv_o.locus_id ORDER BY ad_ratio DESC
	tx = tx.Select("g_snv_o.locus_id")
	tx = db.Table("(germline__snv__occurrence g_snv_o, snv__variant v)").
		Joins(fmt.Sprintf("LEFT JOIN (SELECT DISTINCT locus_id, case_id, sequencing_id FROM %s.interpretation_germline) i ON i.locus_id = g_snv_o.locus_id AND i.sequencing_id = ? AND i.case_id = ?", schema), fmt.Sprintf("%d", seqId), fmt.Sprintf("%d", caseId)).
		Joins(fmt.Sprintf("LEFT JOIN (SELECT DISTINCT occurrence_id, case_id, seq_id, task_id FROM %s.occurrence_note WHERE deleted = false) note ON note.occurrence_id = g_snv_o.locus_id AND note.task_id = g_snv_o.task_id AND note.seq_id = ? AND note.case_id = ?", schema), seqId, caseId).
		Joins(fmt.Sprintf("LEFT JOIN %s.occurrence_flag flag ON flag.occurrence_id = g_snv_o.locus_id AND flag.task_id = g_snv_o.task_id AND flag.seq_id = ? AND flag.case_id = ?", schema), seqId, caseId).
		Select(columns).
		Where("g_snv_o.seq_id = ? and g_snv_o.task_id = ? and part=? and v.locus_id = g_snv_o.locus_id and g_snv_o.locus_id in (?)", seqId, taskId, part, tx)

	utils.AddSort(tx, userQuery) //We re-apply the sort on the outer query

	if err = tx.Find(&occurrences).Error; err != nil {
		return nil, fmt.Errorf("error fetching occurrences: %w", err)
	}
	return occurrences, nil
}

func (r *GermlineSNVOccurrencesRepository) CountOccurrences(ctx context.Context, _ int, seqId int, taskId int, userQuery types.CountQuery) (int64, error) {
	return CountSNV(types.GermlineSNVOccurrenceTable, seqId, taskId, userQuery, r.db.WithContext(ctx))
}

func (r *GermlineSNVOccurrencesRepository) AggregateOccurrences(ctx context.Context, _ int, seqId int, taskId int, userQuery types.AggQuery) ([]Aggregation, error) {
	return AggregateSNV(types.GermlineSNVOccurrenceTable, seqId, taskId, userQuery, r.db.WithContext(ctx))
}

func (r *GermlineSNVOccurrencesRepository) GetStatisticsOccurrences(ctx context.Context, _ int, seqId int, taskId int, userQuery types.StatisticsQuery) (*types.Statistics, error) {
	return StatisticsSNV(types.GermlineSNVOccurrenceTable, seqId, taskId, userQuery, r.db.WithContext(ctx))
}

func (r *GermlineSNVOccurrencesRepository) GetExpandedOccurrence(ctx context.Context, _ int, seqId int, taskId int, locusId int) (*ExpandedGermlineSNVOccurrence, error) {
	db := r.db.WithContext(ctx)
	tx := db.Table("germline__snv__occurrence g_snv_o")
	tx = tx.Where("g_snv_o.seq_id = ? AND g_snv_o.task_id = ? AND g_snv_o.locus_id = ?", seqId, taskId, locusId)
	tx = tx.Joins("JOIN snv__consequence c ON g_snv_o.locus_id=c.locus_id AND c.is_picked = true")
	tx = tx.Joins("JOIN snv__variant v ON g_snv_o.locus_id=v.locus_id")
	tx = tx.Joins("LEFT JOIN ensembl_gene g ON g.name=v.symbol")
	tx = tx.Select("c.locus_id, v.hgvsg, v.locus, v.chromosome, v.start, v.end, v.symbol, v.transcript_id, v.is_canonical, " +
		"v.is_mane_select, v.is_mane_plus, c.exon_rank, c.exon_total, v.dna_change, v.vep_impact, v.consequences, " +
		"v.aa_change, v.rsnumber, v.clinvar_interpretation, c.gnomad_pli, c.gnomad_loeuf, c.spliceai_type, c.spliceai_ds, " +
		"v.germline_pf_wgs, v.gnomad_v3_af, c.sift_pred, c.sift_score, c.revel_score, c.fathmm_pred, c.fathmm_score, c.cadd_phred, c.cadd_score, " +
		"c.dann_score, c.lrt_pred, c.lrt_score, c.polyphen2_hvar_pred, c.polyphen2_hvar_score, g_snv_o.zygosity, g_snv_o.transmission_mode, g_snv_o.parental_origin, " +
		"g_snv_o.father_calls, g_snv_o.mother_calls, g_snv_o.info_qd, g_snv_o.ad_alt, g_snv_o.ad_total, g_snv_o.filter, g_snv_o.gq," +
		"g_snv_o.exomiser_gene_combined_score, g_snv_o.exomiser_acmg_evidence, g_snv_o.exomiser_acmg_classification, v.germline_pc_wgs_affected, v.germline_pn_wgs_affected, v.germline_pf_wgs_affected, " +
		"v.germline_pc_wgs_not_affected, v.germline_pn_wgs_not_affected, v.germline_pf_wgs_not_affected, g.gene_id as ensembl_gene_id")

	var expandedOccurrence ExpandedGermlineSNVOccurrence
	if err := tx.Take(&expandedOccurrence).Error; err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("error while fetching expanded occurrence: %w", err)
		} else {
			return nil, nil
		}
	}

	txOmim := db.Table("omim_gene_panel omim")
	txOmim = txOmim.Select("omim.omim_phenotype_id, omim.panel, omim.inheritance_code")
	txOmim = txOmim.Where("omim.omim_phenotype_id is not null and omim.symbol = ?", expandedOccurrence.Symbol)
	txOmim = txOmim.Order("omim.omim_phenotype_id asc")

	var omimConditions []OmimGenePanel
	errOmim := txOmim.Find(&omimConditions).Error
	if errOmim != nil {
		if !errors.Is(errOmim, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("error while fetching omim conditions: %w", errOmim)
		} else {
			return &expandedOccurrence, errOmim
		}
	}
	expandedOccurrence.OmimConditions = omimConditions
	return &expandedOccurrence, nil
}
