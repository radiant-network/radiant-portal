package server

import (
	"context"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/types"
)

type batchReader interface {
	GetBatchByID(ctx context.Context, batchId string) (*types.Batch, error)
}

// GetBatchHandler
// @Summary Retrieve a batch by ID
// @Id getBatch
// @Description Retrieve a batch by ID
// @Tags batches
// @Security bearerauth
// @Produce json
// @Param tenant path string true "Tenant code"
// @Param batchId path string true "Batch ID"
// @Success 200 {object} types.GetBatchResponse
// @Failure 400 {object} types.ApiError
// @Failure 401 {object} types.ApiError
// @Failure 403 {object} types.ApiError
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Header 500 {string} X-Correlation-ID "Unique id correlating this error with the server-side log entry"
// @Router /{tenant}/batches/{batchId} [get]
func GetBatchHandler(repo batchReader) gin.HandlerFunc {
	return func(c *gin.Context) {
		batchID := c.Param("batch_id")
		batch, err := repo.GetBatchByID(c.Request.Context(), batchID)
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
			Report:     batch.Report,
		}
		c.JSON(http.StatusOK, response)
	}
}
