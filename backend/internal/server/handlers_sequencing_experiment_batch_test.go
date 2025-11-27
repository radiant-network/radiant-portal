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
	"github.com/tbaehler/gin-keycloak/pkg/ginkeycloak"
)

func TestPostSequencingExperimentBatchHandler_Success(t *testing.T) {
	gin.SetMode(gin.TestMode)
	repo := &MockBatchRepository{
		CreateBatchFunc: func(payload any, batchType string, username string, dryRun bool) (*types.Batch, error) {
			return &types.Batch{
				ID:        uuid.NewString(),
				BatchType: batchType,
				Status:    "PENDING",
				CreatedOn: time.Now(),
				Username:  username,
				DryRun:    dryRun,
			}, nil
		},
	}
	auth := &testutils.MockAuth{
		Username: "testuser",
		Azp:      "mock-azp",
		ResourceAccess: map[string]ginkeycloak.ServiceRole{
			"mock-azp": {Roles: []string{"data_manager"}},
		},
	}

	router := gin.Default()
	router.POST("/sequencing/batch", PostSequencingExperimentBatchHandler(repo, auth))
	body := `
		{
			"sequencing_experiments": [
				{
					"aliquot": "aliquot1",
					"sample_organization_code": "org1",
					"submitter_sample_id": "sample1",
					"sequencing_lab_code": "org1", 
					"platform_code": "illumina", 
					"experimental_strategy_code": "wgs",
					"sequencing_read_technology_code": "short_read",
					"status_code": "completed",
					"run_date": "2023-10-01T00:00:00Z"
				}
			]
		}`
	req, _ := http.NewRequest(http.MethodPost, "/sequencing/batch", bytes.NewBuffer([]byte(body)))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusAccepted, w.Code)
	var response types.CreateBatchResponse
	err := json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.Equal(t, "sequencing_experiment", response.BatchType)
	assert.Equal(t, "testuser", response.Username)
	assert.Equal(t, "PENDING", response.Status)
}

func TestPostSequencingExperimentBatchHandler_Success_NoRunDate(t *testing.T) {
	gin.SetMode(gin.TestMode)
	repo := &MockBatchRepository{
		CreateBatchFunc: func(payload any, batchType string, username string, dryRun bool) (*types.Batch, error) {
			return &types.Batch{
				ID:        uuid.NewString(),
				BatchType: batchType,
				Status:    "PENDING",
				CreatedOn: time.Now(),
				Username:  username,
				DryRun:    dryRun,
			}, nil
		},
	}
	auth := &testutils.MockAuth{
		Username: "testuser",
		Azp:      "mock-azp",
		ResourceAccess: map[string]ginkeycloak.ServiceRole{
			"mock-azp": {Roles: []string{"data_manager"}},
		},
	}

	router := gin.Default()
	router.POST("/sequencing/batch", PostSequencingExperimentBatchHandler(repo, auth))
	body := `
		{
			"sequencing_experiments": [
				{
					"aliquot": "aliquot1",
					"sample_organization_code": "org1",
					"submitter_sample_id": "sample1",
					"sequencing_lab_code": "org1", 
					"platform_code": "illumina", 
					"experimental_strategy_code": "wgs",
					"sequencing_read_technology_code": "short_read",
					"status_code": "completed"
				}
			]
		}`
	req, _ := http.NewRequest(http.MethodPost, "/sequencing/batch", bytes.NewBuffer([]byte(body)))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusAccepted, w.Code)
	var response types.CreateBatchResponse
	err := json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.Equal(t, "sequencing_experiment", response.BatchType)
	assert.Equal(t, "testuser", response.Username)
	assert.Equal(t, "PENDING", response.Status)
}

func TestPostSequencingExperimentBatchHandler_Forbidden(t *testing.T) {
	gin.SetMode(gin.TestMode)
	repo := &MockBatchRepository{}
	auth := &testutils.MockAuth{
		Id:       "testuser-id",
		Username: "testuser",
		Azp:      "mock-azp",
		ResourceAccess: map[string]ginkeycloak.ServiceRole{
			"mock-azp": {Roles: []string{"some_other_role"}},
		},
	}

	router := gin.Default()
	router.POST("/sequencing/batch", PostSequencingExperimentBatchHandler(repo, auth))
	body := `
		{
			"sequencing_experiments": [
				{
					"aliquot": "aliquot1",
					"sample_organization_code": "org1",
					"submitter_sample_id": "sample1",
					"sequencing_lab_code": "org1", 
					"platform_code": "illumina", 
					"experimental_strategy_code": "wgs",
					"sequencing_read_technology_code": "short_read",
					"status_code": "completed"
				}
			]
		}`
	req, _ := http.NewRequest(http.MethodPost, "/sequencing/batch", bytes.NewBuffer([]byte(body)))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusForbidden, w.Code)
}

func TestPostSequencingExperimentBatchHandler_ValidationError(t *testing.T) {
	gin.SetMode(gin.TestMode)
	repo := &MockBatchRepository{
		CreateBatchFunc: func(payload any, batchType string, username string, dryRun bool) (*types.Batch, error) {
			return &types.Batch{
				ID:        uuid.NewString(),
				BatchType: batchType,
				Status:    "PENDING",
				CreatedOn: time.Now(),
				Username:  username,
				DryRun:    dryRun,
			}, nil
		},
	}
	auth := &testutils.MockAuth{
		Id:       "testuser-id",
		Username: "testuser",
		Azp:      "mock-azp",
		ResourceAccess: map[string]ginkeycloak.ServiceRole{
			"mock-azp": {Roles: []string{"data_manager"}},
		},
	}

	router := gin.Default()
	router.POST("/sequencing/batch", PostSequencingExperimentBatchHandler(repo, auth))
	body := `
		{
			"sequencing_experiments": [
				{
					"aliquot": "aliquot1",
					"sample_organization_code": "org1",
					"submitter_sample_id": "sample1",
					"sequencing_lab_code": "org1", 
					"platform_code": "illumina", 
					"experimental_strategy_code": "unknown_strategy",
					"sequencing_read_technology_code": "short_read",	
					"status_code": "completed"
				}
			]
		}`
	req, _ := http.NewRequest(http.MethodPost, "/sequencing/batch", bytes.NewBuffer([]byte(body)))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func TestPostSequencingExperimentBatchHandler_RunDate_Empty(t *testing.T) {
	gin.SetMode(gin.TestMode)
	repo := &MockBatchRepository{
		CreateBatchFunc: func(payload any, batchType string, username string, dryRun bool) (*types.Batch, error) {
			return &types.Batch{
				ID:        uuid.NewString(),
				BatchType: batchType,
				Status:    "PENDING",
				CreatedOn: time.Now(),
				Username:  username,
				DryRun:    dryRun,
			}, nil
		},
	}
	auth := &testutils.MockAuth{
		Id:       "testuser-id",
		Username: "testuser",
		Azp:      "mock-azp",
		ResourceAccess: map[string]ginkeycloak.ServiceRole{
			"mock-azp": {Roles: []string{"data_manager"}},
		},
	}

	router := gin.Default()
	router.POST("/sequencing/batch", PostSequencingExperimentBatchHandler(repo, auth))
	body := `
		{
			"sequencing_experiments": [
				{
					"aliquot": "aliquot1",
					"sample_organization_code": "org1",
					"submitter_sample_id": "sample1",
					"sequencing_lab_code": "org1", 
					"platform_code": "illumina", 
					"experimental_strategy_code": "unknown_strategy",
					"sequencing_read_technology_code": "short_read",	
					"status_code": "completed",
					"run_date": ""	
				}
			]
		}`
	req, _ := http.NewRequest(http.MethodPost, "/sequencing/batch", bytes.NewBuffer([]byte(body)))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func TestPostSequencingExperimentBatchHandler_RunDate_Invalid(t *testing.T) {
	gin.SetMode(gin.TestMode)
	repo := &MockBatchRepository{
		CreateBatchFunc: func(payload any, batchType string, username string, dryRun bool) (*types.Batch, error) {
			return &types.Batch{
				ID:        uuid.NewString(),
				BatchType: batchType,
				Status:    "PENDING",
				CreatedOn: time.Now(),
				Username:  username,
				DryRun:    dryRun,
			}, nil
		},
	}
	auth := &testutils.MockAuth{
		Id:       "testuser-id",
		Username: "testuser",
		Azp:      "mock-azp",
		ResourceAccess: map[string]ginkeycloak.ServiceRole{
			"mock-azp": {Roles: []string{"data_manager"}},
		},
	}

	router := gin.Default()
	router.POST("/sequencing/batch", PostSequencingExperimentBatchHandler(repo, auth))
	body := `
		{
			"sequencing_experiments": [
				{
					"aliquot": "aliquot1",
					"sample_organization_code": "org1",
					"submitter_sample_id": "sample1",
					"sequencing_lab_code": "org1", 
					"platform_code": "illumina", 
					"experimental_strategy_code": "unknown_strategy",
					"sequencing_read_technology_code": "short_read",	
					"status_code": "completed",
					"run_date": "2026-10-15"	
				}
			]
		}`
	req, _ := http.NewRequest(http.MethodPost, "/sequencing/batch", bytes.NewBuffer([]byte(body)))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func TestPostSequencingExperimentBatchHandler_EmptySequencingExperiments(t *testing.T) {
	gin.SetMode(gin.TestMode)
	repo := &MockBatchRepository{
		CreateBatchFunc: func(payload any, batchType string, username string, dryRun bool) (*types.Batch, error) {
			return &types.Batch{
				ID:        uuid.NewString(),
				BatchType: batchType,
				Status:    "PENDING",
				CreatedOn: time.Now(),
				Username:  username,
				DryRun:    dryRun,
			}, nil
		},
	}
	auth := &testutils.MockAuth{
		Username: "testuser",
		Azp:      "mock-azp",
		ResourceAccess: map[string]ginkeycloak.ServiceRole{
			"mock-azp": {Roles: []string{"data_manager"}},
		},
	}

	router := gin.Default()
	router.POST("/sequencing/batch", PostSequencingExperimentBatchHandler(repo, auth))
	body := `{"sequencing_experiments": []}`
	req, _ := http.NewRequest(http.MethodPost, "/sequencing/batch", bytes.NewBuffer([]byte(body)))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}
