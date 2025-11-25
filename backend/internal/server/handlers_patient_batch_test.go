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

func TestPostPatientBatchHandler_Success(t *testing.T) {
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
	router.POST("/patients/batch", PostPatientBatchHandler(repo, auth))
	body := `{"patients": [{"submitter_patient_id": "p1", "submitter_patient_id_type": "MR", "patient_organization_code": "org1", "life_status_code": "alive", "sex_code": "male", "date_of_birth": "2000-01-01"}]}`
	req, _ := http.NewRequest(http.MethodPost, "/patients/batch", bytes.NewBuffer([]byte(body)))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusAccepted, w.Code)
	var response types.CreateBatchResponse
	err := json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.Equal(t, "patient", response.BatchType)
	assert.Equal(t, "testuser", response.Username)
	assert.Equal(t, types.BatchStatusPending, response.Status)
}

func TestPostPatientBatchHandler_Forbidden(t *testing.T) {
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
	router.POST("/patients/batch", PostPatientBatchHandler(repo, auth))
	body := `{"patients": [{"submitter_patient_id": "p1", "submitter_patient_id_type": "MR", "patient_organization_code": "org1", "life_status_code": "alive", "sex_code": "male", "date_of_birth": "2000-01-01"}]}`
	req, _ := http.NewRequest(http.MethodPost, "/patients/batch", bytes.NewBuffer([]byte(body)))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusForbidden, w.Code)
}

func TestPostPatientBatchHandler_ValidationError(t *testing.T) {
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
	router.POST("/patients/batch", PostPatientBatchHandler(repo, auth))
	body := `{"patients": [{"submitter_patient_id": "p1", "life_status_code": "alive", "sex_code": "male", "date_of_birth": "2000-01-01"}]}`
	req, _ := http.NewRequest(http.MethodPost, "/patients/batch", bytes.NewBuffer([]byte(body)))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func TestPostPatientBatchHandler_EmptyPatients(t *testing.T) {
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
	router.POST("/patients/batch", PostPatientBatchHandler(repo, auth))
	body := `{"patients": []}`
	req, _ := http.NewRequest(http.MethodPost, "/patients/batch", bytes.NewBuffer([]byte(body)))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}
