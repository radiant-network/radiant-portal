package server

import (
	"net/http"
	"slices"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/repository"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/internal/utils"
)

// PostPatientBatchHandler
// @Summary Create a new patient batch
// @Id postPatientBatch
// @Description Create a new patient batch
// @Tags patients
// @Security bearerauth
// @Accept json
// @Produce json
// @Success 202 {object} types.CreateBatchResponse
// @Failure 400 {object} types.ApiError
// @Failure 401 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Router /patients/batch [post]
func PostPatientBatchHandler(repo repository.BatchRepositoryDAO, auth utils.Auth) gin.HandlerFunc {
	return func(c *gin.Context) {
		var (
			body       types.CreatePatientBatchBody
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
		azp, err := auth.RetrieveAzpFromToken(c)
		if err != nil || azp == nil {
			HandleError(c, err)
			return
		}
		resourceAccess, err := auth.RetrieveResourceAccessFromToken(c)
		if err != nil || resourceAccess == nil {
			HandleError(c, err)
			return
		}
		roles, ok := (*resourceAccess)[*azp]
		if !ok || !slices.Contains(roles.Roles, "data_manager") {
			HandleUnauthorizedError(c)
			return
		}

		username, err := auth.RetrieveUsernameFromToken(c)
		if err != nil {
			HandleError(c, err)
			return
		}

		batch, err := repo.CreateBatch(body.Patients, "patient", *username, queryParam.DryRun)
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
