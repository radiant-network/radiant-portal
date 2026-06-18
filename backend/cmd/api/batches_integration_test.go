package main

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/radiant-network/radiant-api/internal/repository"
	"github.com/radiant-network/radiant-api/internal/server"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func Test_PostSequencingExperimentBatch_OK(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		db := env.Postgres

		auth := testutils.MockAuth{}
		repo := repository.NewBatchRepository(db)

		router := tenantRouter()
		router.POST(
			"/:tenant/sequencing/batches",
			server.PostSequencingExperimentBatchHandler(repo, &auth),
		)

		runDate := time.Date(2024, 12, 15, 12, 0, 0, 0, time.UTC)
		reqBody := struct {
			SequencingExperiments []map[string]interface{} `json:"sequencing_experiments"`
		}{
			SequencingExperiments: []map[string]interface{}{
				{
					"aliquot":                         "ALIQUOT-123",
					"sample_organization_code":        "ORG-123",
					"submitter_sample_id":             "SAMPLE-123",
					"capture_kit":                     "CPT-123",
					"experimental_strategy_code":      "wgs",
					"sequencing_read_technology_code": "short_read",
					"platform_code":                   "illumina",
					"sequencing_lab_code":             "CHUSJ",
					"run_alias":                       "RUN-ALIAS-1",
					"run_date":                        runDate.Format(time.RFC3339),
					"run_name":                        "RUN-1",
					"status_code":                     "in_progress",
				},
			},
		}

		payload, err := json.Marshal(reqBody)
		require.NoError(t, err, "marshalling request body")

		req, _ := http.NewRequest("POST", "/radiant/sequencing/batches", bytes.NewBuffer(payload))
		w := httptest.NewRecorder()

		router.ServeHTTP(w, req)
		assert.Equal(t, http.StatusAccepted, w.Code)

		res := w.Body.String()

		if assert.NotEmpty(t, res, "Response should not be empty") {
			var respBody types.CreateBatchResponse
			err = json.Unmarshal(w.Body.Bytes(), &respBody)

			assert.Nil(t, err)

			if assert.NotEmpty(t, respBody.ID, "Batch ID should not be empty") {

				expectedPayload := `[{"aliquot": "ALIQUOT-123", "run_date": "2024-12-15T12:00:00Z", "run_name": "RUN-1", "run_alias": "RUN-ALIAS-1", "capture_kit": "CPT-123", "status_code": "in_progress", "platform_code": "illumina", "sequencing_lab_code": "CHUSJ", "submitter_sample_id": "SAMPLE-123", "sample_organization_code": "ORG-123", "experimental_strategy_code": "wgs", "sequencing_read_technology_code": "short_read"}]`
				batch, err := repo.ClaimNextBatch(t.Context())
				assert.Nil(t, err)
				if assert.NotNil(t, batch) {
					assert.Equal(t, respBody.ID, batch.ID)
					assert.Equal(t, expectedPayload, batch.Payload)
				}
				db.Exec("DELETE FROM batch WHERE id = ?", respBody.ID)
			}
		}
	})
}
