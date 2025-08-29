package server

import (
	"bytes"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/stretchr/testify/assert"
)

func (m *MockRepository) SearchDocuments(userQuery types.ListQuery) (*[]types.DocumentResult, *int64, error) {
	var count = int64(1)
	return &[]types.DocumentResult{
		{
			DocumentID:                204,
			Name:                      "FI0037905.S14786.vcf.gz.tbi",
			FormatCode:                "tbi",
			DataTypeCode:              "snv",
			Size:                      2432696,
			CaseID:                    21,
			PerformerLabCode:          "CQGC",
			PerformerLabName:          "Quebec Clinical Genomic Center",
			RelationshipToProbandCode: "proband",
			PatientID:                 60,
			SubmitterSampleID:         "S14857",
			TaskID:                    21,
			SeqID:                     59,
			Hash:                      "5d41402abc4b2a76b9719d911017c795",
			RunAlias:                  "A00516_0227",
		},
	}, &count, nil
}

func Test_SearchDocumentsHandler(t *testing.T) {
	repo := &MockRepository{}
	router := gin.Default()
	router.POST("/documents/search", SearchDocumentsHandler(repo))
	body := `{
			"additional_fields":[]
	}`
	req, _ := http.NewRequest("POST", "/documents/search", bytes.NewBuffer([]byte(body)))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `{
		"list": [{
			"case_id":21, 
			"data_type_code":"snv", 
			"document_id":204, 
			"format_code":"tbi", 
			"hash":"5d41402abc4b2a76b9719d911017c795", 
			"name":"FI0037905.S14786.vcf.gz.tbi", 
			"patient_id":60, 
			"performer_lab_code":"CQGC", 
			"performer_lab_name":"Quebec Clinical Genomic Center", 
			"relationship_to_proband_code":"proband", 
			"run_alias":"A00516_0227", 
			"submitter_sample_id":"S14857", 
			"seq_id":59, 
			"size":2432696, 
			"task_id":21
		}],
		"count": 1
	}`, w.Body.String())
}
