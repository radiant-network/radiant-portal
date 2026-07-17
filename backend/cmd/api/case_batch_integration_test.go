package main

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/radiant-network/radiant-api/internal/repository"
	"github.com/radiant-network/radiant-api/internal/server"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

// Integration tests for the /cases/batch routes wired in main.go — POST creates a case batch and
// PATCH attaches data to an existing case (today: sequencing experiments). Both endpoints enqueue
// a batch row (status PENDING) for the worker to process out-of-band.

func Test_PostCaseBatch_OK(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		db := env.Postgres
		auth := testutils.MockAuth{}
		repo := repository.NewBatchRepository(db)

		router := tenantRouter()
		router.POST("/:tenant/cases/batch", server.PostCaseBatchHandler(repo, &auth))

		body := types.CreateCaseBatchBody{
			Cases: []*types.CaseBatch{{
				SubmitterCaseId:          "CASE-IT-1",
				Type:                     "germline",
				StatusCode:               "submitted",
				ProjectCode:              "QLIN",
				CategoryCode:             "postnatal",
				AnalysisCode:             "WGA",
				DiagnosticLabCode:        "LDM-CHUSJ",
				OrderingOrganizationCode: "CHUSJ",
				Patients: []*types.CasePatientBatch{{
					AffectedStatusCode:      "affected",
					SubmitterPatientId:      "PAT-1",
					PatientOrganizationCode: "CHUSJ",
					RelationToProbandCode:   "proband",
				}},
				Tasks: []*types.CaseTaskBatch{},
			}},
		}
		payload, err := json.Marshal(body)
		require.NoError(t, err)

		req, _ := http.NewRequest(http.MethodPost, "/radiant/cases/batch", bytes.NewBuffer(payload))
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusAccepted, w.Code)
		var resp types.CreateBatchResponse
		require.NoError(t, json.Unmarshal(w.Body.Bytes(), &resp))
		assert.NotEmpty(t, resp.ID)
		assert.Equal(t, types.CreateCaseBatchType, resp.BatchType)
		assert.Equal(t, types.BatchStatusPending, resp.Status)

		batch, err := repo.ClaimNextBatch(t.Context())
		assert.NoError(t, err)
		if assert.NotNil(t, batch) {
			assert.Equal(t, resp.ID, batch.ID)
			assert.Equal(t, types.CreateCaseBatchType, batch.BatchType)
		}
		db.Exec("DELETE FROM batch WHERE id = ?", resp.ID)
	})
}

func Test_PatchCaseBatch_OK(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		db := env.Postgres
		auth := testutils.MockAuth{}
		repo := repository.NewBatchRepository(db)

		router := tenantRouter()
		router.PATCH("/:tenant/cases/batch", server.PatchCaseBatchHandler(repo, &auth))

		body := types.PatchCaseBatchBody{
			Cases: []*types.CaseBatchPatch{{
				ProjectCode:     "QLIN",
				SubmitterCaseId: "CASE-IT-1",
				SequencingExperiments: []*types.CaseSequencingExperimentBatch{{
					Aliquot:                "ALIQ-IT-1",
					SubmitterSampleId:      "SAMPLE-IT-1",
					SampleOrganizationCode: "LDM-CHUSJ",
				}},
			}},
		}
		payload, err := json.Marshal(body)
		require.NoError(t, err)

		req, _ := http.NewRequest(http.MethodPatch, "/radiant/cases/batch", bytes.NewBuffer(payload))
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusAccepted, w.Code)
		var resp types.CreateBatchResponse
		require.NoError(t, json.Unmarshal(w.Body.Bytes(), &resp))
		assert.NotEmpty(t, resp.ID)
		assert.Equal(t, types.PatchCaseBatchType, resp.BatchType)
		assert.Equal(t, types.BatchStatusPending, resp.Status)

		batch, err := repo.ClaimNextBatch(t.Context())
		assert.NoError(t, err)
		if assert.NotNil(t, batch) {
			assert.Equal(t, resp.ID, batch.ID)
			assert.Equal(t, types.PatchCaseBatchType, batch.BatchType)
		}
		db.Exec("DELETE FROM batch WHERE id = ?", resp.ID)
	})
}

func Test_PatchCaseBatch_RejectsMissingCaseKeyFields(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		auth := testutils.MockAuth{}
		repo := repository.NewBatchRepository(env.Postgres)

		router := tenantRouter()
		router.PATCH("/:tenant/cases/batch", server.PatchCaseBatchHandler(repo, &auth))

		// Missing project_code + submitter_case_id → binding:"required" rejects the request.
		body := `{"cases":[{"sequencing_experiments":[{"aliquot":"A","submitter_sample_id":"S","sample_organization_code":"LDM"}]}]}`
		req, _ := http.NewRequest(http.MethodPatch, "/radiant/cases/batch", bytes.NewBuffer([]byte(body)))
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusBadRequest, w.Code)
	})
}
