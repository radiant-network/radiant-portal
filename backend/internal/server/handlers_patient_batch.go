package server

import (
	"net/http"

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
			queryParam types.CreatePatientBatchQueryParam
		)
		if err := c.ShouldBindJSON(&body); err != nil {
			HandleValidationError(c, err)
			return
		}
		if err := c.ShouldBindQuery(&queryParam); err != nil {
			HandleValidationError(c, err)
			return
		}

		// resourceAccess, err := auth.RetrieveResourceAccessFromToken(c)
		// if err != nil {
		// 	HandleError(c, err)
		// 	return
		// }

		// username, err := auth.RetrieveUsernameFromToken(c)
		// if err != nil {
		// 	HandleError(c, err)
		// 	return
		// }

		patientsBatch := &types.PatientsBatch{
			Patients: body.Patients,
		}
		batch, err := repo.CreateBatch(patientsBatch, "", queryParam.DryRun)
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
