package main

import (
	"bytes"
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/repository"
	"github.com/radiant-network/radiant-api/internal/server"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

func assertGetVariantHeader(t *testing.T, data string, locusId int, expected string) {
	testutils.ParallelTestWithDb(t, data, func(t *testing.T, db *gorm.DB) {
		repo := repository.NewVariantsRepository(db)
		router := gin.Default()
		router.GET("/variants/germline/:locus_id/header", server.GetGermlineVariantHeader(repo))

		req, _ := http.NewRequest("GET", fmt.Sprintf("/variants/germline/%d/header", locusId), bytes.NewBuffer([]byte("{}")))
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.JSONEq(t, expected, w.Body.String())
	})
}

func Test_GetVariantHeader(t *testing.T) {
	expected := `{"hgvsg":"hgvsg1", "assembly_version": "GRCh38", "source": ["WGS"]}`
	assertGetVariantHeader(t, "simple", 1000, expected)
}

func assertGetVariantOverview(t *testing.T, data string, locusId int, expected string) {
	testutils.ParallelTestWithPostgresAndStarrocks(t, data, func(t *testing.T, starrocks *gorm.DB, postgres *gorm.DB) {
		repo := repository.NewVariantsRepository(starrocks)
		exomiserRepository := repository.NewExomiserRepository(starrocks)
		pubmedClient := &MockExternalClient{}
		interpretationRepository := repository.NewInterpretationsRepository(postgres, pubmedClient)
		router := gin.Default()
		router.GET("/variants/germline/:locus_id/overview", server.GetGermlineVariantOverview(repo, exomiserRepository, interpretationRepository))

		req, _ := http.NewRequest("GET", fmt.Sprintf("/variants/germline/%d/overview", locusId), bytes.NewBuffer([]byte("{}")))
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.JSONEq(t, expected, w.Body.String())
	})
}

func Test_GetVariantOverview(t *testing.T) {
	expected := `{"aa_change":"p.Arg19His", "cadd_phred":0.1, "cadd_score":0.1, "clinvar": ["Benign", "Pathogenic"], "fathmm_pred":"T", "fathmm_score":0.1, "gnomad_loeuf":0.1, "gnomad_pli":0.1, "gnomad_v3_af":0.001, "interpretation_classification_counts":{"benign":1, "likelyPathogenic":1, "pathogenic":1}, "locus":"locus1", "is_canonical":true, "is_mane_plus":false, "is_mane_select":true, "lrt_pred":"U", "lrt_score":0.01, "omim_conditions": [{"inheritance_code": ["AD"], "panel": "Noonan syndrome 7", "omim_phenotype_id": "613706"}, {"inheritance_code": ["AD"], "panel":"LEOPARD syndrome 3", "omim_phenotype_id":"613707"}], "pc_wgs":3, "pf_wgs":0.99, "picked_consequences":["csq10"], "polyphen2_hvar_pred":"D", "polyphen2_hvar_score":0.991, "revel_score":0.1, "sift_pred":"T", "sift_score":0.1, "spliceai_ds":0.1, "spliceai_type":["AG"], "symbol":"BRAF", "transcript_id":"T001", "vep_impact":"impact1"}`
	assertGetVariantOverview(t, "simple", 1000, expected)
}

func Test_GetVariantOverview_With_ExomiserACMGClassificationCounts(t *testing.T) {
	expected := `{"aa_change":"p.Arg19His", "cadd_phred":0.1, "cadd_score":0.1, "is_canonical":true, "clinvar": ["Benign", "Pathogenic"], "fathmm_pred":"T", "fathmm_score":0.1, "gnomad_loeuf":0.1, "gnomad_pli":0.1, "gnomad_v3_af":0.001, "interpretation_classification_counts":{"benign":1, "likelyPathogenic":1, "pathogenic":1}, "locus":"locus1", "is_mane_plus":false, "is_mane_select":true, "omim_conditions": [{"inheritance_code": ["AD"], "panel": "Noonan syndrome 7", "omim_phenotype_id": "613706"}, {"inheritance_code": ["AD"], "panel":"LEOPARD syndrome 3", "omim_phenotype_id":"613707"}], "pc_wgs":3, "pf_wgs":0.99, "picked_consequences":["csq10"], "revel_score":0.1, "sift_pred":"T", "sift_score":0.1, "spliceai_ds":0.1, "spliceai_type":["AG"], "symbol":"BRAF", "transcript_id":"T001", "vep_impact":"impact1","exomiser_acmg_classification_counts":{"Pathogenic":2,"VUS":1}}`
	assertGetVariantOverview(t, "exomiser", 1000, expected)
}

func assertGetVariantConsequences(t *testing.T, data string, locusId int, expected string) {
	testutils.ParallelTestWithDb(t, data, func(t *testing.T, db *gorm.DB) {
		repo := repository.NewVariantsRepository(db)
		router := gin.Default()
		router.GET("/variants/germline/:locus_id/consequences", server.GetGermlineVariantConsequences(repo))

		req, _ := http.NewRequest("GET", fmt.Sprintf("/variants/germline/%d/consequences", locusId), bytes.NewBuffer([]byte("{}")))
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.JSONEq(t, expected, w.Body.String())
	})
}

func Test_GetVariantConsequences(t *testing.T) {
	expected := `[{"biotype":"IG_C_gene", "gnomad_loeuf":0.1, "gnomad_pli":0.1, "is_picked":true, "spliceai_ds":0.1, "spliceai_type":["AG"], "symbol":"BRAF", "transcripts":[{"cadd_phred":0.1, "cadd_score":0.1, "consequences": ["csq10"], "fathmm_pred":"T", "fathmm_score":0.1, "is_canonical":false, "is_mane_plus":false, "is_mane_select":false, "lrt_pred":"U", "lrt_score":0.01, "polyphen2_hvar_pred":"D", "polyphen2_hvar_score":0.991, "revel_score":0.1, "sift_pred":"T", "sift_score":0.1, "transcript_id":"T001"}]}, {"biotype":"IG_C_pseudogene", "gnomad_loeuf":0.1, "gnomad_pli":0.1, "spliceai_ds":0.2, "spliceai_type":["AT"], "symbol":"BRAC", "is_picked":false, "transcripts":[{"cadd_phred":0.2, "cadd_score":0.2, "consequences": ["csq11"], "fathmm_pred":"T", "fathmm_score":0.2, "is_canonical":false, "is_mane_plus":false, "is_mane_select":false, "lrt_pred":"D", "lrt_score":0.0001, "polyphen2_hvar_pred":"P", "polyphen2_hvar_score":0.859, "revel_score":0.2, "sift_pred":"T", "sift_score":0.2, "transcript_id":"T002"}]}]`
	assertGetVariantConsequences(t, "simple", 1000, expected)
}

func assertGetVariantInterpretedCases(t *testing.T, data string, locusId int, body string, expected string) {
	testutils.ParallelTestWithDb(t, data, func(t *testing.T, db *gorm.DB) {
		repo := repository.NewVariantsRepository(db)
		router := gin.Default()
		router.POST("/variants/germline/:locus_id/cases/interpreted", server.GetGermlineVariantInterpretedCases(repo))

		req, _ := http.NewRequest("POST", fmt.Sprintf("/variants/germline/%d/cases/interpreted", locusId), bytes.NewBuffer([]byte(body)))
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.JSONEq(t, expected, w.Body.String())
	})
}

func Test_GetVariantInterpretedCases(t *testing.T) {
	body := `{
			"search_criteria":[{"field": "condition_term", "value": ["vessel"], "operator": "contains"}]
		}`
	expected := `{
		"list":[
			{
				"affected_status":"affected",
				"analysis_catalog_code":"WGA", 
				"analysis_catalog_name":"Whole Genome Analysis", 
				"case_id":1, 
				"classification":"benign", 
				"condition_id":"MONDO:0000002", 
				"condition_name":"blood vessel neoplasm", 
				"interpretation_updated_on":"2025-06-30T15:51:29Z", 
				"observed_phenotypes":[],
				"patient_id":3,
				"diagnosis_lab_code":"CQGC", 
				"diagnosis_lab_name":"Quebec Clinical Genomic Center", 
				"relationship_to_proband":"proband",
				"seq_id":1, 
				"status_code":"in_progress", 
				"submitter_sample_id":"S13224",
				"transcript_id":"T002", 
				"zygosity":"HET"
			}
		], "count": 1
	}`
	assertGetVariantInterpretedCases(t, "simple", 1000, body, expected)
}
func assertGetVariantUninterpretedCases(t *testing.T, data string, locusId int, body string, expected string) {
	testutils.ParallelTestWithDb(t, data, func(t *testing.T, db *gorm.DB) {
		repo := repository.NewVariantsRepository(db)
		router := gin.Default()
		router.POST("/variants/germline/:locus_id/cases/uninterpreted", server.GetGermlineVariantUninterpretedCases(repo))

		req, _ := http.NewRequest("POST", fmt.Sprintf("/variants/germline/%d/cases/uninterpreted", locusId), bytes.NewBuffer([]byte(body)))
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.JSONEq(t, expected, w.Body.String())
	})
}

func Test_GetVariantUninterpretedCases(t *testing.T) {
	body := `{
			"additional_fields": ["primary_condition_id", "primary_condition_name", "analysis_catalog_code", "analysis_catalog_name",
				"info_qd", "genotype_quality", "ad_alt", "ad_total", "ad_ratio", "sex_name"],
			"search_criteria":[{"field": "transmission_mode", "value": ["autosomal_dominant"]}]
		}`
	expected := `{
		"list": [
			{
				"ad_alt":5, 
				"ad_ratio":0.5, 
				"ad_total":10, 
				"affected_status":"affected", 
				"analysis_catalog_code":"WGA", 
				"analysis_catalog_name":"Whole Genome Analysis", 
				"case_id":4, 
				"diagnosis_lab_code":"CQGC", 
				"diagnosis_lab_name":"Quebec Clinical Genomic Center", 
				"filter_is_pass":true, 
				"genotype_quality":100, 
				"info_qd":0.4, 
				"observed_phenotypes":[
					{"id":"HP:0100622", "name":"Maternal seizure"},
					{"id":"HP:0001562", "name":"Oligohydramnios"}
				], 
				"patient_id":10, 
				"primary_condition_id":"MONDO:0700092", 
				"primary_condition_name":"neurodevelopmental disorder", 
				"relationship_to_proband":"proband", 
				"seq_id":10, 
				"sex_name":"Female", 
				"submitter_sample_id":"S13233", 
				"transmission_mode":"autosomal_dominant", 
				"updated_on":"2021-09-12T13:08:00Z", 
				"zygosity":"HOM"
			}
		],
		"count": 1
	}`
	assertGetVariantUninterpretedCases(t, "simple", 1000, body, expected)
}

func assertGetVariantCasesCount(t *testing.T, data string, locusId int, expected string) {
	testutils.ParallelTestWithDb(t, data, func(t *testing.T, db *gorm.DB) {
		repo := repository.NewVariantsRepository(db)
		router := gin.Default()
		router.GET("/variants/germline/:locus_id/cases/count", server.GetGermlineVariantCasesCount(repo))

		req, _ := http.NewRequest("GET", fmt.Sprintf("/variants/germline/%d/cases/count", locusId), bytes.NewBuffer([]byte("{}")))
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.JSONEq(t, expected, w.Body.String())
	})
}

func Test_GetVariantCasesCount(t *testing.T) {
	expected := `{"count_interpreted":3, "count_uninterpreted":5}`
	assertGetVariantCasesCount(t, "simple", 1000, expected)
}

func assertGetVariantCasesFilters(t *testing.T, data string, expected string) {
	testutils.ParallelTestWithDb(t, data, func(t *testing.T, db *gorm.DB) {
		repo := repository.NewVariantsRepository(db)
		router := gin.Default()
		router.GET("/variants/germline/cases/filters", server.GetGermlineVariantCasesFilters(repo))

		req, _ := http.NewRequest("GET", "/variants/germline/cases/filters", bytes.NewBuffer([]byte("{}")))
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.JSONEq(t, expected, w.Body.String())
	})
}

func Test_GetVariantCasesFilters(t *testing.T) {
	expected := `{
		"analysis_catalog_code":[
			{"count":0, "key":"HYPM", "label":"Malignant Hyperthermia"},
			{"count":0, "key":"IDGD", "label":"Intellectual Deficiency and Global Developmental Delay"},
			{"count":0, "key":"MYOC", "label":"Congenital Myopathies"},
			{"count":0, "key":"WGA", "label":"Whole Genome Analysis"}
		], 
		"classification": [
			{"count": 0, "key":"LA6668-3", "label":"pathogenic"}, 
			{"count": 0, "key":"LA26332-9", "label":"likelyPathogenic"}, 
			{"count": 0, "key":"LA26333-7", "label":"vus"}, 
			{"count": 0, "key":"LA26334-5", "label":"likelyBenign"}, 
			{"count": 0, "key":"LA6675-8", "label":"benign"} 
		],
		"diagnosis_lab_code":[
			{"count":0, "key":"LDM-CHOP", "label":"Molecular Diagnostic Laboratory, CHOP"},
			{"count":0, "key":"LDM-CHUSJ", "label":"Laboratoire de diagnostic moléculaire, CHU Sainte-Justine"}			
		]
	}`
	assertGetVariantCasesFilters(t, "simple", expected)
}

func assertGetGermlineVariantConditions(t *testing.T, data string, locusId int, panelType string, filter string, expected string) {
	testutils.ParallelTestWithDb(t, data, func(t *testing.T, db *gorm.DB) {
		repo := repository.NewGenePanelsRepository(db)
		router := gin.Default()
		router.GET("/variants/germline/:locus_id/conditions/:panel_type", server.GetGermlineVariantConditions(repo))

		filterParam := ""

		if len(filter) > 0 {
			filterParam = fmt.Sprintf("?filter=%s", filter)
		}

		req, _ := http.NewRequest("GET", fmt.Sprintf("/variants/germline/%d/conditions/%s%s", locusId, panelType, filterParam), bytes.NewBuffer([]byte("{}")))
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.JSONEq(t, expected, w.Body.String())
	})
}

func Test_GetGermlineVariantConditions_Omim(t *testing.T) {
	expected := `{
		"count_hpo": 3,
		"count_omim":2,
		"count_orphanet": 2,
		"conditions": {
			"BRAF": [
				{"inheritance_code":["AD"], "panel_id":"1111", "panel_name":"panel1"},
				{"inheritance_code":["Smu"], "panel_id":"3333", "panel_name":"panel2"}
			]
		}
	}`
	assertGetGermlineVariantConditions(t, "gene_panels", 1000, "omim", "", expected)
}

func Test_GetGermlineVariantConditions_Hpo(t *testing.T) {
	expected := `{
		"count_hpo": 3,
		"count_omim":2,
		"count_orphanet": 2,
		"conditions": {
			"BRAF": [
				{"panel_id":"HP:0001061", "panel_name":"Acne"}, 
				{"panel_id":"HP:0001156", "panel_name":"Brachydactyly"}, 
				{"panel_id":"HP:0000286", "panel_name":"Epicanthus"}
			]
		}
	}`
	assertGetGermlineVariantConditions(t, "gene_panels", 1000, "hpo", "", expected)
}

func Test_GetGermlineVariantConditions_Hpo_WithFilter(t *testing.T) {
	expected := `{
		"count_hpo": 1,
		"count_omim":0,
		"count_orphanet": 0, 
		"conditions": {
			"BRAF": [
				{"panel_id":"HP:0000286", "panel_name":"Epicanthus"}
			]
		}
	}`
	assertGetGermlineVariantConditions(t, "gene_panels", 1000, "hpo", "Canthus", expected)
}

func Test_GetGermlineVariantConditions_Orphanet(t *testing.T) {
	expected := `{
		"count_hpo": 3,
		"count_omim":2,
		"count_orphanet": 2,
		"conditions": {
			"BRAF": [
				{"inheritance_code":["AD"], "panel_id":"1111", "panel_name":"panel1"},
				{"inheritance_code":["Smu"], "panel_id":"3333", "panel_name":"panel2"}
			]
		}
	}`
	assertGetGermlineVariantConditions(t, "gene_panels", 1000, "orphanet", "", expected)
}

func Test_GetGermlineVariantConditions_Clinvar(t *testing.T) {
	testutils.ParallelTestWithDb(t, "clinvar", func(t *testing.T, db *gorm.DB) {
		repo := repository.NewClinvarRCVRepository(db)
		router := gin.Default()
		router.GET("/variants/germline/:locus_id/conditions/clinvar", server.GetGermlineVariantConditionsClinvar(repo))

		req, _ := http.NewRequest("GET", fmt.Sprintf("/variants/germline/%d/conditions/clinvar", 1000), bytes.NewBuffer([]byte("{}")))
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		expected := `[{"locus_id":"1000","clinvar_id":"123456","accession":"RCV000001","clinical_significance":["Pathogenic"],"date_last_evaluated":"2025-01-01T00:00:00Z","submission_count":1,"review_status":"criteria_provided","review_status_stars":4,"version":1,"traits":["Trait1","Trait2"]},{"locus_id":"1000","clinvar_id":"123457","accession":"RCV000002","clinical_significance":["Likely Pathogenic"],"date_last_evaluated":"2025-01-01T00:00:00Z","submission_count":3,"review_status":"criteria_provided","review_status_stars":3,"version":2,"traits":["Trait3"]}]`
		assert.Equal(t, http.StatusOK, w.Code)
		assert.JSONEq(t, expected, w.Body.String())
	})
}

func assertGetGermlineVariantExternalFrequencies(t *testing.T, data string, locusId int, expected string) {
	testutils.ParallelTestWithPostgresAndStarrocks(t, data, func(t *testing.T, starrocks *gorm.DB, postgres *gorm.DB) {
		repo := repository.NewVariantsRepository(starrocks)
		router := gin.Default()
		router.GET("/variants/germline/:locus_id/external_frequencies", server.GetGermlineVariantExternalFrequenciesHandler(repo))

		req, _ := http.NewRequest("GET", fmt.Sprintf("/variants/germline/%d/external_frequencies", locusId), bytes.NewBuffer([]byte("{}")))
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.JSONEq(t, expected, w.Body.String())
	})
}

func Test_GetGermlineVariantExternalFrequenciesHandler(t *testing.T) {
	expected := `{
		"external_frequencies":[
			{"ac":1, "af":0.001, "an":1000, "cohort":"topmed_bravo", "hom":0}, 
			{"ac":1, "af":0.01, "an":100, "cohort":"gnomad_genomes_v3", "hom":0}, 
			{"ac":1, "af":0.0001, "an":10000, "cohort":"1000_genomes"}
		], 
		"locus":"locus1"
	}`
	assertGetGermlineVariantExternalFrequencies(t, "simple", 1000, expected)
}

func assertGetGermlineVariantGlobalInternalFrequencies(t *testing.T, data string, locusId int, status int, expected string) {
	testutils.ParallelTestWithPostgresAndStarrocks(t, data, func(t *testing.T, starrocks *gorm.DB, postgres *gorm.DB) {
		repo := repository.NewVariantsRepository(starrocks)
		router := gin.Default()
		router.GET("/variants/germline/:locus_id/internal_frequencies/global", server.GetGermlineVariantGlobalInternalFrequenciesHandler(repo))

		req, _ := http.NewRequest("GET", fmt.Sprintf("/variants/germline/%d/internal_frequencies/global", locusId), bytes.NewBuffer([]byte("{}")))
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, status, w.Code)
		assert.JSONEq(t, expected, w.Body.String())
	})
}

func Test_GetGermlineVariantGlobalInternalFrequenciesHandler(t *testing.T) {
	expected := `{
		"pc_all": 3, "pf_all": 0.99, "pc_affected": 3, "pn_affected": 3, "pf_affected": 1.0, "pc_non_affected": 0, "pn_non_affected": 0, "pf_non_affected": 0.0
	}`
	assertGetGermlineVariantGlobalInternalFrequencies(t, "simple", 1000, http.StatusOK, expected)
}

func Test_GetGermlineVariantGlobalInternalFrequenciesHandler_NotFound(t *testing.T) {
	expected := `{
		"status": 404,
		"message": "variant not found"
	}`
	assertGetGermlineVariantGlobalInternalFrequencies(t, "simple", 4242, http.StatusNotFound, expected)
}

func assertGetGermlineVariantInternalFrequencies(t *testing.T, data string, locusId int, split string, status int, expected string) {
	testutils.ParallelTestWithPostgresAndStarrocks(t, data, func(t *testing.T, starrocks *gorm.DB, postgres *gorm.DB) {
		repo := repository.NewVariantsRepository(starrocks)
		router := gin.Default()
		router.GET("/variants/germline/:locus_id/internal_frequencies", server.GetGermlineVariantInternalFrequenciesHandler(repo))

		req, _ := http.NewRequest("GET", fmt.Sprintf("/variants/germline/%d/internal_frequencies?split=%s", locusId, split), bytes.NewBuffer([]byte("{}")))
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, status, w.Code)
		assert.JSONEq(t, expected, w.Body.String())
	})
}

func Test_GetGermlineVariantInternalFrequenciesHandler_SplitByProject(t *testing.T) {
	expected := `{
		"split_rows":[
			{"split_value_code":"N1", "split_value_name": "NeuroDev Phase I", "frequencies":{"pc_all": 5, "pn_all": 5, "pf_all": 1.0, "hom_all": 2, "pc_affected": 4, "pn_affected": 4, "pf_affected": 1.0, "hom_affected": 1, "pc_non_affected": 1, "pn_non_affected": 1, "pf_non_affected": 1.0, "hom_non_affected": 1}}, 
			{"split_value_code":"N2", "split_value_name": "NeuroDev Phase II", "frequencies":{"pc_all": 1, "pn_all": 2, "pf_all": 0.5, "hom_all": 0, "pc_affected": 1, "pn_affected": 1, "pf_affected": 1.0, "hom_affected": 0, "pc_non_affected": 0, "pn_non_affected": 1, "pf_non_affected": 0.0, "hom_non_affected": 0}}
		] 
	}`
	assertGetGermlineVariantInternalFrequencies(t, "simple", 1000, types.SPLIT_BY_PROJECT, http.StatusOK, expected)
}

func Test_GetGermlineVariantInternalFrequenciesHandler_SplitByPrimaryCondition(t *testing.T) {
	expected := `{
		"split_rows":[
			{"split_value_code":"MONDO:0000003", "split_value_name": "colorblindness, partial", "frequencies":{"pc_all": 1, "pn_all": 1, "pf_all": 1.0, "hom_all": 0, "pc_affected": 1, "pn_affected": 1, "pf_affected": 1.0, "hom_affected": 0}}, 
			{"split_value_code":"MONDO:0700092", "split_value_name": "neurodevelopmental disorder", "frequencies":{"pc_all": 5, "pn_all": 6, "pf_all": 0.8333333333333334, "hom_all": 2, "pc_affected": 4, "pn_affected": 4, "pf_affected": 1.0, "hom_affected": 1, "pc_non_affected": 1, "pn_non_affected": 2, "pf_non_affected": 0.5, "hom_non_affected": 1}}
		] 
	}`
	assertGetGermlineVariantInternalFrequencies(t, "simple", 1000, types.SPLIT_BY_PRIMARY_CONDITION, http.StatusOK, expected)
}

func Test_GetGermlineVariantInternalFrequenciesHandler_SplitByAnalysis(t *testing.T) {
	expected := `{
		"split_rows":[
			{"split_value_code":"IDGD", "split_value_name": "Intellectual Deficiency and Global Developmental Delay", "frequencies":{"pc_all": 1, "pn_all": 1, "pf_all": 1.0, "hom_all": 0, "pc_affected": 1, "pn_affected": 1, "pf_affected": 1.0, "hom_affected": 0}}, 
			{"split_value_code":"WGA", "split_value_name": "Whole Genome Analysis", "frequencies":{"pc_all": 5, "pn_all": 6, "pf_all": 0.8333333333333334, "hom_all": 2, "pc_affected": 4, "pn_affected": 4, "pf_affected": 1.0, "hom_affected": 1, "pc_non_affected": 1, "pn_non_affected": 2, "pf_non_affected": 0.5, "hom_non_affected": 1}}
		] 
	}`
	assertGetGermlineVariantInternalFrequencies(t, "simple", 1000, types.SPLIT_BY_ANALYSIS, http.StatusOK, expected)
}

func Test_GetGermlineVariantInternalFrequenciesHandler_BadSplit(t *testing.T) {
	expected := `{
		"status": 400,
		"message": "incorrect split"
	}`
	assertGetGermlineVariantInternalFrequencies(t, "simple", 1000, "incorrect", http.StatusBadRequest, expected)
}
