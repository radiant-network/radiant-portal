package server

import (
	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/repository"
)

// GetBatchHandler
// @Summary Retrieve a batch by ID
// @Id getBatch
// @Description Retrieve a batch by ID
// @Tags batches
// @Security bearerauth
// @Accept json
// @Produce json
// @Param batchId path string true "Batch ID"
// @Success 200 {object} types.GetBatchResponse
// @Failure 400 {object} types.ApiError
// @Failure 401 {object} types.ApiError
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Router /batches/{batchId} [get]
func GetBatchHandler(repo repository.BatchRepositoryDAO) gin.HandlerFunc {
	return func(c *gin.Context) {

	}
}
