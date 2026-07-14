package server

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
)

func TestPostCaseBatchHandler_Success(t *testing.T) {
	gin.SetMode(gin.TestMode)
	repo := &MockBatchRepository{
		CreateBatchFunc: func(ctx context.Context, tenantCode string, payload any, batchType string, username string, dryRun bool) (*types.Batch, error) {
			return &types.Batch{
				ID:        uuid.NewString(),
				BatchType: batchType,
				Status:    types.BatchStatusPending,
				CreatedOn: time.Now(),
				Username:  username,
				DryRun:    dryRun,
			}, nil
		},
	}
	auth := &testutils.MockAuth{Username: "testuser"}

	router := tenantRouter()
	router.POST("/:tenant/cases/batch", PostCaseBatchHandler(repo, auth))
	body := `{
		"cases": [{
			"submitter_case_id": "case1",
			"type": "germline",
			"status_code": "active",
			"project_code": "proj1",
			"category_code": "postnatal",
			"analysis_code": "WGA",
			"diagnostic_lab_code": "lab1",
			"ordering_organization_code": "org1",
			"patients": [{
				"affected_status_code": "affected",
				"submitter_patient_id": "p1",
				"patient_organization_code": "org1",
				"relation_to_proband_code": "proband"
			}],
			"sequencing_experiments": [{
				"aliquot": "alq1",
				"sample_organization_code": "org1",
				"submitter_sample_id": "s1"
			}],
			"tasks": [{
				"aliquots": ["alq1"],
				"type_code": "analysis",
				"output_documents": [{
					"data_category_code": "variant",
					"data_type_code": "vcf",
					"format_code": "vcf",
					"name": "output.vcf",
					"size": 1024,
					"url": "https://example.com/output.vcf"
				}, {
					"data_category_code": "variant",
					"data_type_code": "vcf",
					"format_code": "vcf",
					"name": "output.vcf",
					"size": 0,
					"url": "https://another-example.com/output.vcf"
				}],
				"pipeline_version": "v1.0.0"
			}]
		}]
	}`
	req, _ := http.NewRequest(http.MethodPost, "/radiant/cases/batch", bytes.NewBuffer([]byte(body)))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusAccepted, w.Code)
	var response types.CreateBatchResponse
	err := json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.Equal(t, "case", response.BatchType)
	assert.Equal(t, "testuser", response.Username)
	assert.Equal(t, types.BatchStatusPending, response.Status)
}

func TestPostCaseBatchHandler_EmptyTasks(t *testing.T) {
	gin.SetMode(gin.TestMode)
	repo := &MockBatchRepository{
		CreateBatchFunc: func(ctx context.Context, tenantCode string, payload any, batchType string, username string, dryRun bool) (*types.Batch, error) {
			return &types.Batch{
				ID:        uuid.NewString(),
				BatchType: batchType,
				Status:    types.BatchStatusPending,
				CreatedOn: time.Now(),
				Username:  username,
				DryRun:    dryRun,
			}, nil
		},
	}
	auth := &testutils.MockAuth{Username: "testuser"}

	router := tenantRouter()
	router.POST("/:tenant/cases/batch", PostCaseBatchHandler(repo, auth))
	body := `{
		"cases": [{
			"submitter_case_id": "case1",
			"type": "germline",
			"status_code": "active",
			"project_code": "proj1",
			"category_code": "postnatal",
			"analysis_code": "WGA",
			"diagnostic_lab_code": "lab1",
			"ordering_organization_code": "org1",
			"patients": [{
				"affected_status_code": "affected",
				"submitter_patient_id": "p1",
				"patient_organization_code": "org1",
				"relation_to_proband_code": "proband"
			}],
			"sequencing_experiments": [{
				"aliquot": "alq1",
				"sample_organization_code": "org1",
				"submitter_sample_id": "s1"
			}],
			"tasks": []
		}]
	}`
	req, _ := http.NewRequest(http.MethodPost, "/radiant/cases/batch", bytes.NewBuffer([]byte(body)))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusAccepted, w.Code)
	var response types.CreateBatchResponse
	err := json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.Equal(t, "case", response.BatchType)
	assert.Equal(t, "testuser", response.Username)
	assert.Equal(t, types.BatchStatusPending, response.Status)
}

func TestPostCaseBatchHandler_ObservationInvalidInterpretation_BadRequest(t *testing.T) {
	gin.SetMode(gin.TestMode)
	repo := &MockBatchRepository{}
	auth := &testutils.MockAuth{}

	router := tenantRouter()
	router.POST("/:tenant/cases/batch", PostCaseBatchHandler(repo, auth))
	// interpretation_code, when provided, must be one of positive/negative (binding oneof).
	body := `{
		"cases": [{
			"submitter_case_id": "case1",
			"type": "germline",
			"status_code": "active",
			"project_code": "proj1",
			"category_code": "postnatal",
			"analysis_code": "WGA",
			"diagnostic_lab_code": "lab1",
			"ordering_organization_code": "org1",
			"patients": [{
				"affected_status_code": "affected",
				"submitter_patient_id": "p1",
				"patient_organization_code": "org1",
				"relation_to_proband_code": "proband",
				"observations_categorical": [{
					"system": "HPO",
					"code": "phenotype",
					"value": "Seizures",
					"onset_code": "infantile",
					"interpretation_code": "maybe"
				}]
			}],
			"sequencing_experiments": [{
				"aliquot": "alq1",
				"sample_organization_code": "org1",
				"submitter_sample_id": "s1"
			}],
			"tasks": []
		}]
	}`
	req, _ := http.NewRequest(http.MethodPost, "/radiant/cases/batch", bytes.NewBuffer([]byte(body)))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func TestPostCaseBatchHandler_ObservationWithoutOnset_Accepted(t *testing.T) {
	gin.SetMode(gin.TestMode)
	repo := &MockBatchRepository{
		CreateBatchFunc: func(ctx context.Context, tenantCode string, payload any, batchType string, username string, dryRun bool) (*types.Batch, error) {
			return &types.Batch{
				ID:        uuid.NewString(),
				BatchType: batchType,
				Status:    types.BatchStatusPending,
				CreatedOn: time.Now(),
				Username:  username,
				DryRun:    dryRun,
			}, nil
		},
	}
	auth := &testutils.MockAuth{Username: "testuser"}

	router := tenantRouter()
	router.POST("/:tenant/cases/batch", PostCaseBatchHandler(repo, auth))
	// onset_code / interpretation_code are no longer required by the binding; the
	// "required unless ancestry/consanguinity" rule is enforced by the worker.
	body := `{
		"cases": [{
			"submitter_case_id": "case1",
			"type": "germline",
			"status_code": "active",
			"project_code": "proj1",
			"category_code": "postnatal",
			"analysis_code": "WGA",
			"diagnostic_lab_code": "lab1",
			"ordering_organization_code": "org1",
			"patients": [{
				"affected_status_code": "affected",
				"submitter_patient_id": "p1",
				"patient_organization_code": "org1",
				"relation_to_proband_code": "proband",
				"observations_categorical": [{
					"system": "radiant",
					"code": "ancestry",
					"value": "CA-FR"
				}]
			}],
			"sequencing_experiments": [{
				"aliquot": "alq1",
				"sample_organization_code": "org1",
				"submitter_sample_id": "s1"
			}],
			"tasks": []
		}]
	}`
	req, _ := http.NewRequest(http.MethodPost, "/radiant/cases/batch", bytes.NewBuffer([]byte(body)))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusAccepted, w.Code)
}

func TestPostCaseBatchHandler_MissingRequiredFields(t *testing.T) {
	gin.SetMode(gin.TestMode)
	repo := &MockBatchRepository{}
	auth := &testutils.MockAuth{}

	router := tenantRouter()
	router.POST("/:tenant/cases/batch", PostCaseBatchHandler(repo, auth))
	body := `{
		"cases": [{
			"submitter_case_id": "",
			"type": "germline",
			"status_code": "active",
			"project_code": "proj1",
			"category_code": "postnatal",
			"patients": [{
				"affected_status_code": "affected",
				"submitter_patient_id": "p1",
				"patient_organization_code": "org1",
				"relation_to_proband_code": "proband"
			}],
			"sequencing_experiments": [{
				"aliquot": "alq1",
				"sample_organization_code": "org1",
				"submitter_sample_id": "s1"
			}]
		}]
	}`
	req, _ := http.NewRequest(http.MethodPost, "/radiant/cases/batch", bytes.NewBuffer([]byte(body)))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func TestPostCaseBatchHandler_InvalidType(t *testing.T) {
	gin.SetMode(gin.TestMode)
	repo := &MockBatchRepository{}
	auth := &testutils.MockAuth{}

	router := tenantRouter()
	router.POST("/:tenant/cases/batch", PostCaseBatchHandler(repo, auth))
	body := `{
		"cases": [{
			"submitter_case_id": "case1",
			"type": "invalid_type",
			"status_code": "active",
			"project_code": "proj1",
			"category_code": "postnatal",
			"patients": [{
				"affected_status_code": "affected",
				"submitter_patient_id": "p1",
				"patient_organization_code": "org1",
				"relation_to_proband_code": "proband"
			}],
			"sequencing_experiments": [{
				"aliquot": "alq1",
				"sample_organization_code": "org1",
				"submitter_sample_id": "s1"
			}]
		}]
	}`
	req, _ := http.NewRequest(http.MethodPost, "/radiant/cases/batch", bytes.NewBuffer([]byte(body)))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func TestPostCaseBatchHandler_InvalidCategory(t *testing.T) {
	gin.SetMode(gin.TestMode)
	repo := &MockBatchRepository{}
	auth := &testutils.MockAuth{}

	router := tenantRouter()
	router.POST("/:tenant/cases/batch", PostCaseBatchHandler(repo, auth))
	body := `{
		"cases": [{
			"submitter_case_id": "case1",
			"type": "germline",
			"status_code": "active",
			"project_code": "proj1",
			"category_code": "invalid_category",
			"patients": [{
				"affected_status_code": "affected",
				"submitter_patient_id": "p1",
				"patient_organization_code": "org1",
				"relation_to_proband_code": "proband"
			}],
			"sequencing_experiments": [{
				"aliquot": "alq1",
				"sample_organization_code": "org1",
				"submitter_sample_id": "s1"
			}]
		}]
	}`
	req, _ := http.NewRequest(http.MethodPost, "/radiant/cases/batch", bytes.NewBuffer([]byte(body)))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func TestPostCaseBatchHandler_MissingPatients(t *testing.T) {
	gin.SetMode(gin.TestMode)
	repo := &MockBatchRepository{}
	auth := &testutils.MockAuth{}

	router := tenantRouter()
	router.POST("/:tenant/cases/batch", PostCaseBatchHandler(repo, auth))
	body := `{
		"cases": [{
			"submitter_case_id": "case1",
			"type": "germline",
			"status_code": "active",
			"project_code": "proj1",
			"category_code": "postnatal",
			"sequencing_experiments": [{
				"aliquot": "alq1",
				"sample_organization_code": "org1",
				"submitter_sample_id": "s1"
			}]
		}]
	}`
	req, _ := http.NewRequest(http.MethodPost, "/radiant/cases/batch", bytes.NewBuffer([]byte(body)))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func TestPostCaseBatchHandler_EmptyPatients(t *testing.T) {
	gin.SetMode(gin.TestMode)
	repo := &MockBatchRepository{}
	auth := &testutils.MockAuth{}

	router := tenantRouter()
	router.POST("/:tenant/cases/batch", PostCaseBatchHandler(repo, auth))
	body := `{
		"cases": [{
			"submitter_case_id": "case1",
			"type": "germline",
			"status_code": "active",
			"project_code": "proj1",
			"category_code": "postnatal",
			"patients": [],
			"sequencing_experiments": [{
				"aliquot": "alq1",
				"sample_organization_code": "org1",
				"submitter_sample_id": "s1"
			}]
		}]
	}`
	req, _ := http.NewRequest(http.MethodPost, "/radiant/cases/batch", bytes.NewBuffer([]byte(body)))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func TestPostCaseBatchHandler_MissingRequiredFieldInSequencingExperiments(t *testing.T) {
	gin.SetMode(gin.TestMode)
	repo := &MockBatchRepository{}
	auth := &testutils.MockAuth{}

	router := tenantRouter()
	router.POST("/:tenant/cases/batch", PostCaseBatchHandler(repo, auth))
	body := `{
		"cases": [{
			"submitter_case_id": "asdasd",
			"type": "germline",
			"status_code": "active",
			"project_code": "proj1",
			"category_code": "postnatal",
			"patients": [{
				"affected_status_code": "affected",
				"submitter_patient_id": "p1",
				"patient_organization_code": "org1",
				"relation_to_proband_code": "proband"
			}],
			"sequencing_experiments": [{
				"aliquot": "",
				"sample_organization_code": "org1",
				"submitter_sample_id": "s1"
			}]
		}]
	}`
	req, _ := http.NewRequest(http.MethodPost, "/radiant/cases/batch", bytes.NewBuffer([]byte(body)))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}

// A case may be created with no sequencing experiments yet — they are attached later via
// PATCH /cases/batch. So a missing sequencing_experiments list is accepted.
func TestPostCaseBatchHandler_MissingSequencingExperiments(t *testing.T) {
	gin.SetMode(gin.TestMode)
	repo := &MockBatchRepository{
		CreateBatchFunc: func(ctx context.Context, tenantCode string, payload any, batchType string, username string, dryRun bool) (*types.Batch, error) {
			return &types.Batch{ID: uuid.NewString(), BatchType: batchType, Status: types.BatchStatusPending, CreatedOn: time.Now(), Username: username, DryRun: dryRun}, nil
		},
	}
	auth := &testutils.MockAuth{}

	router := tenantRouter()
	router.POST("/:tenant/cases/batch", PostCaseBatchHandler(repo, auth))
	body := `{
		"cases": [{
			"submitter_case_id": "case1",
			"type": "germline",
			"status_code": "active",
			"project_code": "proj1",
			"category_code": "postnatal",
			"analysis_code": "WGA",
			"diagnostic_lab_code": "lab1",
			"ordering_organization_code": "org1",
			"patients": [{
				"affected_status_code": "affected",
				"submitter_patient_id": "p1",
				"patient_organization_code": "org1",
				"relation_to_proband_code": "proband"
			}],
			"tasks": []
		}]
	}`
	req, _ := http.NewRequest(http.MethodPost, "/radiant/cases/batch", bytes.NewBuffer([]byte(body)))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusAccepted, w.Code)
}

func TestPostCaseBatchHandler_EmptySequencingExperiments(t *testing.T) {
	gin.SetMode(gin.TestMode)
	repo := &MockBatchRepository{
		CreateBatchFunc: func(ctx context.Context, tenantCode string, payload any, batchType string, username string, dryRun bool) (*types.Batch, error) {
			return &types.Batch{ID: uuid.NewString(), BatchType: batchType, Status: types.BatchStatusPending, CreatedOn: time.Now(), Username: username, DryRun: dryRun}, nil
		},
	}
	auth := &testutils.MockAuth{}

	router := tenantRouter()
	router.POST("/:tenant/cases/batch", PostCaseBatchHandler(repo, auth))
	body := `{
		"cases": [{
			"submitter_case_id": "case1",
			"type": "germline",
			"status_code": "active",
			"project_code": "proj1",
			"category_code": "postnatal",
			"analysis_code": "WGA",
			"diagnostic_lab_code": "lab1",
			"ordering_organization_code": "org1",
			"patients": [{
				"affected_status_code": "affected",
				"submitter_patient_id": "p1",
				"patient_organization_code": "org1",
				"relation_to_proband_code": "proband"
			}],
			"sequencing_experiments": [],
			"tasks": []
		}]
	}`
	req, _ := http.NewRequest(http.MethodPost, "/radiant/cases/batch", bytes.NewBuffer([]byte(body)))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusAccepted, w.Code)
}

// PATCH /cases/batch enqueues a case_sequencing_experiment batch to attach experiments
// to an existing case.
func TestPatchCaseBatchHandler_Success(t *testing.T) {
	gin.SetMode(gin.TestMode)
	repo := &MockBatchRepository{
		CreateBatchFunc: func(ctx context.Context, tenantCode string, payload any, batchType string, username string, dryRun bool) (*types.Batch, error) {
			return &types.Batch{ID: uuid.NewString(), BatchType: batchType, Status: types.BatchStatusPending, CreatedOn: time.Now(), Username: username, DryRun: dryRun}, nil
		},
	}
	auth := &testutils.MockAuth{Username: "testuser"}

	router := tenantRouter()
	router.PATCH("/:tenant/cases/batch", PatchCaseBatchHandler(repo, auth))
	body := `{
		"cases": [{
			"project_code": "proj1",
			"submitter_case_id": "case1",
			"sequencing_experiments": [{
				"aliquot": "alq1",
				"sample_organization_code": "org1",
				"submitter_sample_id": "s1"
			}]
		}]
	}`
	req, _ := http.NewRequest(http.MethodPatch, "/radiant/cases/batch", bytes.NewBuffer([]byte(body)))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusAccepted, w.Code)
	var response types.CreateBatchResponse
	assert.NoError(t, json.Unmarshal(w.Body.Bytes(), &response))
	assert.Equal(t, types.PatchCaseBatchType, response.BatchType)
}

// PATCH requires project_code, submitter_case_id, and at least one sequencing experiment.
func TestPatchCaseBatchHandler_MissingFields(t *testing.T) {
	gin.SetMode(gin.TestMode)
	repo := &MockBatchRepository{}
	auth := &testutils.MockAuth{}

	router := tenantRouter()
	router.PATCH("/:tenant/cases/batch", PatchCaseBatchHandler(repo, auth))
	body := `{
		"cases": [{
			"submitter_case_id": "case1",
			"sequencing_experiments": []
		}]
	}`
	req, _ := http.NewRequest(http.MethodPatch, "/radiant/cases/batch", bytes.NewBuffer([]byte(body)))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func TestPostCaseBatchHandler_MissingTasks(t *testing.T) {
	gin.SetMode(gin.TestMode)
	repo := &MockBatchRepository{}
	auth := &testutils.MockAuth{}

	router := tenantRouter()
	router.POST("/:tenant/cases/batch", PostCaseBatchHandler(repo, auth))
	body := `{
		"cases": [{
			"submitter_case_id": "case1",
			"type": "germline",
			"status_code": "active",
			"project_code": "proj1",
			"category_code": "postnatal",
			"patients": [{
				"affected_status_code": "affected",
				"submitter_patient_id": "p1",
				"patient_organization_code": "org1",
				"relation_to_proband_code": "proband"
			}],
			"sequencing_experiments": [{
				"aliquot": "alq1",
				"sample_organization_code": "org1",
				"submitter_sample_id": "s1"
			}]
		}]
	}`
	req, _ := http.NewRequest(http.MethodPost, "/radiant/cases/batch", bytes.NewBuffer([]byte(body)))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}

// PUT /cases/batch enqueues an update_case batch that replaces a case's scalars and
// clinical patient data.
func TestPutCaseBatchHandler_Success(t *testing.T) {
	gin.SetMode(gin.TestMode)
	repo := &MockBatchRepository{
		CreateBatchFunc: func(ctx context.Context, tenantCode string, payload any, batchType string, username string, dryRun bool) (*types.Batch, error) {
			return &types.Batch{ID: uuid.NewString(), BatchType: batchType, Status: types.BatchStatusPending, CreatedOn: time.Now(), Username: username, DryRun: dryRun}, nil
		},
	}
	auth := &testutils.MockAuth{Username: "testuser"}

	router := tenantRouter()
	router.PUT("/:tenant/cases/batch", PutCaseBatchHandler(repo, auth))
	body := `{
		"cases": [{
			"project_code": "proj1",
			"submitter_case_id": "case1",
			"type": "germline",
			"status_code": "active",
			"category_code": "postnatal",
			"analysis_code": "WGA",
			"diagnostic_lab_code": "lab1",
			"ordering_organization_code": "org1",
			"patients": [{
				"affected_status_code": "affected",
				"submitter_patient_id": "p1",
				"patient_organization_code": "org1",
				"relation_to_proband_code": "proband"
			}]
		}]
	}`
	req, _ := http.NewRequest(http.MethodPut, "/radiant/cases/batch", bytes.NewBuffer([]byte(body)))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusAccepted, w.Code)
	var response types.CreateBatchResponse
	assert.NoError(t, json.Unmarshal(w.Body.Bytes(), &response))
	assert.Equal(t, types.UpdateCaseBatchType, response.BatchType)
	assert.Equal(t, "testuser", response.Username)
	assert.Equal(t, types.BatchStatusPending, response.Status)
}

// PUT requires project_code, submitter_case_id, the scalar fields, and at least one patient —
// it never carries tasks or sequencing_experiments.
func TestPutCaseBatchHandler_MissingRequiredFields(t *testing.T) {
	gin.SetMode(gin.TestMode)
	repo := &MockBatchRepository{}
	auth := &testutils.MockAuth{}

	router := tenantRouter()
	router.PUT("/:tenant/cases/batch", PutCaseBatchHandler(repo, auth))
	body := `{
		"cases": [{
			"submitter_case_id": "case1",
			"type": "germline",
			"status_code": "active",
			"category_code": "postnatal",
			"patients": [{
				"affected_status_code": "affected",
				"submitter_patient_id": "p1",
				"patient_organization_code": "org1",
				"relation_to_proband_code": "proband"
			}]
		}]
	}`
	req, _ := http.NewRequest(http.MethodPut, "/radiant/cases/batch", bytes.NewBuffer([]byte(body)))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func TestPutCaseBatchHandler_EmptyPatients(t *testing.T) {
	gin.SetMode(gin.TestMode)
	repo := &MockBatchRepository{}
	auth := &testutils.MockAuth{}

	router := tenantRouter()
	router.PUT("/:tenant/cases/batch", PutCaseBatchHandler(repo, auth))
	body := `{
		"cases": [{
			"project_code": "proj1",
			"submitter_case_id": "case1",
			"type": "germline",
			"status_code": "active",
			"category_code": "postnatal",
			"analysis_code": "WGA",
			"diagnostic_lab_code": "lab1",
			"ordering_organization_code": "org1",
			"patients": []
		}]
	}`
	req, _ := http.NewRequest(http.MethodPut, "/radiant/cases/batch", bytes.NewBuffer([]byte(body)))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func TestPutCaseBatchHandler_RepoError(t *testing.T) {
	gin.SetMode(gin.TestMode)
	repo := &MockBatchRepository{
		CreateBatchFunc: func(ctx context.Context, tenantCode string, payload any, batchType string, username string, dryRun bool) (*types.Batch, error) {
			return nil, errors.New("boom")
		},
	}
	auth := &testutils.MockAuth{Username: "testuser"}

	router := tenantRouter()
	router.PUT("/:tenant/cases/batch", PutCaseBatchHandler(repo, auth))
	body := `{
		"cases": [{
			"project_code": "proj1",
			"submitter_case_id": "case1",
			"type": "germline",
			"status_code": "active",
			"category_code": "postnatal",
			"analysis_code": "WGA",
			"diagnostic_lab_code": "lab1",
			"ordering_organization_code": "org1",
			"patients": [{
				"affected_status_code": "affected",
				"submitter_patient_id": "p1",
				"patient_organization_code": "org1",
				"relation_to_proband_code": "proband"
			}]
		}]
	}`
	req, _ := http.NewRequest(http.MethodPut, "/radiant/cases/batch", bytes.NewBuffer([]byte(body)))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusInternalServerError, w.Code)
	assert.JSONEq(t, `{"status":500,"message":"Internal Server Error"}`, w.Body.String())
}

func TestPostCaseBatchHandler_NoTasks(t *testing.T) {
	gin.SetMode(gin.TestMode)
	repo := &MockBatchRepository{}
	auth := &testutils.MockAuth{}

	router := tenantRouter()
	router.POST("/:tenant/cases/batch", PostCaseBatchHandler(repo, auth))
	body := `{
		"cases": [{
			"submitter_case_id": "case1",
			"type": "germline",
			"status_code": "active",
			"project_code": "proj1",
			"category_code": "postnatal",
			"patients": [{
				"affected_status_code": "affected",
				"submitter_patient_id": "p1",
				"patient_organization_code": "org1",
				"relation_to_proband_code": "proband"
			}],
			"sequencing_experiments": [{
				"aliquot": "alq1",
				"sample_organization_code": "org1",
				"submitter_sample_id": "s1"
			}]
		}]
	}`
	req, _ := http.NewRequest(http.MethodPost, "/radiant/cases/batch", bytes.NewBuffer([]byte(body)))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}
