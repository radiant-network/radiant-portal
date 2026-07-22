package main

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/radiant-network/radiant-api/internal/database"
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
		repo := repository.NewBatchRepository(database.PostgresDB{DB: db})

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

func Test_PutPatientBatch_OK(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		db := env.Postgres
		auth := testutils.MockAuth{}
		repo := repository.NewBatchRepository(database.PostgresDB{DB: db})

		router := tenantRouter()
		router.PUT("/:tenant/patients/batch", server.PutPatientBatchHandler(repo, &auth))

		dob := types.DateISO8601(time.Date(2000, 1, 1, 0, 0, 0, 0, time.UTC))
		body := types.CreatePatientBatchBody{
			Patients: []*types.PatientBatch{{
				SubmitterPatientId:      "PAT-PUT-IT-1",
				SubmitterPatientIdType:  "mrn",
				PatientOrganizationCode: "CHUSJ",
				LifeStatusCode:          "alive",
				SexCode:                 "male",
				DateOfBirth:             &dob,
			}},
		}
		payload, err := json.Marshal(body)
		require.NoError(t, err)

		req, _ := http.NewRequest(http.MethodPut, "/radiant/patients/batch", bytes.NewBuffer(payload))
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusAccepted, w.Code)
		var resp types.CreateBatchResponse
		require.NoError(t, json.Unmarshal(w.Body.Bytes(), &resp))
		assert.Equal(t, types.UpdatePatientBatchType, resp.BatchType)
		assert.Equal(t, types.BatchStatusPending, resp.Status)

		batch, err := repo.ClaimNextBatch(t.Context())
		assert.NoError(t, err)
		if assert.NotNil(t, batch) {
			assert.Equal(t, resp.ID, batch.ID)
			assert.Equal(t, types.UpdatePatientBatchType, batch.BatchType)
		}
		db.Exec("DELETE FROM batch WHERE id = ?", resp.ID)
	})
}

func Test_PutSampleBatch_OK(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		db := env.Postgres
		auth := testutils.MockAuth{}
		repo := repository.NewBatchRepository(database.PostgresDB{DB: db})

		router := tenantRouter()
		router.PUT("/:tenant/samples/batch", server.PutSampleBatchHandler(repo, &auth))

		body := types.CreateSampleBatchBody{
			Samples: []*types.SampleBatch{{
				SubmitterPatientId:      "PAT-PUT-IT-1",
				PatientOrganizationCode: "CHUSJ",
				TypeCode:                "blood",
				HistologyCode:           "normal",
				SubmitterSampleId:       "SAMPLE-PUT-IT-1",
				SampleOrganizationCode:  "CQGC",
			}},
		}
		payload, err := json.Marshal(body)
		require.NoError(t, err)

		req, _ := http.NewRequest(http.MethodPut, "/radiant/samples/batch", bytes.NewBuffer(payload))
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusAccepted, w.Code)
		var resp types.CreateBatchResponse
		require.NoError(t, json.Unmarshal(w.Body.Bytes(), &resp))
		assert.Equal(t, types.UpdateSampleBatchType, resp.BatchType)
		assert.Equal(t, types.BatchStatusPending, resp.Status)

		batch, err := repo.ClaimNextBatch(t.Context())
		assert.NoError(t, err)
		if assert.NotNil(t, batch) {
			assert.Equal(t, resp.ID, batch.ID)
			assert.Equal(t, types.UpdateSampleBatchType, batch.BatchType)
		}
		db.Exec("DELETE FROM batch WHERE id = ?", resp.ID)
	})
}

func Test_PutSequencingExperimentBatch_OK(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		db := env.Postgres
		auth := testutils.MockAuth{}
		repo := repository.NewBatchRepository(database.PostgresDB{DB: db})

		router := tenantRouter()
		router.PUT("/:tenant/sequencing/batch", server.PutSequencingExperimentBatchHandler(repo, &auth))

		body := types.CreateSequencingExperimentBatchBody{
			SequencingExperiments: []*types.SequencingExperimentBatch{{
				Aliquot:                      "ALIQUOT-PUT-IT-1",
				SampleOrganizationCode:       "CQGC",
				SubmitterSampleId:            "S13224",
				ExperimentalStrategyCode:     "wgs",
				SequencingReadTechnologyCode: "short_read",
				PlatformCode:                 "illumina",
				SequencingLabCode:            "CQGC",
				StatusCode:                   "completed",
			}},
		}
		payload, err := json.Marshal(body)
		require.NoError(t, err)

		req, _ := http.NewRequest(http.MethodPut, "/radiant/sequencing/batch", bytes.NewBuffer(payload))
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusAccepted, w.Code)
		var resp types.CreateBatchResponse
		require.NoError(t, json.Unmarshal(w.Body.Bytes(), &resp))
		assert.Equal(t, types.UpdateSequencingExperimentBatchType, resp.BatchType)
		assert.Equal(t, types.BatchStatusPending, resp.Status)

		batch, err := repo.ClaimNextBatch(t.Context())
		assert.NoError(t, err)
		if assert.NotNil(t, batch) {
			assert.Equal(t, resp.ID, batch.ID)
			assert.Equal(t, types.UpdateSequencingExperimentBatchType, batch.BatchType)
		}
		db.Exec("DELETE FROM batch WHERE id = ?", resp.ID)
	})
}

func Test_PutCaseBatch_OK(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		db := env.Postgres
		auth := testutils.MockAuth{}
		repo := repository.NewBatchRepository(database.PostgresDB{DB: db})

		router := tenantRouter()
		router.PUT("/:tenant/cases/batch", server.PutCaseBatchHandler(repo, &auth))

		body := types.UpdateCaseBatchBody{
			Cases: []*types.UpdateCaseBatch{{
				ProjectCode:              "N1",
				SubmitterCaseId:          "CASE-PUT-IT-1",
				Type:                     "germline",
				StatusCode:               "in_progress",
				DiagnosticLabCode:        "LDM-CHUSJ",
				CategoryCode:             "postnatal",
				AnalysisCode:             "WGA",
				OrderingOrganizationCode: "CHUSJ",
				Patients: []*types.CasePatientBatch{{
					AffectedStatusCode:      "affected",
					SubmitterPatientId:      "MRN-283773",
					PatientOrganizationCode: "CHUSJ",
					RelationToProbandCode:   "proband",
				}},
			}},
		}
		payload, err := json.Marshal(body)
		require.NoError(t, err)

		req, _ := http.NewRequest(http.MethodPut, "/radiant/cases/batch", bytes.NewBuffer(payload))
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusAccepted, w.Code)
		var resp types.CreateBatchResponse
		require.NoError(t, json.Unmarshal(w.Body.Bytes(), &resp))
		assert.Equal(t, types.UpdateCaseBatchType, resp.BatchType)
		assert.Equal(t, types.BatchStatusPending, resp.Status)

		batch, err := repo.ClaimNextBatch(t.Context())
		assert.NoError(t, err)
		if assert.NotNil(t, batch) {
			assert.Equal(t, resp.ID, batch.ID)
			assert.Equal(t, types.UpdateCaseBatchType, batch.BatchType)
		}
		db.Exec("DELETE FROM batch WHERE id = ?", resp.ID)
	})
}
