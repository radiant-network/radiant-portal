package server

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/repository"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/internal/utils"
)

// PostSequencingExperimentBatchHandler
// @Summary Create a new sequencing experiment batch
// @Id postSequencingExperimentBatch
// @Description Create a new sequencing experiment batch
// @Tags sequencing
// @Security bearerauth
// @Param dry_run query boolean false "Dry Run"
// @Param message	body		types.CreateSequencingExperimentBatchBody	true	"Create Body"
// @Accept json
// @Produce json
// @Success 202 {object} types.CreateBatchResponse
// @Failure 400 {object} types.ApiError
// @Failure 403 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Router /sequencing/batch [post]
func PostSequencingExperimentBatchHandler(repo repository.BatchRepositoryDAO, auth utils.Auth) gin.HandlerFunc {
	return func(c *gin.Context) {
		var (
			body       types.CreateSequencingExperimentBatchBody
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

		// Check if user has data_manager role
		hasRole, err := auth.UserHasRole(c, "data_manager")
		if err != nil {
			HandleError(c, err)
			return
		}
		if !hasRole {
			HandleForbiddenError(c)
			return
		}

		username, err := auth.RetrieveUsernameFromToken(c)
		if err != nil {
			HandleError(c, err)
			return
		}

		batch, err := repo.CreateBatch(body.SequencingExperiments, "sequencing_experiment", *username, queryParam.DryRun)
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
