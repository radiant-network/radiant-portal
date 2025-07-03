package repository

import (
	"errors"
	"fmt"
	"log"

	"github.com/radiant-network/radiant-api/internal/utils"

	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
)

type VariantHeader = types.VariantHeader
type VariantOverview = types.VariantOverview
type VariantConsequence = types.VariantConsequence
type VariantInterpretedCase = types.VariantInterpretedCase
type VariantUninterpretedCase = types.VariantUninterpretedCase
type VariantExpendedInterpretedCase = types.VariantExpendedInterpretedCase
type VariantCasesFilters = types.VariantCasesFilters

type VariantsRepository struct {
	db *gorm.DB
}

type VariantsDAO interface {
	GetVariantHeader(locusId int) (*VariantHeader, error)
	GetVariantOverview(locusId int) (*VariantOverview, error)
	GetVariantConsequences(locusId int) (*[]VariantConsequence, error)
	GetVariantInterpretedCases(locusId int, userQuery types.ListQuery) (*[]VariantInterpretedCase, *int64, error)
	GetVariantUninterpretedCases(locusId int, userQuery types.ListQuery) (*[]VariantUninterpretedCase, *int64, error)
	GetVariantExpendedInterpretedCase(locusId int, seqId int, transcriptId string) (*VariantExpendedInterpretedCase, error)
	GetVariantCasesCount(locusId int) (int64, error)
	GetVariantCasesFilters() (*VariantCasesFilters, error)
}

func NewVariantsRepository(db *gorm.DB) *VariantsRepository {
	if db == nil {
		log.Fatal("VariantsRepository: db is nil")
		return nil
	}
	return &VariantsRepository{db: db}
}

func (r *VariantsRepository) GetVariantHeader(locusId int) (*VariantHeader, error) {
	tx := r.db.Table("germline__snv__variant v")
	tx = tx.Where("v.locus_id = ?", locusId)
	tx = tx.Select("v.hgvsg")

	var variantHeader VariantHeader
	if err := tx.First(&variantHeader).Error; err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("error while fetching variant header: %w", err)
		} else {
			return nil, nil
		}
	}

	variantHeader.AssemblyVersion = "GRCh38"
	variantHeader.Source = []string{"WGS"}

	return &variantHeader, nil
}

func (r *VariantsRepository) GetVariantOverview(locusId int) (*VariantOverview, error) {
	tx := r.db.Table("germline__snv__variant v")
	tx = tx.Joins("JOIN germline__snv__consequence c ON v.locus_id=c.locus_id AND v.locus_id = ? AND c.is_picked = true", locusId)
	tx = tx.Joins("LEFT JOIN clinvar cl ON cl.locus_id = v.locus_id")
	tx = tx.Select("v.symbol, v.consequences, v.clinvar_interpretation, v.clinvar_name, v.pc_wgs, v.pf_wgs, v.pn_wgs, v.gnomad_v3_af, v.is_canonical, v.is_mane_select, c.is_mane_plus, c.exon_rank, c.exon_total, c.transcript_id, c.dna_change, v.rsnumber, v.vep_impact, v.aa_change, c.consequences, c.sift_pred, c.sift_score, c.revel_score,c.gnomad_loeuf, c.spliceai_ds, c.spliceai_type, v.locus, c.fathmm_pred, c.fathmm_score, c.cadd_phred, c.cadd_score, c.dann_score, c.lrt_pred, c.lrt_score, c.polyphen2_hvar_pred, c.polyphen2_hvar_score, c.phyloP17way_primate, c.gnomad_pli, cl.name as clinvar_id")

	var variantOverview VariantOverview
	if err := tx.First(&variantOverview).Error; err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("error while fetching variant overview: %w", err)
		} else {
			return nil, nil
		}
	}

	txOmim := r.db.Table("omim_gene_panel omim")
	txOmim = txOmim.Select("omim.omim_phenotype_id, omim.panel, omim.inheritance_code")
	txOmim = txOmim.Where("omim.omim_phenotype_id is not null and omim.symbol = ?", variantOverview.Symbol)
	txOmim = txOmim.Order("omim.omim_phenotype_id asc")

	var omimConditions []OmimGenePanel
	if errOmim := txOmim.Find(&omimConditions).Error; errOmim != nil {
		if !errors.Is(errOmim, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("error while fetching omim conditions: %w", errOmim)
		} else {
			return &variantOverview, errOmim
		}
	}
	variantOverview.OmimConditions = omimConditions
	return &variantOverview, nil
}

func (r *VariantsRepository) GetVariantConsequences(locusId int) (*[]VariantConsequence, error) {
	tx := r.db.Table("germline__snv__consequence c")
	tx = tx.Select("c.is_picked, c.symbol, c.biotype, c.gnomad_pli, c.gnomad_loeuf, c.spliceai_ds, c.spliceai_type, c.transcript_id, c.vep_impact, c.is_canonical, c.is_mane_select, c.is_mane_plus, c.exon_rank, c.exon_total, c.dna_change, c.aa_change, c.consequences, c.sift_pred, c.sift_score, c.fathmm_pred, c.fathmm_score, c.cadd_phred, c.cadd_score, c.dann_score, c.lrt_pred, c.lrt_score, c.revel_score, c.polyphen2_hvar_pred, c.polyphen2_hvar_score, c.phyloP17way_primate")
	tx = tx.Where("c.locus_id = ?", locusId)

	var consequences []Consequence
	if err := tx.Find(&consequences).Error; err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("error while fetching variant consequences: %w", err)
		} else {
			return nil, nil
		}
	}
	if len(consequences) == 0 {
		return nil, nil
	}

	variantConsequences := utils.ConsequencesToVariantConsequences(consequences)

	return &variantConsequences, nil
}

func (r *VariantsRepository) GetVariantInterpretedCases(locusId int, userQuery types.ListQuery) (*[]VariantInterpretedCase, *int64, error) {
	var count int64

	tx := r.db.Table("`radiant_jdbc`.`public`.`interpretation_germline` ig")
	tx = tx.Joins("INNER JOIN germline__snv__occurrence o ON ig.sequencing_id = o.seq_id and ig.locus_id = o.locus_id")
	tx = tx.Joins("INNER JOIN `radiant_jdbc`.`public`.`sequencing_experiment` s ON s.id = o.seq_id")
	tx = tx.Joins("INNER JOIN `radiant_jdbc`.`public`.`cases` c ON c.id = s.case_id")
	tx = tx.Joins("INNER JOIN `radiant_jdbc`.`public`.`case_analysis` ca ON ca.id = c.case_analysis_id")
	tx = tx.Joins("INNER JOIN `radiant_jdbc`.`public`.`organization` lab ON lab.id = c.performer_lab_id")
	tx = tx.Joins("LEFT JOIN mondo_term mondo ON mondo.id = ig.condition")

	tx = tx.Where("o.locus_id = ?", locusId)
	if userQuery != nil {
		utils.AddWhere(userQuery, tx)
	}

	if err := tx.Count(&count).Error; err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil, fmt.Errorf("error while counting variant interpreted cases: %w", err)
		} else {
			return nil, nil, nil
		}
	}

	tx = tx.Select("s.id as seq_id, c.id as case_id, ig.transcript_id as transcript_id, ig.updated_at as interpretation_updated_on, mondo.id as condition_id, mondo.name as condition_name, ig.classification, o.zygosity, lab.code as performer_lab_code, lab.name as performer_lab_name, ca.code as case_analysis_code, ca.name as case_analysis_name, c.status_code")

	utils.AddLimitAndSort(tx, userQuery)

	var variantInterpretedCases []VariantInterpretedCase
	if err := tx.Find(&variantInterpretedCases).Error; err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil, fmt.Errorf("error while fetching variant interpreted cases: %w", err)
		} else {
			return nil, nil, nil
		}
	}

	return &variantInterpretedCases, &count, nil
}

func (r *VariantsRepository) GetVariantUninterpretedCases(locusId int, userQuery types.ListQuery) (*[]VariantUninterpretedCase, *int64, error) {
	var count int64
	if userQuery != nil && userQuery.HasFieldFromTables(types.InterpretationGermlineTable) {
		count = 0
		return &[]VariantUninterpretedCase{}, &count, nil
	}

	locusIdString := fmt.Sprintf("%d", locusId)
	txInterpreted := r.db.Table("radiant_jdbc.public.interpretation_germline").Select("sequencing_id").Where("locus_id = ?", locusIdString)

	tx := r.db.Table("`radiant_jdbc`.`public`.`sequencing_experiment` s")
	tx = tx.Joins("INNER JOIN germline__snv__occurrence o ON s.id = o.seq_id")
	tx = tx.Joins("INNER JOIN `radiant_jdbc`.`public`.`cases` c ON c.id = s.case_id")
	tx = tx.Joins("INNER JOIN `radiant_jdbc`.`public`.`case_analysis` ca ON ca.id = c.case_analysis_id")
	tx = tx.Joins("INNER JOIN `radiant_jdbc`.`public`.`organization` lab ON lab.id = c.performer_lab_id")
	tx = tx.Joins("LEFT JOIN mondo_term mondo ON mondo.id = c.primary_condition")
	tx = tx.Where("o.locus_id = ? AND s.id NOT IN (?)", locusId, txInterpreted)

	if userQuery != nil {
		utils.AddWhere(userQuery, tx)
	}

	if err := tx.Distinct("c.id").Count(&count).Error; err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil, fmt.Errorf("error while counting variant uninterpreted cases: %w", err)
		} else {
			return nil, nil, nil
		}
	}

	tx = tx.Select("c.id as case_id, c.created_on, c.updated_on, mondo.id as primary_condition_id, mondo.name as primary_condition_name, o.zygosity, lab.code as performer_lab_code, lab.name as performer_lab_name, ca.code as case_analysis_code, ca.name as case_analysis_name, c.status_code")

	utils.AddLimitAndSort(tx, userQuery)

	var variantUninterpretedCases []VariantUninterpretedCase
	if err := tx.Find(&variantUninterpretedCases).Error; err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil, fmt.Errorf("error while fetching variant uninterpreted cases: %w", err)
		} else {
			return nil, nil, nil
		}
	}

	return &variantUninterpretedCases, &count, nil
}

func (r *VariantsRepository) GetVariantExpendedInterpretedCase(locusId int, seqId int, transcriptId string) (*VariantExpendedInterpretedCase, error) {
	locusIdAsString := fmt.Sprintf("%d", locusId)
	SeqIdAsString := fmt.Sprintf("%d", seqId)
	tx := r.db.Table("radiant_jdbc.public.interpretation_germline i")
	tx = tx.Joins("INNER JOIN germline__snv__occurrence o ON i.sequencing_id = o.seq_id and o.locus_id = i.locus_id")
	tx = tx.Joins("INNER JOIN germline__snv__variant v ON i.locus_id = v.locus_id")
	tx = tx.Joins("INNER JOIN `radiant_jdbc`.`public`.`sequencing_experiment` s ON s.id = o.seq_id")
	tx = tx.Joins("INNER JOIN `radiant_jdbc`.`public`.`cases` c ON c.id = s.case_id")
	tx = tx.Joins("INNER JOIN `radiant_jdbc`.`public`.`patient` p ON p.id = c.proband_id")
	tx = tx.Where("i.locus_id = ? AND i.sequencing_id = ? AND i.transcript_id = ?", locusIdAsString, SeqIdAsString, transcriptId)
	tx = tx.Select("c.proband_id as patient_id, i.updated_by_name as interpreter_name, i.interpretation as interpretation, v.symbol as gene_symbol, i.classification_criterias as classification_criterias_string, i.transmission_modes as inheritances_string, i.pubmed as pubmed_ids_string, p.sex_code as patient_sex_code")

	var variantExpendedInterpretedCase VariantExpendedInterpretedCase
	if err := tx.Find(&variantExpendedInterpretedCase).Error; err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("error while fetching variant expended interpreted cases: %w", err)
		} else {
			return nil, nil
		}
	}

	variantExpendedInterpretedCase.ClassificationCriterias = split(variantExpendedInterpretedCase.ClassificationCriteriasString)
	variantExpendedInterpretedCase.Inheritances = split(variantExpendedInterpretedCase.InheritancesString)
	variantExpendedInterpretedCase.PubmedIDs = split(variantExpendedInterpretedCase.PubmedIDsString)

	return &variantExpendedInterpretedCase, nil
}

func (r *VariantsRepository) GetVariantCasesCount(locusId int) (int64, error) {
	tx := r.db.Table("`radiant_jdbc`.`public`.`sequencing_experiment` s")
	tx = tx.Joins("INNER JOIN germline__snv__occurrence o ON s.id = o.seq_id")
	tx = tx.Where("o.locus_id = ?", locusId)
	tx = tx.Distinct("s.case_id")
	var count int64
	if err := tx.Count(&count).Error; err != nil {
		return 0, fmt.Errorf("error counting variant cases: %w", err)
	}
	return count, nil
}

func (r *VariantsRepository) GetVariantCasesFilters() (*VariantCasesFilters, error) {
	var caseAnalysis []Aggregation
	var performerLab []Aggregation

	txCaseAnalysis := r.db.Table(fmt.Sprintf("%s %s", types.CaseAnalysisTable.Name, types.CaseAnalysisTable.Alias))
	txCaseAnalysis = txCaseAnalysis.Select(fmt.Sprintf("%s.code as bucket, %s.name as label", types.CaseAnalysisTable.Alias, types.CaseAnalysisTable.Alias))
	if err := txCaseAnalysis.Find(&caseAnalysis).Error; err != nil {
		return nil, fmt.Errorf("error fetching case_analysis: %w", err)
	}

	txPerformerLab := r.db.Table(fmt.Sprintf("%s %s", types.PerformerLabTable.Name, types.PerformerLabTable.Alias))
	txPerformerLab = txPerformerLab.Select(fmt.Sprintf("%s.code as bucket, %s.name as label", types.PerformerLabTable.Alias, types.PerformerLabTable.Alias))
	if err := txPerformerLab.Find(&performerLab).Error; err != nil {
		return nil, fmt.Errorf("error fetching performer lab: %w", err)
	}

	var classification = []Aggregation{
		{Bucket: "LA6668-3", Label: "pathogenic"},
		{Bucket: "LA26332-9", Label: "likelyPathogenic"},
		{Bucket: "LA26333-7", Label: "vus"},
		{Bucket: "LA26334-5", Label: "likelyBenign"},
		{Bucket: "LA6675-8", Label: "benign"},
	}

	return &VariantCasesFilters{
		Classification: classification,
		CaseAnalysis:   caseAnalysis,
		PerformerLab:   performerLab,
	}, nil
}
