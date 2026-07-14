package repository

import (
	"context"
	"errors"
	"fmt"
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
type VariantCasesFilters = types.VariantCasesFilters
type VariantCasesCount = types.VariantCasesCount
type VariantExternalFrequencies = types.VariantExternalFrequencies
type VariantInternalFrequencies = types.VariantInternalFrequencies

type VariantsRepository struct {
	db *gorm.DB
}

func NewVariantsRepository(db *gorm.DB) *VariantsRepository {
	return &VariantsRepository{db: db}
}

func (r *VariantsRepository) GetVariantHeader(ctx context.Context, locusId int) (*VariantHeader, error) {
	tx := r.db.WithContext(ctx).Table(fmt.Sprintf("%s %s", types.VariantTable.TenantQualifiedName(ctx), types.VariantTable.Alias))
	tx = tx.Where("v.locus_id = ?", locusId)
	tx = tx.Select("v.hgvsg")

	var variantHeader VariantHeader
	if err := tx.Take(&variantHeader).Error; err != nil {
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

func (r *VariantsRepository) GetVariantOverview(ctx context.Context, locusId int) (*VariantOverview, error) {
	db := r.db.WithContext(ctx)
	tx := db.Table(fmt.Sprintf("%s %s", types.VariantTable.TenantQualifiedName(ctx), types.VariantTable.Alias))
	tx = tx.Joins(fmt.Sprintf("JOIN %s c ON v.locus_id=c.locus_id AND v.locus_id = ? AND c.is_picked = true", types.ConsequenceTable.TenantQualifiedName(ctx)), locusId)
	tx = tx.Joins(fmt.Sprintf("LEFT JOIN %s cl ON cl.locus_id = v.locus_id", types.Table{Name: "clinvar"}.TenantQualifiedName(ctx)))
	tx = tx.Select("v.symbol, v.consequences, v.clinvar_interpretation, v.clinvar_name, v.germline_pc_wgs, v.germline_pf_wgs, v.germline_pn_wgs, v.gnomad_v3_af, v.is_canonical, v.is_mane_select, c.is_mane_plus, c.exon_rank, c.exon_total, c.transcript_id, c.dna_change, v.rsnumber, v.vep_impact, v.aa_change, c.consequences, c.sift_pred, c.sift_score, c.revel_score,c.gnomad_loeuf, c.spliceai_ds, c.spliceai_type, v.locus, c.fathmm_pred, c.fathmm_score, c.cadd_phred, c.cadd_score, c.dann_score, c.lrt_pred, c.lrt_score, c.polyphen2_hvar_pred, c.polyphen2_hvar_score, c.phyloP17way_primate, c.gnomad_pli, cl.name as clinvar_id")

	var variantOverview VariantOverview
	if err := tx.Take(&variantOverview).Error; err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("error while fetching variant overview: %w", err)
		} else {
			return nil, nil
		}
	}

	txOmim := db.Table(fmt.Sprintf("%s omim", types.OmimGenePanelTable.TenantQualifiedName(ctx)))
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

func (r *VariantsRepository) GetVariantConsequences(ctx context.Context, locusId int) (*[]VariantConsequence, error) {
	tx := r.db.WithContext(ctx).Table(fmt.Sprintf("%s %s", types.ConsequenceTable.TenantQualifiedName(ctx), types.ConsequenceTable.Alias))
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

func (r *VariantsRepository) GetVariantInterpretedCases(ctx context.Context, locusId int, userQuery types.ListQuery) (*[]VariantInterpretedCase, *int64, error) {
	var count int64

	db := r.db.WithContext(ctx)
	schema := types.TenantSchema(ctx)
	txAggPhenotypes := utils.GetAggregatedPhenotypes(db)

	tx := db.Table(fmt.Sprintf("%s %s", types.InterpretationGermlineTable.In(schema), types.InterpretationGermlineTable.Alias))
	tx = utils.JoinGermlineInterpretationWithSNVOccurrence(tx)
	// interpretation_germline has no task_id column, so the snv↔interpretation
	// join above is on (seq_id, locus_id) alone. Bridge through task_context to
	// scope the snv occurrence to the interpretation's case — otherwise an
	// occurrence at the same seq_id but produced by another case's annotation
	// task would leak into this case's interpreted results.
	tx = tx.Joins(fmt.Sprintf("INNER JOIN %s.task_context tctx ON tctx.task_id = g_snv_o.task_id AND tctx.sequencing_experiment_id = g_snv_o.seq_id AND tctx.case_id = ig.case_id", schema))
	tx = tx.Joins(fmt.Sprintf("INNER JOIN %s.sequencing_experiment s ON s.id = g_snv_o.seq_id", schema))
	tx = utils.JoinGermlineInterpretationWithCase(tx)
	tx = utils.JoinSeqExpWithSample(tx)
	tx = utils.JoinSampleAndCaseWithFamily(tx)
	tx = utils.JoinCaseWithAnalysisCatalog(tx)
	tx = utils.JoinCaseWithDiagnosisLab(tx)
	tx = tx.Joins(fmt.Sprintf("LEFT JOIN %s mondo ON mondo.id = ig.condition", types.MondoTable.TenantQualifiedName(ctx)))
	tx = tx.Joins("LEFT JOIN (?) agg_phenotypes ON agg_phenotypes.case_id = c.id AND agg_phenotypes.patient_id = spl.patient_id", txAggPhenotypes)

	tx = tx.Where("g_snv_o.locus_id = ?", locusId)
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
		"ig.classification as classification_code, g_snv_o.zygosity, lab.code as diagnosis_lab_code, lab.name as diagnosis_lab_name, " +
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

func (r *VariantsRepository) GetVariantUninterpretedCases(ctx context.Context, locusId int, userQuery types.ListQuery) (*[]VariantUninterpretedCase, *int64, error) {
	var count int64
	if userQuery != nil && userQuery.HasFieldFromTables(types.InterpretationGermlineTable) {
		count = 0
		return &[]VariantUninterpretedCase{}, &count, nil
	}

	db := r.db.WithContext(ctx)
	schema := types.TenantSchema(ctx)
	txAggPhenotypes := utils.GetAggregatedPhenotypes(db)

	// interpretation_germline.locus_id is text, so this ANTI JOIN compares strings; g_snv_o.locus_id is int and uses locusId directly.
	locusIdString := fmt.Sprintf("%d", locusId)

	// Drive from task_context — for germline SNV, each (case, seq) pair is
	// reached via its annotation task (case-scoped row, case_id NOT NULL).
	// Joining the occurrence on (seq_id, task_id) prevents leaking occurrences
	// across cases that share a sequencing experiment.
	tx := db.Table(fmt.Sprintf("%s %s", types.TaskContextTable.In(schema), types.TaskContextTable.Alias))
	tx = tx.Joins(fmt.Sprintf("INNER JOIN %s g_snv_o ON g_snv_o.seq_id = tctx.sequencing_experiment_id AND g_snv_o.task_id = tctx.task_id", types.GermlineSNVOccurrenceTable.TenantQualifiedName(ctx)))
	tx = tx.Joins(fmt.Sprintf("INNER JOIN %s.cases c ON c.id = tctx.case_id", schema))
	tx = tx.Joins(fmt.Sprintf("INNER JOIN %s.sequencing_experiment s ON s.id = tctx.sequencing_experiment_id", schema))
	tx = utils.JoinCaseWithAnalysisCatalog(tx)
	tx = utils.JoinCaseWithDiagnosisLab(tx)
	tx = utils.JoinSeqExpWithSample(tx)
	tx = tx.Joins(fmt.Sprintf("LEFT JOIN %s.family f ON f.family_member_id = spl.patient_id AND f.case_id = tctx.case_id", schema))

	if userQuery != nil && userQuery.HasFieldFromTables(types.PatientTable) {
		tx = utils.JoinFamilyWithPatient(tx)
	}

	tx = tx.Joins(fmt.Sprintf("LEFT JOIN %s mondo ON mondo.id = c.primary_condition", types.MondoTable.TenantQualifiedName(ctx)))
	tx = tx.Joins(fmt.Sprintf("LEFT ANTI JOIN %s.interpretation_germline ig ON ig.locus_id = ? AND ig.sequencing_id = tctx.sequencing_experiment_id AND ig.case_id = tctx.case_id", schema), locusIdString)
	tx = tx.Joins("LEFT JOIN (?) agg_phenotypes ON agg_phenotypes.case_id = c.id AND agg_phenotypes.patient_id = spl.patient_id", txAggPhenotypes)
	tx = tx.Where("g_snv_o.locus_id = ?", locusId)

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

func (r *VariantsRepository) GetVariantCasesCount(ctx context.Context, locusId int) (*VariantCasesCount, error) {
	var countInterpreted int64
	var countUnInterpreted int64

	db := r.db.WithContext(ctx)
	schema := types.TenantSchema(ctx)
	occurrence := types.GermlineSNVOccurrenceTable.TenantQualifiedName(ctx)
	locusIdString := fmt.Sprintf("%d", locusId)

	// Count distinct (case_id, seq_id, task_id) triples that have an
	// interpretation at this locus. interpretation_germline has no task_id, so
	// bridge through germline_snv_occurrence + task_context to recover it.
	txInterpreted := db.Raw(fmt.Sprintf(`
		SELECT COUNT(DISTINCT CONCAT(tctx.case_id, '-', tctx.sequencing_experiment_id, '-', tctx.task_id))
		FROM %s.interpretation_germline ig
		INNER JOIN %s g_snv_o
		    ON g_snv_o.seq_id = ig.sequencing_id
		   AND g_snv_o.locus_id = ig.locus_id
		INNER JOIN %s.task_context tctx
		    ON tctx.task_id = g_snv_o.task_id
		   AND tctx.sequencing_experiment_id = g_snv_o.seq_id
		   AND tctx.case_id = ig.case_id
		WHERE g_snv_o.locus_id = ?`, schema, occurrence, schema), locusId)

	if err := txInterpreted.Scan(&countInterpreted).Error; err != nil {
		return nil, fmt.Errorf("error counting variant interpreted cases: %w", err)
	}

	// Count distinct (case_id, seq_id, task_id) triples that have an occurrence
	// at this locus and no interpretation. Driving from task_context (instead
	// of case_has_sequencing_experiment) ensures the occurrence is attributed
	// only to the case whose annotation task produced it — preventing a leak
	// when a sequencing experiment is reused across multiple cases.
	txUnInterpreted := db.Raw(fmt.Sprintf(`
		SELECT COUNT(DISTINCT CONCAT(tctx.case_id, '-', tctx.sequencing_experiment_id, '-', tctx.task_id))
		FROM %s.task_context tctx
		INNER JOIN %s g_snv_o
		    ON g_snv_o.seq_id = tctx.sequencing_experiment_id
		   AND g_snv_o.task_id = tctx.task_id
		LEFT ANTI JOIN %s.interpretation_germline ig
		    ON ig.locus_id = ?
		   AND ig.sequencing_id = tctx.sequencing_experiment_id
		   AND ig.case_id = tctx.case_id
		WHERE g_snv_o.locus_id = ?`, schema, occurrence, schema), locusIdString, locusId)

	if err := txUnInterpreted.Scan(&countUnInterpreted).Error; err != nil {
		return nil, fmt.Errorf("error counting variant interpreted cases: %w", err)
	}

	return &VariantCasesCount{
		CountInterpreted:   countInterpreted,
		CountUninterpreted: countUnInterpreted,
	}, nil
}

func (r *VariantsRepository) GetVariantCasesFilters(ctx context.Context) (*VariantCasesFilters, error) {
	db := r.db.WithContext(ctx)
	analysisCatalog, err := utils.GetFilter(db, types.AnalysisCatalogTable, "name", nil)
	if err != nil {
		return nil, err
	}

	isDiagnosisLabCondition := fmt.Sprintf("%s.category_code = 'diagnostic_laboratory'", types.SequencingLabTable.Alias)
	diagnosisLab, err := utils.GetFilter(db, types.SequencingLabTable, "name", &isDiagnosisLabCondition)
	if err != nil {
		return nil, err
	}

	sex, err := utils.GetFilter(db, types.SexTable, "name_en", nil)
	if err != nil {
		return nil, err
	}

	zygosity := []types.FiltersValue{
		{Key: "HOM"},
		{Key: "HET"},
		{Key: "HEM"},
		{Key: "UNK"},
	}

	transmissionMode := []types.FiltersValue{
		{Key: "autosomal_dominant_de_novo"},
		{Key: "autosomal_dominant"},
		{Key: "autosomal_recessive"},
		{Key: "x_linked_dominant_de_novo"},
		{Key: "x_linked_recessive_de_novo"},
		{Key: "x_linked_dominant"},
		{Key: "x_linked_recessive"},
		{Key: "non_carrier_proband"},
		{Key: "unknown_parents_genotype"},
		{Key: "unknown_father_genotype"},
		{Key: "unknown_mother_genotype"},
		{Key: "unknown_proband_genotype"},
	}

	return &VariantCasesFilters{
		Classification:   types.MapToFiltersValueArray(),
		AnalysisCatalog:  analysisCatalog,
		DiagnosisLab:     diagnosisLab,
		Sex:              sex,
		Zygosity:         zygosity,
		TransmissionMode: transmissionMode,
	}, nil
}

func (r *VariantsRepository) GetVariantExternalFrequencies(ctx context.Context, locusId int) (*VariantExternalFrequencies, error) {
	var topmed types.ExternalFrequencies
	var gnomadV3 types.ExternalFrequencies
	var thousandGenomes types.ExternalFrequencies
	var result types.VariantExternalFrequencies

	tx := r.db.WithContext(ctx).Table(fmt.Sprintf("%s v", types.VariantTable.TenantQualifiedName(ctx)))
	tx = tx.Joins(fmt.Sprintf("LEFT JOIN %s topmed ON topmed.locus_id = v.locus_id", types.TopmedTable.TenantQualifiedName(ctx)))
	tx = tx.Joins(fmt.Sprintf("LEFT JOIN %s gnomad ON gnomad.locus_id = v.locus_id", types.GnomadGenomesV3Table.TenantQualifiedName(ctx)))
	tx = tx.Joins(fmt.Sprintf("LEFT JOIN %s thousand ON thousand.locus_id = v.locus_id", types.ThousandGenomesTable.TenantQualifiedName(ctx)))
	tx = tx.Where("v.locus_id = ?", locusId)
	tx = tx.Select("v.locus, " +
		"topmed.af as topmed_af, topmed.ac as topmed_ac, topmed.an as topmed_an, topmed.hom as topmed_hom, " +
		"gnomad.af as gnomad_v3_af, gnomad.ac as gnomad_v3_ac, gnomad.an as gnomad_v3_an, gnomad.hom as gnomad_v3_hom, " +
		"thousand.af as thousand_genomes_af, thousand.ac as thousand_genomes_ac, thousand.an as thousand_genomes_an")

	if err := tx.Take(&result).Error; err != nil {
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

func (r *VariantsRepository) GetGermlineVariantGlobalInternalFrequencies(ctx context.Context, locusId int) (*types.InternalFrequencies, error) {
	var globalFrequencies types.InternalFrequencies

	tx := r.db.WithContext(ctx).Table(fmt.Sprintf("%s v", types.VariantTable.TenantQualifiedName(ctx)))
	tx = tx.Select("v.germline_pc_wgs as pc_all, v.germline_pn_wgs as pn_all, v.germline_pf_wgs as pf_all, v.germline_pc_wgs_affected as pc_affected, v.germline_pn_wgs_affected as pn_affected, v.germline_pf_wgs_affected as pf_affected, v.germline_pc_wgs_not_affected as pc_non_affected, v.germline_pn_wgs_not_affected as pn_non_affected, v.germline_pf_wgs_not_affected as pf_non_affected")
	tx = tx.Where("v.locus_id = ?", locusId)

	if err := tx.Take(&globalFrequencies).Error; err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("error fetching global internal frequencies: %w", err)
		} else {
			return nil, nil
		}
	}

	return &globalFrequencies, nil
}

func (r *VariantsRepository) GetGermlineVariantInternalFrequenciesSplitBy(ctx context.Context, locusId int, splitType types.SplitType) (*[]types.InternalFrequenciesSplitBy, error) {
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

	schema := types.TenantSchema(ctx)
	stagingSeq := types.SequencingTable.TenantQualifiedName(ctx)
	occurrence := types.GermlineSNVOccurrenceTable.TenantQualifiedName(ctx)

	switch splitType {
	case types.SPLIT_BY_PROJECT:
		splitCodeColumn = "p.code"
		splitNameColumn = "p.name"
		joinToRetrieveSplitCode = fmt.Sprintf("JOIN %s.project p ON p.id = c.project_id", schema)
		joinToRetrieveSplitName = fmt.Sprintf("JOIN %s.project p ON p.code = split_code", schema)
	case types.SPLIT_BY_PRIMARY_CONDITION:
		splitCodeColumn = "c.primary_condition"
		splitNameColumn = "m.name"
		joinToRetrieveSplitCode = ""
		joinToRetrieveSplitName = fmt.Sprintf("JOIN %s m on m.id = split_code", types.MondoTable.TenantQualifiedName(ctx))
	case types.SPLIT_BY_ANALYSIS:
		splitCodeColumn = "ac.code"
		splitNameColumn = "ac.name"
		joinToRetrieveSplitCode = fmt.Sprintf("JOIN %s.analysis_catalog ac ON ac.id = c.analysis_catalog_id", schema)
		joinToRetrieveSplitName = fmt.Sprintf("JOIN %s.analysis_catalog ac ON ac.code = split_code", schema)
	default:
		return nil, fmt.Errorf("unsupported split type")
	}

	tx := r.db.WithContext(ctx).Raw(fmt.Sprintf(`
		WITH
			base AS (
				SELECT
					%s as split_code,
					seq.patient_id,
					seq.affected_status as affected_status_code,
					g_snv_o.zygosity
				FROM %s.cases c
				%s
				LEFT JOIN %s.case_has_sequencing_experiment chse ON chse.case_id = c.id
				JOIN %s seq ON seq.seq_id = chse.sequencing_experiment_id AND seq.case_id = chse.case_id AND seq.experimental_strategy = 'wgs' AND analysis_type = 'germline'
				LEFT JOIN %s g_snv_o ON g_snv_o.seq_id = seq.seq_id AND g_snv_o.locus_id = ? AND g_snv_o.gq >= 20 AND g_snv_o.filter = 'PASS' AND g_snv_o.ad_alt > 3
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
		ORDER BY split_code;`, splitCodeColumn, schema, joinToRetrieveSplitCode, schema, stagingSeq, occurrence, splitNameColumn, joinToRetrieveSplitName), locusId)

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
			case "affected":
				internalFreq.Frequencies.PcAffected = af.Pc
				internalFreq.Frequencies.PnAffected = af.Pn
				internalFreq.Frequencies.PfAffected = af.Pf
				internalFreq.Frequencies.HomAffected = af.Hom
			case "non_affected":
				internalFreq.Frequencies.PcNonAffected = af.Pc
				internalFreq.Frequencies.PnNonAffected = af.Pn
				internalFreq.Frequencies.PfNonAffected = af.Pf
				internalFreq.Frequencies.HomNonAffected = af.Hom
			}
		}
		splitRows = append(splitRows, internalFreq)
	}

	sort.Slice(splitRows, func(i, j int) bool {
		return splitRows[i].SplitValueCode < splitRows[j].SplitValueCode
	})

	return &splitRows, nil
}
