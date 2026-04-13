package repository

import (
	"errors"
	"fmt"
	"log"

	"github.com/Goldziher/go-utils/sliceutils"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/internal/utils"
	"gorm.io/gorm"
)

type ExpandedSomaticSNVOccurrence = types.ExpandedSomaticSNVOccurrence

type SomaticSNVOccurrence = types.SomaticSNVOccurrence

type SomaticSNVOccurrencesRepository struct {
	db *gorm.DB
}

type SomaticSNVOccurrencesDAO interface {
	GetOccurrences(caseId int, seqId int, userFilter types.ListQuery) ([]SomaticSNVOccurrence, error)
	CountOccurrences(caseId int, seqId int, userQuery types.CountQuery) (int64, error)
	AggregateOccurrences(caseId int, seqId int, userQuery types.AggQuery) ([]Aggregation, error)
	GetStatisticsOccurrences(caseId int, seqId int, userQuery types.StatisticsQuery) (*Statistics, error)
	GetExpandedOccurrence(caseId int, seqId int, locusId int) (*ExpandedSomaticSNVOccurrence, error)
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
	// 		LEFT JOIN (SELECT DISTINCT occurrence_id, case_id, seq_id, task_id FROM radiant_jdbc.public.occurrence_note WHERE deleted = false) note ON note.occurrence_id = s_snv_o.locus_id AND note.task_id = s_snv_o.task_id AND note.seq_id = ? AND note.case_id = ?
	// WHERE s_snv_o.locus_id in (
	//	SELECT s_snv_o.locus_id FROM somatic__snv__occurrence JOIN ... WHERE quality > 100 ORDER BY ad_ratio DESC LIMIT 10
	// ) AND s_snv_o.tumor_seq_id=? AND s_snv_o.part=? AND v.locus_id=s_snv_o.locus_id ORDER BY ad_ratio DESC
	tx = tx.Select("s_snv_o.locus_id")
	tx = r.db.Table("(somatic__snv__occurrence s_snv_o, snv__variant v)").
		Joins("LEFT JOIN (SELECT DISTINCT locus_id, case_id, sequencing_id FROM radiant_jdbc.public.interpretation_somatic) i ON i.locus_id = s_snv_o.locus_id AND i.sequencing_id = ? AND i.case_id = ?", fmt.Sprintf("%d", seqId), fmt.Sprintf("%d", caseId)).
		Joins("LEFT JOIN (SELECT DISTINCT occurrence_id, case_id, seq_id, task_id FROM radiant_jdbc.public.occurrence_note WHERE deleted = false) note ON note.occurrence_id = s_snv_o.locus_id AND note.task_id = s_snv_o.task_id AND note.seq_id = ? AND note.case_id = ?", seqId, caseId).
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

func (r *SomaticSNVOccurrencesRepository) GetExpandedOccurrence(_ int, seqId int, locusId int) (*ExpandedSomaticSNVOccurrence, error) {
	tx := r.db.Table("somatic__snv__occurrence s_snv_o")
	tx = tx.Where("s_snv_o.tumor_seq_id = ? AND s_snv_o.locus_id = ?", seqId, locusId)
	tx = tx.Joins("JOIN snv__consequence c ON s_snv_o.locus_id=c.locus_id AND c.is_picked = true")
	tx = tx.Joins("JOIN snv__variant v ON s_snv_o.locus_id=v.locus_id")
	tx = tx.Joins("LEFT JOIN ensembl_gene g ON g.name=v.symbol")
	tx = tx.Select("c.locus_id, v.hgvsg, v.locus, v.chromosome, v.start, v.end, v.symbol, v.transcript_id, v.is_canonical, " +
		"v.is_mane_select, v.is_mane_plus, c.exon_rank, c.exon_total, v.dna_change, v.vep_impact, v.consequences, " +
		"v.aa_change, v.rsnumber, v.clinvar_interpretation, c.gnomad_pli, c.gnomad_loeuf, c.spliceai_type, c.spliceai_ds, " +
		"v.somatic_pc_tn_wgs, v.somatic_pn_tn_wgs, v.somatic_pf_tn_wgs, v.gnomad_v3_af, " +
		"c.sift_pred, c.sift_score, c.revel_score, c.fathmm_pred, c.fathmm_score, c.cadd_phred, c.cadd_score, " +
		"c.dann_score, c.lrt_pred, c.lrt_score, c.polyphen2_hvar_pred, c.polyphen2_hvar_score, " +
		"s_snv_o.info_qd, s_snv_o.tumor_ad_alt as ad_alt, s_snv_o.tumor_ad_total as ad_total, s_snv_o.tumor_ad_ratio as ad_ratio, s_snv_o.filter, " +
		"g.gene_id as ensembl_gene_id")

	var expandedOccurrence ExpandedSomaticSNVOccurrence
	if err := tx.Take(&expandedOccurrence).Error; err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("error while fetching expanded occurrence: %w", err)
		} else {
			return nil, nil
		}
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
