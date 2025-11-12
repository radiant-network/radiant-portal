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
	"github.com/stretchr/testify/assert"
	"github.com/tbaehler/gin-keycloak/pkg/ginkeycloak"
)

type MockAuth struct {
	Id             string
	Username       string
	Azp            string
	ResourceAccess map[string]ginkeycloak.ServiceRole
	Error          error
}

func (m *MockAuth) RetrieveUserIdFromToken(c *gin.Context) (*string, error) {
	if m.Error != nil {
		return nil, m.Error
	}
	return &m.Id, nil
}

func (m *MockAuth) RetrieveUsernameFromToken(c *gin.Context) (*string, error) {
	if m.Error != nil {
		return nil, m.Error
	}
	return &m.Username, nil
}

func (m *MockAuth) RetrieveAzpFromToken(c *gin.Context) (*string, error) {
	if m.Error != nil {
		return nil, m.Error
	}
	return &m.Azp, nil
}

func (m *MockAuth) RetrieveResourceAccessFromToken(c *gin.Context) (*map[string]ginkeycloak.ServiceRole, error) {
	if m.Error != nil {
		return nil, m.Error
	}
	return &m.ResourceAccess, nil
}

func TestPostPatientBatchHandler_Success(t *testing.T) {
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
	auth := &MockAuth{
		Id:       "testuser-id",
		Username: "testuser",
		Azp:      "radiant",
		ResourceAccess: map[string]ginkeycloak.ServiceRole{
			"radiant": {Roles: []string{"data_manager"}},
		},
	}

	router := gin.Default()
	router.POST("/patients/batch", PostPatientBatchHandler(repo, auth))
	body := `{"patients": [{"organization_patient_id": "p1", "organization_patient_id_type": "MR", "organization_code": "org1", "life_status_code": "alive", "sex_code": "male", "date_of_birth": "2000-01-01"}]}`
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
	assert.Equal(t, "PENDING", response.Status)
}

func TestPostPatientBatchHandler_Unauthorized(t *testing.T) {
	gin.SetMode(gin.TestMode)
	repo := &MockBatchRepository{}
	auth := &MockAuth{
		Id:       "testuser-id",
		Username: "testuser",
		Azp:      "radiant",
		ResourceAccess: map[string]ginkeycloak.ServiceRole{
			"radiant": {Roles: []string{"some_other_role"}},
		},
	}

	router := gin.Default()
	router.POST("/patients/batch", PostPatientBatchHandler(repo, auth))
	body := `{"patients": [{"organization_patient_id": "p1", "organization_patient_id_type": "MR", "organization_code": "org1", "life_status_code": "alive", "sex_code": "male", "date_of_birth": "2000-01-01"}]}`
	req, _ := http.NewRequest(http.MethodPost, "/patients/batch", bytes.NewBuffer([]byte(body)))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusUnauthorized, w.Code)
}

func TestPostPatientBatchHandler_ValidationError(t *testing.T) {
	gin.SetMode(gin.TestMode)
	repo := &MockBatchRepository{}
	auth := &MockAuth{
		Id:       "testuser-id",
		Username: "testuser",
		Azp:      "radiant",
		ResourceAccess: map[string]ginkeycloak.ServiceRole{
			"radiant": {Roles: []string{"data_manager"}},
		},
	}

	router := gin.Default()
	router.POST("/patients/batch", PostPatientBatchHandler(repo, auth))
	body := `{"patients": [{"organization_patient_id": "p1", "life_status_code": "alive", "sex_code": "male", "date_of_birth": "2000-01-01"}]}`
	req, _ := http.NewRequest(http.MethodPost, "/patients/batch", bytes.NewBuffer([]byte(body)))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}
