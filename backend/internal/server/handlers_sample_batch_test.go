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

func TestPostSampleBatchHandler_Success(t *testing.T) {
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
	auth := &testutils.MockAuth{
		Username: "testuser",
		Azp:      "mock-azp",
		ResourceAccess: map[string]ginkeycloak.ServiceRole{
			"mock-azp": {Roles: []string{"data_manager"}},
		},
	}

	router := gin.Default()
	router.POST("/samples/batch", PostSampleBatchHandler(repo, auth))
	body := `{"samples": [{"organization_patient_id": "p1", "organization_code": "org1", "type_code": "blood", "histology_code": "tumoral", "submitter_sample_id": "s1", "submitter_organization_code": "org1"}]}`
	req, _ := http.NewRequest(http.MethodPost, "/samples/batch", bytes.NewBuffer([]byte(body)))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusAccepted, w.Code)
	var response types.CreateBatchResponse
	err := json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.Equal(t, "sample", response.BatchType)
	assert.Equal(t, "testuser", response.Username)
	assert.Equal(t, types.BatchStatusPending, response.Status)
}

func TestPostSampleBatchHandler_Forbidden(t *testing.T) {
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
	router.POST("/samples/batch", PostSampleBatchHandler(repo, auth))
	body := `{"samples": [{"organization_patient_id": "p1", "organization_code": "org1", "type_code": "blood", "histology_code": "tumoral", "submitter_sample_id": "s1", "submitter_organization_code": "org1"}]}`
	req, _ := http.NewRequest(http.MethodPost, "/samples/batch", bytes.NewBuffer([]byte(body)))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusForbidden, w.Code)
}

func TestPostSampleBatchHandler_ValidationError(t *testing.T) {
	gin.SetMode(gin.TestMode)
	repo := &MockBatchRepository{}
	auth := &testutils.MockAuth{
		Id:       "testuser-id",
		Username: "testuser",
		Azp:      "mock-azp",
		ResourceAccess: map[string]ginkeycloak.ServiceRole{
			"mock-azp": {Roles: []string{"data_manager"}},
		},
	}

	router := gin.Default()
	router.POST("/samples/batch", PostSampleBatchHandler(repo, auth))
	body := `{"samples": [{"organization_patient_id": "", "organization_code": "org1", "type_code": "blood", "histology_code": "tumorsal", "submitter_sample_id": "s1", "submitter_organization_code": "org1"}]}`
	req, _ := http.NewRequest(http.MethodPost, "/samples/batch", bytes.NewBuffer([]byte(body)))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func TestPostSampleBatchHandler_EmptySamples(t *testing.T) {
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
	auth := &testutils.MockAuth{
		Username: "testuser",
		Azp:      "mock-azp",
		ResourceAccess: map[string]ginkeycloak.ServiceRole{
			"mock-azp": {Roles: []string{"data_manager"}},
		},
	}

	router := gin.Default()
	router.POST("/samples/batch", PostSampleBatchHandler(repo, auth))
	body := `{"samples": []}`
	req, _ := http.NewRequest(http.MethodPost, "/samples/batch", bytes.NewBuffer([]byte(body)))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}
