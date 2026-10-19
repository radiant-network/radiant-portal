package main

import (
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/report"
	"github.com/radiant-network/radiant-api/internal/repository/postgres"
	"github.com/radiant-network/radiant-api/internal/repository/starrocks"
	"github.com/radiant-network/radiant-api/internal/server"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
)

func getGermlineTranscriptReport(t *testing.T, caseId int, seqId int, taskId int, locusId int, assertResponse func(w *httptest.ResponseRecorder)) {
	testutils.RunTest(t, testutils.Need{Starrocks: "transcript_report", Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repoTranscriptReport := starrocks.NewTranscriptReportRepository(database.StarrocksDB{DB: env.Starrocks})
		repoInterpretations := postgres.NewInterpretationsRepository(database.PostgresDB{DB: env.Postgres}, &MockExternalClient{})
		builder := report.NewGermlineBuilder(repoTranscriptReport, repoInterpretations)
		router := tenantRouter()
		router.GET("/:tenant/occurrences/germline/snv/:case_id/:seq_id/:task_id/:locus_id/report", server.GetGermlineSNVTranscriptReport(builder))

		req, _ := http.NewRequest("GET", fmt.Sprintf("/radiant/occurrences/germline/snv/%d/%d/%d/%d/report", caseId, seqId, taskId, locusId), nil)
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)
		assertResponse(w)
	})
}

func Test_GetGermlineSNVTranscriptReport_Integration(t *testing.T) {
	getGermlineTranscriptReport(t, 1, 1, 5, 1000, func(w *httptest.ResponseRecorder) {
		assert.Equal(t, http.StatusOK, w.Code)
		assert.JSONEq(t, `{
			"case": {"case_id": 1, "seq_id": 1, "task_id": 5, "submitter_patient_id": "MRN-283775", "submitter_sample_id": "S13224", "is_proband": true, "genome_build": "GRch38"},
			"variant": {
				"locus_id": "1000", "hgvsg": "chr7:g.140753336A>T", "rsnumber": "rs113488022", "chromosome": "7", "start": 140753336,
				"reference": "A", "alternate": "T", "symbol": "BRAF", "clinvar_id": "13961", "clinvar_interpretation": ["Pathogenic", "Likely_pathogenic"],
				"gnomad": {"af": 0.0000123, "ac": 2, "an": 152000, "hom": 0}
			},
			"occurrence": {"zygosity": "HET", "parental_origin": "mother", "father_zygosity": "WT", "mother_zygosity": "HET", "transmission_mode": "autosomal_dominant", "ad_ratio": 0.5, "ad_alt": 10, "ad_total": 20},
			"genes": [
				{"symbol": "BRAF", "omim": [
					{"phenotype_id": "613706", "name": "Noonan syndrome 7", "inheritance_code": ["AD"]},
					{"phenotype_id": "613707", "name": "LEOPARD syndrome 3", "inheritance_code": ["AD"]}
				]},
				{"symbol": "LINC01", "omim": []}
			],
			"transcripts": [
				{"transcript_id": "ENST00000646891", "source": "Ensembl", "version": "6", "symbol": "BRAF", "is_mane_select": true, "is_mane_plus": false, "is_canonical": true, "refseq_ids": ["NM_004333.6"], "dna_change": "c.1799T>A", "aa_change": "p.Val600Glu", "exon_rank": "15", "exon_total": "18", "revel_score": 0.931, "cadd_phred": 32, "consequences": ["missense_variant"], "vep_impact": "MODERATE"},
				{"transcript_id": "ENST00000288602", "source": "Ensembl", "version": "11", "symbol": "BRAF", "is_mane_select": false, "is_mane_plus": false, "is_canonical": false, "dna_change": "c.1799T>A", "aa_change": "p.Val600Glu", "exon_rank": "15", "exon_total": "18", "consequences": ["missense_variant"], "vep_impact": "MODERATE"},
				{"transcript_id": "T001", "symbol": "BRAF", "is_mane_select": false, "is_mane_plus": false, "is_canonical": false, "consequences": ["intron_variant"], "vep_impact": "MODIFIER",
				 "interpretation": {"classification": "LA6668-3", "classification_criterias": ["PM1"], "condition": "MONDO:0000001", "transmission_modes": ["autosomal_dominant_de_novo"]}},
				{"transcript_id": "NR_027010", "source": "RefSeq", "version": "2", "symbol": "LINC01", "is_mane_select": false, "is_mane_plus": false, "is_canonical": false, "refseq_ids": ["NR_027010.2"], "dna_change": "n.100T>A", "consequences": ["non_coding_transcript_exon_variant"], "vep_impact": "MODIFIER"}
			]
		}`, w.Body.String())
	})
}

func Test_GetGermlineSNVTranscriptReport_Integration_Intergenic(t *testing.T) {
	getGermlineTranscriptReport(t, 1, 1, 5, 2000, func(w *httptest.ResponseRecorder) {
		assert.Equal(t, http.StatusOK, w.Code)
		assert.JSONEq(t, `{
			"case": {"case_id": 1, "seq_id": 1, "task_id": 5, "submitter_patient_id": "MRN-283775", "submitter_sample_id": "S13224", "is_proband": true, "genome_build": "GRch38"},
			"variant": {"locus_id": "2000", "hgvsg": "chr1:g.1000A>G", "chromosome": "1", "start": 1000, "reference": "A", "alternate": "G"},
			"occurrence": {"zygosity": "HOM", "parental_origin": "denovo", "father_zygosity": "WT", "mother_zygosity": "WT", "transmission_mode": "autosomal_dominant_de_novo", "ad_ratio": 1, "ad_alt": 30, "ad_total": 30},
			"genes": [],
			"transcripts": []
		}`, w.Body.String())
	})
}

func Test_GetGermlineSNVTranscriptReport_Integration_OtherTask_NotFound(t *testing.T) {
	getGermlineTranscriptReport(t, 1, 1, 5, 3000, func(w *httptest.ResponseRecorder) {
		assert.Equal(t, http.StatusNotFound, w.Code)
		assert.JSONEq(t, `{"status":404, "message":"occurrence not found"}`, w.Body.String())
	})
}

func Test_GetGermlineSNVTranscriptReport_Integration_TaskNotOfCase_NotFound(t *testing.T) {
	getGermlineTranscriptReport(t, 1, 1, 77, 1000, func(w *httptest.ResponseRecorder) {
		assert.Equal(t, http.StatusNotFound, w.Code)
		assert.JSONEq(t, `{"status":404, "message":"occurrence not found"}`, w.Body.String())
	})
}
