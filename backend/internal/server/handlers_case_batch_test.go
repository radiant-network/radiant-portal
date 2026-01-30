package server

import (
	"bytes"
	"encoding/json"
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
		CreateBatchFunc: func(payload any, batchType string, username string, dryRun bool) (*types.Batch, error) {
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

	router := gin.Default()
	router.POST("/cases/batch", PostCaseBatchHandler(repo, auth))
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
	req, _ := http.NewRequest(http.MethodPost, "/cases/batch", bytes.NewBuffer([]byte(body)))
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
		CreateBatchFunc: func(payload any, batchType string, username string, dryRun bool) (*types.Batch, error) {
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

	router := gin.Default()
	router.POST("/cases/batch", PostCaseBatchHandler(repo, auth))
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
			}],
			"tasks": []
		}]
	}`
	req, _ := http.NewRequest(http.MethodPost, "/cases/batch", bytes.NewBuffer([]byte(body)))
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

func TestPostCaseBatchHandler_MissingRequiredFields(t *testing.T) {
	gin.SetMode(gin.TestMode)
	repo := &MockBatchRepository{}
	auth := &testutils.MockAuth{}

	router := gin.Default()
	router.POST("/cases/batch", PostCaseBatchHandler(repo, auth))
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
	req, _ := http.NewRequest(http.MethodPost, "/cases/batch", bytes.NewBuffer([]byte(body)))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func TestPostCaseBatchHandler_InvalidType(t *testing.T) {
	gin.SetMode(gin.TestMode)
	repo := &MockBatchRepository{}
	auth := &testutils.MockAuth{}

	router := gin.Default()
	router.POST("/cases/batch", PostCaseBatchHandler(repo, auth))
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
	req, _ := http.NewRequest(http.MethodPost, "/cases/batch", bytes.NewBuffer([]byte(body)))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func TestPostCaseBatchHandler_InvalidCategory(t *testing.T) {
	gin.SetMode(gin.TestMode)
	repo := &MockBatchRepository{}
	auth := &testutils.MockAuth{}

	router := gin.Default()
	router.POST("/cases/batch", PostCaseBatchHandler(repo, auth))
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
	req, _ := http.NewRequest(http.MethodPost, "/cases/batch", bytes.NewBuffer([]byte(body)))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func TestPostCaseBatchHandler_MissingPatients(t *testing.T) {
	gin.SetMode(gin.TestMode)
	repo := &MockBatchRepository{}
	auth := &testutils.MockAuth{}

	router := gin.Default()
	router.POST("/cases/batch", PostCaseBatchHandler(repo, auth))
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
	req, _ := http.NewRequest(http.MethodPost, "/cases/batch", bytes.NewBuffer([]byte(body)))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func TestPostCaseBatchHandler_EmptyPatients(t *testing.T) {
	gin.SetMode(gin.TestMode)
	repo := &MockBatchRepository{}
	auth := &testutils.MockAuth{}

	router := gin.Default()
	router.POST("/cases/batch", PostCaseBatchHandler(repo, auth))
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
	req, _ := http.NewRequest(http.MethodPost, "/cases/batch", bytes.NewBuffer([]byte(body)))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func TestPostCaseBatchHandler_MissingRequiredFieldInSequencingExperiments(t *testing.T) {
	gin.SetMode(gin.TestMode)
	repo := &MockBatchRepository{}
	auth := &testutils.MockAuth{}

	router := gin.Default()
	router.POST("/cases/batch", PostCaseBatchHandler(repo, auth))
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
	req, _ := http.NewRequest(http.MethodPost, "/cases/batch", bytes.NewBuffer([]byte(body)))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func TestPostCaseBatchHandler_MissingSequencingExperiments(t *testing.T) {
	gin.SetMode(gin.TestMode)
	repo := &MockBatchRepository{}
	auth := &testutils.MockAuth{}

	router := gin.Default()
	router.POST("/cases/batch", PostCaseBatchHandler(repo, auth))
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
			}]
		}]
	}`
	req, _ := http.NewRequest(http.MethodPost, "/cases/batch", bytes.NewBuffer([]byte(body)))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func TestPostCaseBatchHandler_EmptySequencingExperiments(t *testing.T) {
	gin.SetMode(gin.TestMode)
	repo := &MockBatchRepository{}
	auth := &testutils.MockAuth{}

	router := gin.Default()
	router.POST("/cases/batch", PostCaseBatchHandler(repo, auth))
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
			"sequencing_experiments": []
		}]
	}`
	req, _ := http.NewRequest(http.MethodPost, "/cases/batch", bytes.NewBuffer([]byte(body)))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func TestPostCaseBatchHandler_MissingTasks(t *testing.T) {
	gin.SetMode(gin.TestMode)
	repo := &MockBatchRepository{}
	auth := &testutils.MockAuth{}

	router := gin.Default()
	router.POST("/cases/batch", PostCaseBatchHandler(repo, auth))
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
	req, _ := http.NewRequest(http.MethodPost, "/cases/batch", bytes.NewBuffer([]byte(body)))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func TestPostCaseBatchHandler_NoTasks(t *testing.T) {
	gin.SetMode(gin.TestMode)
	repo := &MockBatchRepository{}
	auth := &testutils.MockAuth{}

	router := gin.Default()
	router.POST("/cases/batch", PostCaseBatchHandler(repo, auth))
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
	req, _ := http.NewRequest(http.MethodPost, "/cases/batch", bytes.NewBuffer([]byte(body)))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}
