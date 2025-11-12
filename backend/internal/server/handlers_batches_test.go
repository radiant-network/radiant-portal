package server

import (
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/stretchr/testify/assert"
)

type MockBatchRepository struct {
	CreateBatchFunc    func(payload any, batchType string, username string, dryRun bool) (*types.Batch, error)
	GetBatchByIDFunc   func(batchId string) (*types.Batch, error)
	ClaimNextBatchFunc func() (*types.Batch, error)
}

func (m *MockBatchRepository) CreateBatch(payload any, batchType string, username string, dryRun bool) (*types.Batch, error) {
	if m.CreateBatchFunc != nil {
		return m.CreateBatchFunc(payload, batchType, username, dryRun)
	}
	return nil, errors.New("CreateBatchFunc not implemented")
}

func (m *MockBatchRepository) GetBatchByID(batchId string) (*types.Batch, error) {
	if m.GetBatchByIDFunc != nil {
		return m.GetBatchByIDFunc(batchId)
	}
	return nil, errors.New("GetBatchByIDFunc not implemented")
}

func (m *MockBatchRepository) ClaimNextBatch() (*types.Batch, error) {
	if m.ClaimNextBatchFunc != nil {
		return m.ClaimNextBatchFunc()
	}
	return nil, errors.New("ClaimNextBatchFunc not implemented")
}

func Test_GetBatchHandler_Success(t *testing.T) {
	gin.SetMode(gin.TestMode)

	repo := &MockBatchRepository{
		GetBatchByIDFunc: func(batchId string) (*types.Batch, error) {
			return &types.Batch{
				ID:        batchId,
				BatchType: "test-batch-type",
				Username:  "test-username",
				Status:    "PENDING",
			}, nil
		},
	}

	router := gin.Default()
	router.GET("/batches/:batch_id", GetBatchHandler(repo))

	req, _ := http.NewRequest("GET", "/batches/test-batch-id", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.Contains(t, w.Body.String(), `"id":"test-batch-id"`)
	assert.Contains(t, w.Body.String(), `"username":"test-username"`)
}

func Test_GetBatchHandler_NotFound(t *testing.T) {
	gin.SetMode(gin.TestMode)

	repo := &MockBatchRepository{
		GetBatchByIDFunc: func(batchId string) (*types.Batch, error) {
			return nil, nil
		},
	}

	router := gin.Default()
	router.GET("/batches/:batch_id", GetBatchHandler(repo))

	req, _ := http.NewRequest("GET", "/batches/non-existent-id", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusNotFound, w.Code)
	assert.Contains(t, w.Body.String(), "not found")
}
