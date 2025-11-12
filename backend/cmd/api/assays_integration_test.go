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
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

func assertGetAssayBySeqIdHandler(t *testing.T, data string, seqId int, expected string) {
	testutils.ParallelTestWithDb(t, data, func(t *testing.T, db *gorm.DB) {
		repo := repository.NewAssaysRepository(db)
		router := gin.Default()
		router.GET("/assays/:seq_id", server.GetAssayBySeqIdHandler(repo))

		req, _ := http.NewRequest("GET", fmt.Sprintf("/assays/%d", seqId), bytes.NewBuffer([]byte("{}")))
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.JSONEq(t, expected, w.Body.String())
	})
}

func Test_GetAssayBySeqIdHandler(t *testing.T) {
	expected := `{
		"aliquot":"NA12892", 
		"capture_kit":"SureSelect Custom DNA Target", 
		"created_on":"2021-09-12T13:08:00Z", 
		"experimental_strategy_code":"wgs", 
		"experimental_strategy_name":"Whole Genome Sequencing", 
		"histology_code":"normal", 
		"sequencing_lab_code":"CQGC", 
		"sequencing_lab_name":"Quebec Clinical Genomic Center", 
		"platform_code":"illumina", 
		"run_alias":"A00516_0169", 
		"run_date":"2021-08-17T00:00:00Z", 
		"run_name":"1617", 
		"sample_id":1, 
		"sample_type_code":"dna", 
		"seq_id":1, 
		"sequencing_read_technology_code":"short_read",
		"sequencing_read_technology_name":"Short Read",
		"status_code":"completed", 
		"submitter_sample_id":"S13224", 
		"updated_on":"2021-09-12T13:08:00Z"
	}`
	assertGetAssayBySeqIdHandler(t, "simple", 1, expected)
}
