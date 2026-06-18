package server

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/internal/utils"
)

// PostSampleBatchHandler
// @Summary Create a new sample batch
// @Id postSampleBatch
// @Description Create a new sample batch
// @Tags samples
// @Security bearerauth
// @Param tenant path string true "Tenant code"
// @Param dry_run query boolean false "Dry Run" default(false)
// @Param message	body		types.CreateSampleBatchBody	true	"Create Body"
// @Accept json
// @Produce json
// @Success 202 {object} types.CreateBatchResponse
// @Failure 400 {object} types.ApiError
// @Failure 401 {object} types.ApiError
// @Failure 403 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Header 500 {string} X-Correlation-ID "Unique id correlating this error with the server-side log entry"
// @Router /{tenant}/samples/batch [post]
func PostSampleBatchHandler(repo batchCreator, auth utils.Auth) gin.HandlerFunc {
	return func(c *gin.Context) {
		var (
			body       types.CreateSampleBatchBody
			queryParam types.CreateBatchQueryParam
		)
		if err := c.ShouldBindJSON(&body); err != nil {
			HandleValidationError(c, err)
			return
		}
		if err := c.ShouldBindQuery(&queryParam); err != nil {
			HandleValidationError(c, err)
			return
		}

		username, err := auth.RetrieveUsernameFromToken(c)
		if err != nil {
			HandleError(c, err)
			return
		}

		tenant, err := GetTenant(c)
		if err != nil {
			HandleError(c, err)
			return
		}

		batch, err := repo.CreateBatch(c.Request.Context(), *tenant, body.Samples, "sample", *username, queryParam.DryRun)
		if err != nil {
			HandleError(c, err)
			return
		}

		response := types.CreateBatchResponse{
			ID:        batch.ID,
			BatchType: batch.BatchType,
			Status:    batch.Status,
			CreatedOn: batch.CreatedOn,
			Username:  batch.Username,
			DryRun:    batch.DryRun,
		}
		c.JSON(http.StatusAccepted, response)
	}
}
