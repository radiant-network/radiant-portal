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

func TestPostSampleBatchHandler_Success(t *testing.T) {
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
	router.POST("/:tenant/samples/batch", PostSampleBatchHandler(repo, auth))
	body := `{"samples": [{"submitter_patient_id": "p1", "patient_organization_code": "org1", "type_code": "blood", "histology_code": "tumoral", "submitter_sample_id": "s1", "sample_organization_code": "org1"}]}`
	req, _ := http.NewRequest(http.MethodPost, "/radiant/samples/batch", bytes.NewBuffer([]byte(body)))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusAccepted, w.Code)
	var response types.CreateBatchResponse
	err := json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.Equal(t, "create_sample", response.BatchType)
	assert.Equal(t, "testuser", response.Username)
	assert.Equal(t, types.BatchStatusPending, response.Status)
}

func TestPostSampleBatchHandler_ValidationError(t *testing.T) {
	gin.SetMode(gin.TestMode)
	repo := &MockBatchRepository{}
	auth := &testutils.MockAuth{}

	router := tenantRouter()
	router.POST("/:tenant/samples/batch", PostSampleBatchHandler(repo, auth))
	body := `{"samples": [{"submitter_patient_id": "", "patient_organization_code": "org1", "type_code": "blood", "histology_code": "tumorsal", "submitter_sample_id": "s1", "sample_organization_code": "org1"}]}`
	req, _ := http.NewRequest(http.MethodPost, "/radiant/samples/batch", bytes.NewBuffer([]byte(body)))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func TestPutSampleBatchHandler_Success(t *testing.T) {
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
	router.PUT("/:tenant/samples/batch", PutSampleBatchHandler(repo, auth))
	body := `{"samples": [{"submitter_patient_id": "p1", "patient_organization_code": "org1", "type_code": "blood", "histology_code": "tumoral", "submitter_sample_id": "s1", "sample_organization_code": "org1"}]}`
	req, _ := http.NewRequest(http.MethodPut, "/radiant/samples/batch", bytes.NewBuffer([]byte(body)))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusAccepted, w.Code)
	var response types.CreateBatchResponse
	err := json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.Equal(t, types.UpdateSampleBatchType, response.BatchType)
	assert.Equal(t, "testuser", response.Username)
	assert.Equal(t, types.BatchStatusPending, response.Status)
}

func TestPutSampleBatchHandler_ValidationError(t *testing.T) {
	gin.SetMode(gin.TestMode)
	repo := &MockBatchRepository{}
	auth := &testutils.MockAuth{}

	router := tenantRouter()
	router.PUT("/:tenant/samples/batch", PutSampleBatchHandler(repo, auth))
	body := `{"samples": [{"submitter_patient_id": "", "patient_organization_code": "org1", "type_code": "blood", "histology_code": "tumorsal", "submitter_sample_id": "s1", "sample_organization_code": "org1"}]}`
	req, _ := http.NewRequest(http.MethodPut, "/radiant/samples/batch", bytes.NewBuffer([]byte(body)))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func TestPutSampleBatchHandler_RepoError(t *testing.T) {
	gin.SetMode(gin.TestMode)
	repo := &MockBatchRepository{
		CreateBatchFunc: func(ctx context.Context, tenantCode string, payload any, batchType string, username string, dryRun bool) (*types.Batch, error) {
			return nil, errors.New("boom")
		},
	}
	auth := &testutils.MockAuth{Username: "testuser"}

	router := tenantRouter()
	router.PUT("/:tenant/samples/batch", PutSampleBatchHandler(repo, auth))
	body := `{"samples": [{"submitter_patient_id": "p1", "patient_organization_code": "org1", "type_code": "blood", "histology_code": "tumoral", "submitter_sample_id": "s1", "sample_organization_code": "org1"}]}`
	req, _ := http.NewRequest(http.MethodPut, "/radiant/samples/batch", bytes.NewBuffer([]byte(body)))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusInternalServerError, w.Code)
	assert.JSONEq(t, `{"status":500,"message":"Internal Server Error"}`, w.Body.String())
}

func TestPostSampleBatchHandler_EmptySamples(t *testing.T) {
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
	auth := &testutils.MockAuth{}

	router := tenantRouter()
	router.POST("/:tenant/samples/batch", PostSampleBatchHandler(repo, auth))
	body := `{"samples": []}`
	req, _ := http.NewRequest(http.MethodPost, "/radiant/samples/batch", bytes.NewBuffer([]byte(body)))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}
