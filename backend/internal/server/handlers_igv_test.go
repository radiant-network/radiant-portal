package server

import (
	"bytes"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
)

func Test_IGVGetHandler_germline(t *testing.T) {
	igvRepo := &MockIGVRepository{
		// Return no IGV tracks to test that has_igv_files is set to false
		igvTracks: []types.IGVTrack{{
			SequencingExperimentId: 1,
			SampleId:               "sample_123",
			PatientId:              1,
			FamilyRole:             "proband",
			SexCode:                "male",
			DataTypeCode:           "alignment",
			FormatCode:             "cram",
			URL:                    "s3://example.com/file.cram",
		}, {
			SequencingExperimentId: 1,
			SampleId:               "sample_123",
			PatientId:              1,
			FamilyRole:             "proband",
			SexCode:                "male",
			DataTypeCode:           "alignment",
			FormatCode:             "crai",
			URL:                    "s3://example.com/file.crai",
		}},
	}
	casesRepo := &MockRepository{caseType: "germline"}

	router := gin.Default()
	router.GET("/:tenant/igv/:case_id", GetIGVHandler(igvRepo, casesRepo, testutils.NewMockS3PreSigner(), ""))

	req, _ := http.NewRequest("GET", "/radiant/igv/1", bytes.NewBuffer([]byte("{}")))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `{"alignment":[{"sequencing_experiment_id":1,"patient_id":1,"family_role":"proband","sex":"male","type":"alignment","format":"cram","url":"presigned.s3://example.com/file.cram","urlExpireAt":1234567890,"indexURL":"presigned.s3://example.com/file.crai","indexURLExpireAt":1234567890,"name":"Reads: sample_123 proband"}],"public_tracks":{}}`, w.Body.String())
}

func Test_IGVGetHandler_somatic(t *testing.T) {
	igvRepo := &MockIGVRepository{
		igvTracks: []types.IGVTrack{{
			SequencingExperimentId: 1,
			SampleId:               "sample_123",
			HistologyCode:          "tumoral",
			PatientId:              1,
			FamilyRole:             "proband",
			SexCode:                "female",
			DataTypeCode:           "alignment",
			FormatCode:             "cram",
			URL:                    "s3://example.com/file.cram",
		}, {
			SequencingExperimentId: 1,
			SampleId:               "sample_123",
			HistologyCode:          "tumoral",
			PatientId:              1,
			FamilyRole:             "proband",
			SexCode:                "female",
			DataTypeCode:           "alignment",
			FormatCode:             "crai",
			URL:                    "s3://example.com/file.crai",
		}},
	}
	casesRepo := &MockRepository{caseType: "somatic"}

	router := gin.Default()
	router.GET("/:tenant/igv/:case_id", GetIGVHandler(igvRepo, casesRepo, testutils.NewMockS3PreSigner(), ""))

	req, _ := http.NewRequest("GET", "/radiant/igv/1", bytes.NewBuffer([]byte("{}")))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `{"alignment":[{"sequencing_experiment_id":1,"patient_id":1,"family_role":"proband","sex":"female","type":"alignment","format":"cram","url":"presigned.s3://example.com/file.cram","urlExpireAt":1234567890,"indexURL":"presigned.s3://example.com/file.crai","indexURLExpireAt":1234567890,"name":"Reads: sample_123 tumoral"}],"public_tracks":{}}`, w.Body.String())
}

func igvProbandCramTracks() []types.IGVTrack {
	return []types.IGVTrack{{
		SequencingExperimentId: 1,
		SampleId:               "sample_123",
		PatientId:              1,
		FamilyRole:             "proband",
		SexCode:                "male",
		DataTypeCode:           "alignment",
		FormatCode:             "cram",
		URL:                    "s3://example.com/file.cram",
	}}
}

func Test_IGVGetHandler_caseFileTracks(t *testing.T) {
	igvRepo := &MockIGVRepository{
		igvTracks: append(igvProbandCramTracks(), types.IGVTrack{
			SequencingExperimentId: 1,
			SampleId:               "sample_123",
			PatientId:              1,
			FamilyRole:             "proband",
			SexCode:                "male",
			DataTypeCode:           "igv",
			FormatCode:             "bed",
			DocumentName:           "sample_123.roh.bed",
			URL:                    "s3://example.com/sample_123.roh.bed",
		}),
	}
	casesRepo := &MockRepository{caseType: "germline"}

	router := gin.Default()
	router.GET("/:tenant/igv/:case_id", GetIGVHandler(igvRepo, casesRepo, testutils.NewMockS3PreSigner(), ""))

	req, _ := http.NewRequest("GET", "/radiant/igv/1", bytes.NewBuffer([]byte("{}")))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `{
		"alignment":[{"sequencing_experiment_id":1,"patient_id":1,"family_role":"proband","sex":"male","type":"alignment","format":"cram","url":"presigned.s3://example.com/file.cram","urlExpireAt":1234567890,"indexURL":"","indexURLExpireAt":0,"name":"Reads: sample_123 proband"}],
		"roh":[{"sequencing_experiment_id":1,"patient_id":1,"family_role":"proband","sex":"male","type":"igv","format":"bed","url":"presigned.s3://example.com/sample_123.roh.bed","urlExpireAt":1234567890,"indexURL":"","indexURLExpireAt":0,"name":"ROH: sample_123 proband"}],
		"public_tracks":{}
	}`, w.Body.String())
}

func Test_IGVGetHandler_publicTracks(t *testing.T) {
	igvRepo := &MockIGVRepository{igvTracks: igvProbandCramTracks()}
	casesRepo := &MockRepository{caseType: "germline"}

	router := gin.Default()
	router.GET("/:tenant/igv/:case_id", GetIGVHandler(igvRepo, casesRepo, testutils.NewMockS3PreSigner(), "s3://tracks/igv/"))

	req, _ := http.NewRequest("GET", "/radiant/igv/1", bytes.NewBuffer([]byte("{}")))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `{
		"alignment":[{"sequencing_experiment_id":1,"patient_id":1,"family_role":"proband","sex":"male","type":"alignment","format":"cram","url":"presigned.s3://example.com/file.cram","urlExpireAt":1234567890,"indexURL":"","indexURLExpireAt":0,"name":"Reads: sample_123 proband"}],
		"public_tracks":{
			"clinvar":{"url":"presigned.s3://tracks/igv/clinvar.vcf.gz","urlExpireAt":1234567890,"indexURL":"presigned.s3://tracks/igv/clinvar.vcf.gz.tbi","indexURLExpireAt":1234567890},
			"clinvar_sv":{"url":"presigned.s3://tracks/igv/nstd102.GRCh38.variant_call.vcf.gz","urlExpireAt":1234567890,"indexURL":"presigned.s3://tracks/igv/nstd102.GRCh38.variant_call.vcf.gz.tbi","indexURLExpireAt":1234567890},
			"dgv":{"url":"presigned.s3://tracks/igv/DGV_GS_hg38.cleaned.sorted.gff3.gz","urlExpireAt":1234567890,"indexURL":"presigned.s3://tracks/igv/DGV_GS_hg38.cleaned.sorted.gff3.gz.tbi","indexURLExpireAt":1234567890},
			"clingen_gene":{"url":"presigned.s3://tracks/igv/ClinGen_gene_curation_list_GRCh38.sorted.gff3.gz","urlExpireAt":1234567890,"indexURL":"presigned.s3://tracks/igv/ClinGen_gene_curation_list_GRCh38.sorted.gff3.gz.tbi","indexURLExpireAt":1234567890},
			"clingen_region":{"url":"presigned.s3://tracks/igv/ClinGen_region_curation_list_GRCh38.sorted.gff3.gz","urlExpireAt":1234567890,"indexURL":"presigned.s3://tracks/igv/ClinGen_region_curation_list_GRCh38.sorted.gff3.gz.tbi","indexURLExpireAt":1234567890},
			"gnomad_sv":{"url":"presigned.s3://tracks/igv/gnomad.v4.1.sv.sites.vcf.gz","urlExpireAt":1234567890,"indexURL":"presigned.s3://tracks/igv/gnomad.v4.1.sv.sites.vcf.gz.tbi","indexURLExpireAt":1234567890},
			"gnomad_cnv":{"url":"presigned.s3://tracks/igv/gnomad.v4.1.cnv.all.vcf.gz","urlExpireAt":1234567890,"indexURL":"presigned.s3://tracks/igv/gnomad.v4.1.cnv.all.vcf.gz.tbi","indexURLExpireAt":1234567890},
			"segmental_duplications":{"url":"presigned.s3://tracks/igv/hg38.genomicSuperDups.gff3.gz","urlExpireAt":1234567890,"indexURL":"presigned.s3://tracks/igv/hg38.genomicSuperDups.gff3.gz.tbi","indexURLExpireAt":1234567890},
			"repeat_masker":{"url":"presigned.s3://tracks/igv/hg38.rmsk.gff3.gz","urlExpireAt":1234567890,"indexURL":"presigned.s3://tracks/igv/hg38.rmsk.gff3.gz.tbi","indexURLExpireAt":1234567890},
			"simple_repeats":{"url":"presigned.s3://tracks/igv/hg38.simpleRepeat.gff3.gz","urlExpireAt":1234567890,"indexURL":"presigned.s3://tracks/igv/hg38.simpleRepeat.gff3.gz.tbi","indexURLExpireAt":1234567890},
			"self_chain":{"url":"presigned.s3://tracks/igv/hg38.chainSelf.gff3.gz","urlExpireAt":1234567890,"indexURL":"presigned.s3://tracks/igv/hg38.chainSelf.gff3.gz.tbi","indexURLExpireAt":1234567890}
		}
	}`, w.Body.String())
}

func Test_IGVGetHandler_publicTracksInvalidPrefixReturns500(t *testing.T) {
	igvRepo := &MockIGVRepository{igvTracks: igvProbandCramTracks()}
	casesRepo := &MockRepository{caseType: "germline"}

	router := gin.Default()
	router.GET("/:tenant/igv/:case_id", GetIGVHandler(igvRepo, casesRepo, testutils.NewMockS3PreSigner(), "https://tracks/igv/"))

	req, _ := http.NewRequest("GET", "/radiant/igv/1", bytes.NewBuffer([]byte("{}")))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusInternalServerError, w.Code)
}

func Test_IGVGetHandler_noRowsReturns404(t *testing.T) {
	igvRepo := &MockIGVRepository{}
	casesRepo := &MockRepository{caseType: "germline"}

	router := gin.Default()
	router.GET("/:tenant/igv/:case_id", GetIGVHandler(igvRepo, casesRepo, testutils.NewMockS3PreSigner(), ""))

	req, _ := http.NewRequest("GET", "/radiant/igv/1", bytes.NewBuffer([]byte("{}")))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusNotFound, w.Code)
}

func Test_IGVGetHandler_onlyUnusableFilesReturns404(t *testing.T) {
	igvRepo := &MockIGVRepository{
		igvTracks: []types.IGVTrack{
			{SequencingExperimentId: 1, SampleId: "sample_123", FamilyRole: "proband", DataTypeCode: "igv", FormatCode: "bw", DocumentName: "sample_123.coverage.bw", URL: "s3://example.com/sample_123.coverage.bw"},
			{SequencingExperimentId: 1, SampleId: "sample_123", FamilyRole: "proband", DataTypeCode: "igv", FormatCode: "bed", DocumentName: "sample_123_targets.bed", URL: "s3://example.com/sample_123_targets.bed"},
		},
	}
	casesRepo := &MockRepository{caseType: "germline"}

	router := gin.Default()
	router.GET("/:tenant/igv/:case_id", GetIGVHandler(igvRepo, casesRepo, testutils.NewMockS3PreSigner(), ""))

	req, _ := http.NewRequest("GET", "/radiant/igv/1", bytes.NewBuffer([]byte("{}")))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusNotFound, w.Code)
}
