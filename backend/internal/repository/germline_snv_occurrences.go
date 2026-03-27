package repository

import (
	"errors"
	"fmt"
	"log"

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

type GermlineSNVOccurrencesDAO interface {
	GetOccurrences(caseId int, seqId int, userFilter types.ListQuery) ([]GermlineSNVOccurrence, error)
	CountOccurrences(caseId int, seqId int, userQuery types.CountQuery) (int64, error)
	AggregateOccurrences(caseId int, seqId int, userQuery types.AggQuery) ([]Aggregation, error)
	GetStatisticsOccurrences(caseId int, seqId int, userQuery types.StatisticsQuery) (*Statistics, error)
	GetExpandedOccurrence(caseId int, seqId int, locusId int) (*ExpandedGermlineSNVOccurrence, error)
}

func NewGermlineSNVOccurrencesRepository(db *gorm.DB) *GermlineSNVOccurrencesRepository {
	if db == nil {
		log.Print("GermlineSNVOccurrencesRepository: db is nil")
		return nil
	}
	return &GermlineSNVOccurrencesRepository{db: db}
}

func (r *GermlineSNVOccurrencesRepository) GetOccurrences(caseId int, seqId int, userQuery types.ListQuery) ([]GermlineSNVOccurrence, error) {
	var occurrences []GermlineSNVOccurrence

	tx, part, err := PrepareSNVListOrCountQuery(types.GermlineSNVOccurrenceTable, seqId, userQuery, r.db)
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
	// SELECT g_snv_o.locus_id, g_snv_o.quality, g_snv_o.ad_ratio, ...., v.variant_class, v.hgvsg..., i.locus_id IS NOT NULL AS has_interpretation
	// FROM (germline__snv__occurrence o, snv__variant v)
	// 		LEFT JOIN (SELECT DISTINCT locus_id, case_id, sequencing_id FROM radiant_jdbc.public.interpretation_germline) i ON i.locus_id = g_snv_o.locus_id AND i.sequencing_id = ?
	// 		LEFT JOIN (SELECT DISTINCT occurrence_id, case_id, seq_id, task_id FROM radiant_jdbc.public.occurrence_note WHERE deleted = false) note ON note.occurrence_id = g_snv_o.locus_id AND note.task_id = g_snv_o.task_id AND note.seq_id = ? AND note.case_id = ?
	// WHERE g_snv_o.locus_id in (
	//	SELECT g_snv_o.locus_id FROM germline__snv__occurrence JOIN ... WHERE quality > 100 ORDER BY ad_ratio DESC LIMIT 10
	// ) AND g_snv_o.seq_id=? AND g_snv_o.part=? AND v.locus_id=g_snv_o.locus_id ORDER BY ad_ratio DESC
	tx = tx.Select("g_snv_o.locus_id")
	tx = r.db.Table("(germline__snv__occurrence g_snv_o, snv__variant v)").
		Joins("LEFT JOIN (SELECT DISTINCT locus_id, case_id, sequencing_id FROM radiant_jdbc.public.interpretation_germline) i ON i.locus_id = g_snv_o.locus_id AND i.sequencing_id = ? AND i.case_id = ?", fmt.Sprintf("%d", seqId), fmt.Sprintf("%d", caseId)).
		Joins("LEFT JOIN (SELECT DISTINCT occurrence_id, case_id, seq_id, task_id FROM radiant_jdbc.public.occurrence_note WHERE deleted = false) note ON note.occurrence_id = g_snv_o.locus_id AND note.task_id = g_snv_o.task_id AND note.seq_id = ? AND note.case_id = ?", seqId, caseId).
		Select(columns).
		Where("g_snv_o.seq_id = ? and part=? and v.locus_id = g_snv_o.locus_id and g_snv_o.locus_id in (?)", seqId, part, tx)

	utils.AddSort(tx, userQuery) //We re-apply the sort on the outer query

	if err = tx.Find(&occurrences).Error; err != nil {
		return nil, fmt.Errorf("error fetching occurrences: %w", err)
	}
	return occurrences, nil
}

func (r *GermlineSNVOccurrencesRepository) CountOccurrences(_ int, seqId int, userQuery types.CountQuery) (int64, error) {
	return CountSNV(types.GermlineSNVOccurrenceTable, seqId, userQuery, r.db)
}

func (r *GermlineSNVOccurrencesRepository) AggregateOccurrences(_ int, seqId int, userQuery types.AggQuery) ([]Aggregation, error) {
	return AggregateSNV(types.GermlineSNVOccurrenceTable, seqId, userQuery, r.db)
}

func (r *GermlineSNVOccurrencesRepository) GetStatisticsOccurrences(_ int, seqId int, userQuery types.StatisticsQuery) (*types.Statistics, error) {
	return StatisticsSNV(types.GermlineSNVOccurrenceTable, seqId, userQuery, r.db)
}

func (r *GermlineSNVOccurrencesRepository) GetExpandedOccurrence(caseId int, seqId int, locusId int) (*ExpandedGermlineSNVOccurrence, error) {
	tx := r.db.Table("germline__snv__occurrence g_snv_o")
	tx = tx.Where("g_snv_o.seq_id = ? AND g_snv_o.locus_id = ?", seqId, locusId)
	tx = tx.Joins("JOIN snv__consequence c ON g_snv_o.locus_id=c.locus_id AND c.is_picked = true")
	tx = tx.Joins("JOIN snv__variant v ON g_snv_o.locus_id=v.locus_id")
	tx = tx.Joins("LEFT JOIN radiant_jdbc.public.interpretation_germline i ON i.locus_id=g_snv_o.locus_id AND i.sequencing_id = g_snv_o.seq_id AND i.transcript_id = v.transcript_id AND i.case_id = ?", fmt.Sprintf("%d", caseId))
	tx = tx.Joins("LEFT JOIN ensembl_gene g ON g.name=v.symbol")
	tx = tx.Select("c.locus_id, v.hgvsg, v.locus, v.chromosome, v.start, v.end, v.symbol, v.transcript_id, v.is_canonical, " +
		"v.is_mane_select, v.is_mane_plus, c.exon_rank, c.exon_total, v.dna_change, v.vep_impact, v.consequences, " +
		"v.aa_change, v.rsnumber, v.clinvar_interpretation, c.gnomad_pli, c.gnomad_loeuf, c.spliceai_type, c.spliceai_ds, " +
		"v.germline_pf_wgs, v.gnomad_v3_af, c.sift_pred, c.sift_score, c.revel_score, c.fathmm_pred, c.fathmm_score, c.cadd_phred, c.cadd_score, " +
		"c.dann_score, c.lrt_pred, c.lrt_score, c.polyphen2_hvar_pred, c.polyphen2_hvar_score, g_snv_o.zygosity, g_snv_o.transmission_mode, g_snv_o.parental_origin, " +
		"g_snv_o.father_calls, g_snv_o.mother_calls, g_snv_o.info_qd, g_snv_o.ad_alt, g_snv_o.ad_total, g_snv_o.filter, g_snv_o.gq," +
		"g_snv_o.exomiser_gene_combined_score, g_snv_o.exomiser_acmg_evidence, g_snv_o.exomiser_acmg_classification, v.germline_pc_wgs_affected, v.germline_pn_wgs_affected, v.germline_pf_wgs_affected, " +
		"v.germline_pc_wgs_not_affected, v.germline_pn_wgs_not_affected, v.germline_pf_wgs_not_affected, i.classification as interpretation_classification_code, g.gene_id as ensembl_gene_id")

	var expandedOccurrence ExpandedGermlineSNVOccurrence
	if err := tx.Take(&expandedOccurrence).Error; err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("error while fetching expanded occurrence: %w", err)
		} else {
			return nil, nil
		}
	}

	if len(expandedOccurrence.InterpretationClassificationCode) > 0 {
		classification, err := types.GetLabelFromCode(expandedOccurrence.InterpretationClassificationCode)
		if err != nil {
			return nil, fmt.Errorf("error while fetching occurrence interpretation: %w", err)
		}
		expandedOccurrence.InterpretationClassification = classification
	}

	txOmim := r.db.Table("omim_gene_panel omim")
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
