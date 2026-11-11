package server

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/internal/utils"
)

// PostPatientBatchHandler
// @Summary Create a new patient batch
// @Id postPatientBatch
// @Description Create a new patient batch
// @Tags patients
// @Security bearerauth
// @Param tenant path string true "Tenant code"
// @Param dry_run query boolean false "Dry Run" default(false)
// @Param message	body		types.CreatePatientBatchBody	true	"Create Body"
// @Accept json
// @Produce json
// @Success 202 {object} types.CreateBatchResponse
// @Failure 400 {object} types.ApiError
// @Failure 401 {object} types.ApiError
// @Failure 403 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Header 500 {string} X-Correlation-ID "Unique id correlating this error with the server-side log entry"
// @Router /{tenant}/patients/batch [post]
func PostPatientBatchHandler(repo batchCreator, auth utils.Auth) gin.HandlerFunc {
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

		batch, err := repo.CreateBatch(c.Request.Context(), *tenant, body.Patients, types.CreatePatientBatchType, *username, queryParam.DryRun)
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

// PutPatientBatchHandler
// @Summary Update existing patients (batch)
// @Id putPatientBatch
// @Description Update existing patients — each patient is looked up by (patient_organization_code, submitter_patient_id).
// @Description A patient not found is reported as a validation error and left untouched.
// @Tags patients
// @Security bearerauth
// @Param tenant path string true "Tenant code"
// @Param dry_run query boolean false "Dry Run" default(false)
// @Param message	body		types.CreatePatientBatchBody	true	"Update Body"
// @Accept json
// @Produce json
// @Success 202 {object} types.CreateBatchResponse
// @Failure 400 {object} types.ApiError
// @Failure 401 {object} types.ApiError
// @Failure 403 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Header 500 {string} X-Correlation-ID "Unique id correlating this error with the server-side log entry"
// @Router /{tenant}/patients/batch [put]
func PutPatientBatchHandler(repo batchCreator, auth utils.Auth) gin.HandlerFunc {
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

		batch, err := repo.CreateBatch(c.Request.Context(), *tenant, body.Patients, types.UpdatePatientBatchType, *username, queryParam.DryRun)
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
