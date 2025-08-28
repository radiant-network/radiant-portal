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
			DocumentID:                 204,
			Name:                       "FI0037905.S14786.vcf.gz.tbi",
			FormatCode:                 "tbi",
			DataTypeCode:               "snv",
			Size:                       2432696,
			CasesID:                    []int{21},
			PerformerLabsCode:          []string{"CQGC"},
			PerformerLabsName:          []string{"Quebec Clinical Genomic Center"},
			RelationshipsToProbandCode: []string{"father", "mother", "proband"},
			PatientsID:                 []int{59, 60, 61},
			SampleSubmittersID:         []string{"S14857", "S14858", "S14859"},
			TasksID:                    []int{21},
			SeqsID:                     []int{59, 60, 61},
			Hash:                       "5d41402abc4b2a76b9719d911017c795",
			RunsAlias:                  []string{"A00516_0227", "A00516_0228", "A00516_0229"},
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
			"cases_id":[21], 
			"data_type_code":"snv", 
			"document_id":204, 
			"format_code":"tbi", 
			"hash":"5d41402abc4b2a76b9719d911017c795", 
			"name":"FI0037905.S14786.vcf.gz.tbi", 
			"patients_id":[59, 60, 61], 
			"performer_labs_code":["CQGC"], 
			"performer_labs_name":["Quebec Clinical Genomic Center"], 
			"relationships_to_proband":["father", "mother", "proband"], 
			"runs_alias":["A00516_0227", "A00516_0228", "A00516_0229"], 
			"sample_submitters_id":["S14857", "S14858", "S14859"], 
			"seqs_id":[59, 60, 61], 
			"size":2432696, 
			"tasks_id":[21]
		}],
		"count": 1
	}`, w.Body.String())
}
