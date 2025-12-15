package main

import (
	"bytes"
	"encoding/json"
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

func Test_PostSequencingExperimentBatch_OK(t *testing.T) {
	testutils.ParallelTestWithPostgres(t, func(t *testing.T, postgres *gorm.DB) {
		auth := testutils.MockAuth{}
		repo := repository.NewBatchRepository(postgres)
		router := gin.Default()
		router.POST("/sequencing/batches", server.PostSequencingExperimentBatchHandler(repo, &auth))

		payload := []byte(`{"sequencing_experiments":[{"aliquot":"ALIQUOT-123","sample_organization_code":"ORG-123","submitter_sample_id":"SAMPLE-123","capture_kit":"CPT-123","experimental_strategy_code":"wgs","sequencing_read_technology_code":"short_read","platform_code":"illumina","sequencing_lab_code":"CHUSJ","run_alias":"RUN-ALIAS-1","run_date":"2025-12-15T12:00:00Z","run_name":"RUN-1","status_code":"in_progress"}]}`)

		req, _ := http.NewRequest("POST", "/sequencing/batches", bytes.NewBuffer(payload))
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)
		assert.Equal(t, http.StatusAccepted, w.Code)

		res := w.Body.String()
		assert.NotEmpty(t, res, "Response should not be empty")

		var respBody types.CreateBatchResponse
		err := json.Unmarshal(w.Body.Bytes(), &respBody)
		assert.Nil(t, err)
		assert.NotEmpty(t, respBody.ID, "Batch ID should not be empty")

		expectedPayload := `[{"aliquot": "ALIQUOT-123", "run_date": "2025-12-15T12:00:00Z", "run_name": "RUN-1", "run_alias": "RUN-ALIAS-1", "capture_kit": "CPT-123", "status_code": "in_progress", "platform_code": "illumina", "sequencing_lab_code": "CHUSJ", "submitter_sample_id": "SAMPLE-123", "sample_organization_code": "ORG-123", "experimental_strategy_code": "wgs", "sequencing_read_technology_code": "short_read"}]`

		batch, err := repo.ClaimNextBatch()
		assert.Nil(t, err)
		assert.NotNil(t, batch)
		assert.Equal(t, respBody.ID, batch.ID)
		assert.Equal(t, expectedPayload, batch.Payload)
	})
}
