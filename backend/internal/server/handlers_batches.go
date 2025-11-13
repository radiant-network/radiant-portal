package server

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/repository"
	"github.com/radiant-network/radiant-api/internal/types"
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
		batchID := c.Param("batch_id")
		batch, err := repo.GetBatchByID(batchID)
		if err != nil {
			HandleError(c, err)
			return
		}
		if batch == nil {
			HandleNotFoundError(c, "batch_id")
			return
		}

		response := types.GetBatchResponse{
			ID:         batch.ID,
			DryRun:     batch.DryRun,
			BatchType:  batch.BatchType,
			Status:     batch.Status,
			CreatedOn:  batch.CreatedOn,
			StartedOn:  batch.StartedOn,
			FinishedOn: batch.FinishedOn,
			Username:   batch.Username,
			Summary:    batch.Summary,
			Errors:     batch.Errors,
		}
		c.JSON(http.StatusOK, response)
	}
}
