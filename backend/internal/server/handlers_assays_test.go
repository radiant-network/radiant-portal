package server

import (
	"bytes"
	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/stretchr/testify/assert"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"
)

func (m *MockRepository) GetAssayBySeqId(seqId int) (*types.Assay, error) {
	return &types.Assay{
		RequestID:  22,
		StatusCode: "completed",
		CreatedOn: time.Date(
			2021, 9, 12, 13, 8, 0, 0, time.UTC),
		UpdatedOn: time.Date(
			2021, 9, 12, 13, 8, 0, 0, time.UTC),
		PerformerLabCode: "CQGC",
		PerformerLabName: "Quebec Clinical Genomic Center",
		Aliquot:          "NA12892",
		RunName:          "1617",
		RunAlias:         "A00516_0169",
		RunDate: time.Date(
			2021, 8, 17, 0, 0, 0, 0, time.UTC),
		SeqID:                    1,
		ExperimentalStrategyCode: "wxs",
		ExperimentalStrategyName: "Whole Exome Sequencing",
		IsPairedEnd:              true,
		PlatformCode:             "illumina",
		CaptureKit:               "SureSelect Custom DNA Target",
		ReadLength:               151,
		ExperimentDescription:    "A description",
		SampleID:                 1,
		CategoryCode:             "sample",
		SampleTypeCode:           "dna",
		TissueSite:               "",
		HistologyCode:            "normal",
		SubmitterSampleID:        "S13224",
	}, nil
}

func Test_GetAssayBySeqIdHandler(t *testing.T) {
	repo := &MockRepository{}
	router := gin.Default()
	router.GET("/assays/:seq_id", GetAssayBySeqIdHandler(repo))

	req, _ := http.NewRequest("GET", "/assays/1", bytes.NewBuffer([]byte("{}")))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `{
		"aliquot":"NA12892", 
		"capture_kit":"SureSelect Custom DNA Target", 
		"category_code":"sample", 
		"created_on":"2021-09-12T13:08:00Z", 
		"experiment_description":"A description", 
		"experimental_strategy_code":"wxs", 
		"experimental_strategy_name":"Whole Exome Sequencing", 
		"histology_code":"normal", 
		"is_paired_end":true, 
		"performer_lab_code":"CQGC", 
		"performer_lab_name":"Quebec Clinical Genomic Center", 
		"platform_code":"illumina", 
		"read_length":151, 
		"request_id":22, 
		"run_alias":"A00516_0169", 
		"run_date":"2021-08-17T00:00:00Z", 
		"run_name":"1617", 
		"sample_id":1, 
		"sample_type_code":"dna", 
		"seq_id":1, 
		"status_code":"completed", 
		"submitter_sample_id":"S13224", 
		"updated_on":"2021-09-12T13:08:00Z"
	}`, w.Body.String())
}
