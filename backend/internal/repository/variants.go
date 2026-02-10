package repository

import (
	"errors"
	"fmt"
	"log"
	"sort"

	"github.com/Goldziher/go-utils/sliceutils"
	"github.com/radiant-network/radiant-api/internal/utils"

	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
)

type VariantHeader = types.VariantHeader
type VariantOverview = types.VariantOverview
type VariantConsequence = types.VariantConsequence
type VariantInterpretedCase = types.VariantInterpretedCase
type VariantUninterpretedCase = types.VariantUninterpretedCase
type VariantExpandedInterpretedCase = types.VariantExpandedInterpretedCase
type VariantCasesFilters = types.VariantCasesFilters
type VariantCasesCount = types.VariantCasesCount
type VariantExternalFrequencies = types.VariantExternalFrequencies
type VariantInternalFrequencies = types.VariantInternalFrequencies

type VariantsRepository struct {
	db *gorm.DB
}

type VariantsDAO interface {
	GetVariantHeader(locusId int) (*VariantHeader, error)
	GetVariantOverview(locusId int) (*VariantOverview, error)
	GetVariantConsequences(locusId int) (*[]VariantConsequence, error)
	GetVariantInterpretedCases(locusId int, userQuery types.ListQuery) (*[]VariantInterpretedCase, *int64, error)
	GetVariantUninterpretedCases(locusId int, userQuery types.ListQuery) (*[]VariantUninterpretedCase, *int64, error)
	GetVariantExpandedInterpretedCase(locusId int, caseId int, seqId int, transcriptId string) (*VariantExpandedInterpretedCase, error)
	GetVariantCasesCount(locusId int) (*VariantCasesCount, error)
	GetVariantCasesFilters() (*VariantCasesFilters, error)
	GetVariantExternalFrequencies(locusId int) (*VariantExternalFrequencies, error)
	GetVariantGlobalInternalFrequencies(locusId int) (*types.InternalFrequencies, error)
	GetVariantInternalFrequenciesSplitBy(locusId int, splitType types.SplitType) (*[]types.InternalFrequenciesSplitBy, error)
}

func NewVariantsRepository(db *gorm.DB) *VariantsRepository {
	if db == nil {
		log.Print("VariantsRepository: db is nil")
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
	tx := r.db.Table(fmt.Sprintf("%s %s", types.ConsequenceTable.Name, types.ConsequenceTable.Alias))
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

	txAggPhenotypes := utils.GetAggregatedPhenotypes(r.db)

	tx := r.db.Table(fmt.Sprintf("%s %s", types.InterpretationGermlineTable.FederationName, types.InterpretationGermlineTable.Alias))
	tx = utils.JoinGermlineInterpretationWithSnvOccurrence(tx)
	tx = utils.JoinGermlineSNVOccurrenceWithSeqExp(tx)
	tx = utils.JoinGermlineInterpretationWithCase(tx)
	tx = utils.JoinSeqExpWithSample(tx)
	tx = utils.JoinSampleAndCaseWithFamily(tx)
	tx = utils.JoinCaseWithAnalysisCatalog(tx)
	tx = utils.JoinCaseWithDiagnosisLab(tx)
	tx = tx.Joins("LEFT JOIN mondo_term mondo ON mondo.id = ig.condition")
	tx = tx.Joins("LEFT JOIN (?) agg_phenotypes ON agg_phenotypes.case_id = c.id AND agg_phenotypes.patient_id = spl.patient_id", txAggPhenotypes)

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

	tx = tx.Select("s.id as seq_id, c.id as case_id, spl.patient_id as patient_id, ig.transcript_id as transcript_id, " +
		"ig.updated_at as interpretation_updated_on, mondo.id as condition_id, mondo.name as condition_name, " +
		"ig.classification as classification_code, o.zygosity, lab.code as diagnosis_lab_code, lab.name as diagnosis_lab_name, " +
		"ca.code as analysis_catalog_code, ca.name as analysis_catalog_name, c.status_code, " +
		"agg_phenotypes.phenotypes_term as phenotypes_unparsed, " +
		"spl.submitter_sample_id as submitter_sample_id, " +
		"f.relationship_to_proband_code as relationship_to_proband, f.affected_status_code as affected_status")

	utils.AddLimitAndSort(tx, userQuery)

	var variantInterpretedCases []VariantInterpretedCase
	if err := tx.Find(&variantInterpretedCases).Error; err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil, fmt.Errorf("error while fetching variant interpreted cases: %w", err)
		} else {
			return nil, nil, nil
		}
	}

	for i, interpreted := range variantInterpretedCases {
		phenotypes := utils.PhenotypeUnparsedToJsonArrayOfTerms(interpreted.PhenotypesUnparsed)
		variantInterpretedCases[i].Phenotypes = phenotypes
		classification, err := types.GetLabelFromCode(variantInterpretedCases[i].ClassificationCode)
		if err != nil {
			return nil, nil, fmt.Errorf("error while fetching variant interpreted cases: %w", err)
		}
		variantInterpretedCases[i].Classification = classification
	}

	return &variantInterpretedCases, &count, nil
}

func (r *VariantsRepository) GetVariantUninterpretedCases(locusId int, userQuery types.ListQuery) (*[]VariantUninterpretedCase, *int64, error) {
	var count int64
	if userQuery != nil && userQuery.HasFieldFromTables(types.InterpretationGermlineTable) {
		count = 0
		return &[]VariantUninterpretedCase{}, &count, nil
	}

	txAggPhenotypes := utils.GetAggregatedPhenotypes(r.db)

	locusIdString := fmt.Sprintf("%d", locusId)

	tx := r.db.Table(fmt.Sprintf("%s %s", types.CaseHasSequencingExperimentTable.FederationName, types.CaseHasSequencingExperimentTable.Alias))
	tx = utils.JoinCaseHasSeqExpWithGermlineSnvOccurrence(tx)
	tx = utils.JoinCaseHasSeqExpWithSequencingExperiment(tx)
	tx = utils.JoinCaseHasSeqExpWithCase(tx)
	tx = utils.JoinCaseWithAnalysisCatalog(tx)
	tx = utils.JoinCaseWithDiagnosisLab(tx)
	tx = utils.JoinSeqExpWithSample(tx)
	tx = utils.JoinSampleAndCaseHasSeqExpWithFamily(tx)
	tx = tx.Joins("LEFT JOIN mondo_term mondo ON mondo.id = c.primary_condition")
	tx = utils.AntiJoinCaseHasSeqExpWithGermlineInterpretationForLocus(tx, locusIdString)
	tx = tx.Joins("LEFT JOIN (?) agg_phenotypes ON agg_phenotypes.case_id = c.id AND agg_phenotypes.patient_id = spl.patient_id", txAggPhenotypes)
	tx = tx.Where("o.locus_id = ?", locusId)

	if userQuery != nil {
		utils.AddWhere(userQuery, tx)
	}

	var columns = sliceutils.Map(userQuery.SelectedFields(), func(field types.Field, index int, slice []types.Field) string {
		return fmt.Sprintf("%s.%s as %s", field.Table.Alias, field.Name, field.GetAlias())
	})

	if err := tx.Count(&count).Error; err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil, fmt.Errorf("error while counting variant uninterpreted cases: %w", err)
		} else {
			return nil, nil, nil
		}
	}

	tx = tx.Select(columns)

	utils.AddLimitAndSort(tx, userQuery)

	var variantUninterpretedCases []VariantUninterpretedCase
	if err := tx.Find(&variantUninterpretedCases).Error; err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil, fmt.Errorf("error while fetching variant uninterpreted cases: %w", err)
		} else {
			return nil, nil, nil
		}
	}

	for i, uninterpreted := range variantUninterpretedCases {
		phenotypes := utils.PhenotypeUnparsedToJsonArrayOfTerms(uninterpreted.PhenotypesUnparsed)
		variantUninterpretedCases[i].Phenotypes = phenotypes
	}

	return &variantUninterpretedCases, &count, nil
}

func (r *VariantsRepository) GetVariantExpandedInterpretedCase(locusId int, caseId int, seqId int, transcriptId string) (*VariantExpandedInterpretedCase, error) {
	locusIdAsString := fmt.Sprintf("%d", locusId)
	caseIdAsString := fmt.Sprintf("%d", caseId)
	seqIdAsString := fmt.Sprintf("%d", seqId)
	tx := r.db.Table(fmt.Sprintf("%s %s", types.InterpretationGermlineTable.FederationName, types.InterpretationGermlineTable.Alias))
	tx = utils.JoinGermlineInterpretationWithSnvOccurrence(tx)
	tx = utils.JoinGermlineInterpretationWithVariant(tx)
	tx = utils.JoinGermlineSNVOccurrenceWithSeqExp(tx)
	tx = utils.JoinSeqExpWithSample(tx)
	tx = utils.JoinGermlineSNVOccurrenceWithCaseHasSeqExp(tx)
	tx = utils.JoinCaseHasSeqExpWithCase(tx)
	tx = utils.JoinCaseWithProband(tx, nil)
	tx = tx.Where("ig.locus_id = ? AND ig.case_id = ? AND ig.sequencing_id = ? AND ig.transcript_id = ?", locusIdAsString, caseIdAsString, seqIdAsString, transcriptId)
	tx = tx.Select("spl.patient_id as patient_id, ig.updated_by_name as interpreter_name, ig.interpretation as interpretation, v.symbol as gene_symbol, ig.classification_criterias as classification_criterias_string, ig.transmission_modes as inheritances_string, ig.pubmed as pubmed_ids_string, pro.sex_code as patient_sex_code")

	var variantExpandedInterpretedCase VariantExpandedInterpretedCase
	if err := tx.Find(&variantExpandedInterpretedCase).Error; err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("error while fetching variant expanded interpreted cases: %w", err)
		} else {
			return nil, nil
		}
	}

	variantExpandedInterpretedCase.ClassificationCriterias = utils.SplitRemoveEmptyString(variantExpandedInterpretedCase.ClassificationCriteriasString, ",")
	variantExpandedInterpretedCase.Inheritances = utils.SplitRemoveEmptyString(variantExpandedInterpretedCase.InheritancesString, ",")
	variantExpandedInterpretedCase.PubmedIDs = utils.SplitRemoveEmptyString(variantExpandedInterpretedCase.PubmedIDsString, ",")

	return &variantExpandedInterpretedCase, nil
}

func (r *VariantsRepository) GetVariantCasesCount(locusId int) (*VariantCasesCount, error) {
	var countInterpreted int64
	var countUnInterpreted int64

	locusIdString := fmt.Sprintf("%d", locusId)
	txInterpreted := r.db.Table(fmt.Sprintf("%s %s", types.InterpretationGermlineTable.FederationName, types.InterpretationGermlineTable.Alias))
	txInterpreted = txInterpreted.Select("COUNT(1)")
	txInterpreted = txInterpreted.Where("locus_id = ?", locusIdString)
	if err := txInterpreted.Find(&countInterpreted).Error; err != nil {
		return nil, fmt.Errorf("error counting variant interpreted cases: %w", err)
	}

	txUnInterpreted := r.db.Table(fmt.Sprintf("%s %s", types.GermlineSNVOccurrenceTable.Name, types.GermlineSNVOccurrenceTable.Alias))
	txUnInterpreted = utils.JoinGermlineSNVOccurrenceWithCaseHasSeqExp(txUnInterpreted)
	txUnInterpreted = utils.AntiJoinCaseHasSeqExpWithGermlineInterpretationForLocus(txUnInterpreted, locusIdString)
	txUnInterpreted = txUnInterpreted.Select("COUNT(DISTINCT CONCAT(chseq.case_id, chseq.sequencing_experiment_id))")
	txUnInterpreted = txUnInterpreted.Where("o.locus_id = ?", locusId)

	if err := txUnInterpreted.Find(&countUnInterpreted).Error; err != nil {
		return nil, fmt.Errorf("error counting variant interpreted cases: %w", err)
	}

	return &VariantCasesCount{
		CountInterpreted:   countInterpreted,
		CountUninterpreted: countUnInterpreted,
	}, nil
}

func (r *VariantsRepository) GetVariantCasesFilters() (*VariantCasesFilters, error) {
	var analysisCatalog []Aggregation
	var diagnosisLab []Aggregation

	txAnalysisCatalog := r.db.Table(fmt.Sprintf("%s %s", types.AnalysisCatalogTable.FederationName, types.AnalysisCatalogTable.Alias))
	txAnalysisCatalog = txAnalysisCatalog.Select(fmt.Sprintf("%s.code as bucket, %s.name as label", types.AnalysisCatalogTable.Alias, types.AnalysisCatalogTable.Alias))
	txAnalysisCatalog = txAnalysisCatalog.Order("bucket asc")
	if err := txAnalysisCatalog.Find(&analysisCatalog).Error; err != nil {
		return nil, fmt.Errorf("error fetching analysis catalog: %w", err)
	}

	txDiagnosisLab := r.db.Table(fmt.Sprintf("%s %s", types.OrganizationTable.FederationName, types.OrganizationTable.Alias))
	txDiagnosisLab = txDiagnosisLab.Select(fmt.Sprintf("%s.code as bucket, %s.name as label", types.OrganizationTable.Alias, types.OrganizationTable.Alias))
	txDiagnosisLab = txDiagnosisLab.Where(fmt.Sprintf("%s.category_code = 'diagnostic_laboratory'", types.OrganizationTable.Alias))
	txDiagnosisLab = txDiagnosisLab.Order("bucket asc")
	if err := txDiagnosisLab.Find(&diagnosisLab).Error; err != nil {
		return nil, fmt.Errorf("error fetching diagnosis lab: %w", err)
	}

	return &VariantCasesFilters{
		Classification:  types.MapToAggregationArray(),
		AnalysisCatalog: analysisCatalog,
		DiagnosisLab:    diagnosisLab,
	}, nil
}

func (r *VariantsRepository) GetVariantExternalFrequencies(locusId int) (*VariantExternalFrequencies, error) {
	var topmed types.ExternalFrequencies
	var gnomadV3 types.ExternalFrequencies
	var thousandGenomes types.ExternalFrequencies
	var result types.VariantExternalFrequencies

	tx := r.db.Table(fmt.Sprintf("%s v", types.VariantTable.Name))
	tx = tx.Joins(fmt.Sprintf("LEFT JOIN %s topmed ON topmed.locus_id = v.locus_id", types.TopmedTable.Name))
	tx = tx.Joins(fmt.Sprintf("LEFT JOIN %s gnomad ON gnomad.locus_id = v.locus_id", types.GnomadGenomesV3Table.Name))
	tx = tx.Joins(fmt.Sprintf("LEFT JOIN %s thousand ON thousand.locus_id = v.locus_id", types.ThousandGenomesTable.Name))
	tx = tx.Where("v.locus_id = ?", locusId)
	tx = tx.Select("v.locus, " +
		"topmed.af as topmed_af, topmed.ac as topmed_ac, topmed.an as topmed_an, topmed.hom as topmed_hom, " +
		"gnomad.af as gnomad_v3_af, gnomad.ac as gnomad_v3_ac, gnomad.an as gnomad_v3_an, gnomad.hom as gnomad_v3_hom, " +
		"thousand.af as thousand_genomes_af, thousand.ac as thousand_genomes_ac, thousand.an as thousand_genomes_an")

	if err := tx.First(&result).Error; err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("error fetching external frequencies: %w", err)
		} else {
			return nil, nil
		}
	}

	topmed = types.ExternalFrequencies{
		Cohort: types.TopmedTable.Name,
		Af:     result.TopmedAf,
		Ac:     result.TopmedAc,
		An:     result.TopmedAn,
		Hom:    result.TopmedHom,
	}

	gnomadV3 = types.ExternalFrequencies{
		Cohort: types.GnomadGenomesV3Table.Name,
		Af:     result.GnomadV3Af,
		Ac:     result.GnomadV3Ac,
		An:     result.GnomadV3An,
		Hom:    result.GnomadV3Hom,
	}

	thousandGenomes = types.ExternalFrequencies{
		Cohort: types.ThousandGenomesTable.Name,
		Af:     result.ThousandGenomesAf,
		Ac:     result.ThousandGenomesAc,
		An:     result.ThousandGenomesAn,
	}

	result.ExternalFrequencies = []types.ExternalFrequencies{topmed, gnomadV3, thousandGenomes}

	return &result, nil
}

func (r *VariantsRepository) GetVariantGlobalInternalFrequencies(locusId int) (*types.InternalFrequencies, error) {
	var globalFrequencies types.InternalFrequencies

	tx := r.db.Table(fmt.Sprintf("%s v", types.VariantTable.Name))
	tx = tx.Select("v.pc_wgs as pc_all, v.pn_wgs as pn_all, v.pf_wgs as pf_all, v.pc_wgs_affected as pc_affected, v.pn_wgs_affected as pn_affected, v.pf_wgs_affected as pf_affected, v.pc_wgs_not_affected as pc_non_affected, v.pn_wgs_not_affected as pn_non_affected, v.pf_wgs_not_affected as pf_non_affected")
	tx = tx.Where("v.locus_id = ?", locusId)

	if err := tx.First(&globalFrequencies).Error; err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("error fetching global internal frequencies: %w", err)
		} else {
			return nil, nil
		}
	}

	return &globalFrequencies, nil
}

func (r *VariantsRepository) GetVariantInternalFrequenciesSplitBy(locusId int, splitType types.SplitType) (*[]types.InternalFrequenciesSplitBy, error) {
	type TempFreqBySplit struct {
		SplitCode          string
		SplitName          string
		AffectedStatusCode string
		Pn                 *int
		Pc                 *int
		Pf                 *float64
		Hom                *int
	}

	var frequenciesByPrimaryCondition []TempFreqBySplit
	var splitRows []types.InternalFrequenciesSplitBy
	var splitCodeColumn string
	var splitNameColumn string
	var joinToRetrieveSplitCode string
	var joinToRetrieveSplitName string

	switch splitType {
	case types.SPLIT_BY_PROJECT:
		splitCodeColumn = "p.code"
		splitNameColumn = "p.name"
		joinToRetrieveSplitCode = "JOIN radiant_jdbc.public.project p ON p.id = c.project_id"
		joinToRetrieveSplitName = "JOIN radiant_jdbc.public.project p ON p.code = split_code"
		break
	case types.SPLIT_BY_PRIMARY_CONDITION:
		splitCodeColumn = "c.primary_condition"
		splitNameColumn = "m.name"
		joinToRetrieveSplitCode = ""
		joinToRetrieveSplitName = "JOIN mondo_term m on m.id = split_code"
		break
	case types.SPLIT_BY_ANALYSIS:
		splitCodeColumn = "ac.code"
		splitNameColumn = "ac.name"
		joinToRetrieveSplitCode = "JOIN radiant_jdbc.public.analysis_catalog ac ON ac.id = c.analysis_catalog_id"
		joinToRetrieveSplitName = "JOIN radiant_jdbc.public.analysis_catalog ac ON ac.code = split_code"
	default:
		return nil, fmt.Errorf("unsupported split type")
	}

	tx := r.db.Raw(fmt.Sprintf(`
		WITH
			base AS (
				SELECT
					%s as split_code,
					seq.patient_id,
					seq.affected_status as affected_status_code,
					o.zygosity
				FROM radiant_jdbc.public.cases c
				%s
				LEFT JOIN radiant_jdbc.public.case_has_sequencing_experiment chse ON chse.case_id = c.id
				JOIN staging_sequencing_experiment seq ON seq.seq_id = chse.sequencing_experiment_id AND seq.experimental_strategy = 'wgs'
				LEFT JOIN germline__snv__occurrence o ON o.seq_id = seq.seq_id AND o.locus_id = ? AND o.gq >= 20 AND o.filter = 'PASS' AND o.ad_alt > 3
			),
			result AS (
				SELECT
					split_code,
					affected_status_code,
					COUNT(DISTINCT patient_id) AS pn,
					COUNT(DISTINCT CASE WHEN zygosity IS NOT NULL THEN patient_id END) AS pc,
					COUNT(DISTINCT CASE WHEN zygosity = 'HOM' THEN patient_id END) AS hom
				FROM (
					SELECT split_code, patient_id, affected_status_code, zygosity
					FROM base
					WHERE affected_status_code IN ('affected', 'non_affected')

					UNION ALL
			
					SELECT split_code, patient_id, 'all' AS affected_status_code, zygosity
					FROM base
				) x
				GROUP BY split_code, affected_status_code
				)
		SELECT
			split_code,
			%s AS split_name,
			affected_status_code,
			pn,
			pc,
			hom,
			CASE
				WHEN pn = 0 THEN NULL
				ELSE pc / pn
			END AS pf
		FROM result
		%s
		ORDER BY split_code;`, splitCodeColumn, joinToRetrieveSplitCode, splitNameColumn, joinToRetrieveSplitName), locusId)

	if err := tx.Scan(&frequenciesByPrimaryCondition).Error; err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("error fetching internal frequencies: %w", err)
		} else {
			return nil, nil
		}
	}

	bySplit := make(map[string][]TempFreqBySplit)

	for _, f := range frequenciesByPrimaryCondition {
		bySplit[f.SplitCode] = append(bySplit[f.SplitCode], f)
	}

	for key, val := range bySplit {
		internalFreq := types.InternalFrequenciesSplitBy{
			SplitValueCode: key,
		}

		for _, af := range val {
			internalFreq.SplitValueName = af.SplitName
			switch af.AffectedStatusCode {
			case "all":
				internalFreq.Frequencies.PcAll = af.Pc
				internalFreq.Frequencies.PnAll = af.Pn
				internalFreq.Frequencies.PfAll = af.Pf
				internalFreq.Frequencies.HomAll = af.Hom
				break
			case "affected":
				internalFreq.Frequencies.PcAffected = af.Pc
				internalFreq.Frequencies.PnAffected = af.Pn
				internalFreq.Frequencies.PfAffected = af.Pf
				internalFreq.Frequencies.HomAffected = af.Hom
				break
			case "non_affected":
				internalFreq.Frequencies.PcNonAffected = af.Pc
				internalFreq.Frequencies.PnNonAffected = af.Pn
				internalFreq.Frequencies.PfNonAffected = af.Pf
				internalFreq.Frequencies.HomNonAffected = af.Hom
				break
			}
		}
		splitRows = append(splitRows, internalFreq)
	}

	sort.Slice(splitRows, func(i, j int) bool {
		return splitRows[i].SplitValueCode < splitRows[j].SplitValueCode
	})

	return &splitRows, nil
}
