package server

import (
	"context"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/internal/utils"
)

type batchCreator interface {
	CreateBatch(ctx context.Context, tenantCode string, payload any, batchType string, username string, dryRun bool) (*types.Batch, error)
}

// PostCaseBatchHandler
// @Summary Create a new case batch
// @Id postCaseBatch
// @Description Create a new case batch
// @Tags cases
// @Security bearerauth
// @Param tenant path string true "Tenant code"
// @Param dry_run query boolean false "Dry Run" default(false)
// @Param message	body		types.CreateCaseBatchBody	true	"Create Body"
// @Accept json
// @Produce json
// @Success 202 {object} types.CreateBatchResponse
// @Failure 400 {object} types.ApiError
// @Failure 401 {object} types.ApiError
// @Failure 403 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Header 500 {string} X-Correlation-ID "Unique id correlating this error with the server-side log entry"
// @Router /{tenant}/cases/batch [post]
func PostCaseBatchHandler(repo batchCreator, auth utils.Auth) gin.HandlerFunc {
	return func(c *gin.Context) {
		var (
			body       types.CreateCaseBatchBody
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

		batch, err := repo.CreateBatch(c.Request.Context(), *tenant, body.Cases, types.CreateCaseBatchType, *username, queryParam.DryRun)
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

// PatchCaseBatchHandler
// @Summary Partially update existing cases (batch)
// @Id patchCaseBatch
// @Description Partially updates existing cases — see the request body for updatable fields.
// @Description Each case is looked up by (project_code, submitter_case_id); CASE-012 is returned if not found.
// @Description Array fields are appended, not replaced.
// @Tags cases
// @Security bearerauth
// @Param tenant path string true "Tenant code"
// @Param dry_run query boolean false "Dry Run" default(false)
// @Param message	body		types.PatchCaseBatchBody	true	"Attach Body"
// @Accept json
// @Produce json
// @Success 202 {object} types.CreateBatchResponse
// @Failure 400 {object} types.ApiError
// @Failure 401 {object} types.ApiError
// @Failure 403 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Header 500 {string} X-Correlation-ID "Unique id correlating this error with the server-side log entry"
// @Router /{tenant}/cases/batch [patch]
func PatchCaseBatchHandler(repo batchCreator, auth utils.Auth) gin.HandlerFunc {
	return func(c *gin.Context) {
		var (
			body       types.PatchCaseBatchBody
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

		batch, err := repo.CreateBatch(c.Request.Context(), *tenant, body.Cases, types.PatchCaseBatchType, *username, queryParam.DryRun)
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

// PutCaseBatchHandler
// @Summary Update existing cases (batch)
// @Id putCaseBatch
// @Description Replaces a case's scalar fields and clinical patient data (family, observations,
// @Description family history). Each case is looked up by (project_code, submitter_case_id);
// @Description CASE-013 is returned if not found. Sequencing experiments and tasks are
// @Description merge-if-present: attached when the body carries them, left untouched when omitted.
// @Tags cases
// @Security bearerauth
// @Param tenant path string true "Tenant code"
// @Param dry_run query boolean false "Dry Run" default(false)
// @Param message	body		types.UpdateCaseBatchBody	true	"Update Body"
// @Accept json
// @Produce json
// @Success 202 {object} types.CreateBatchResponse
// @Failure 400 {object} types.ApiError
// @Failure 401 {object} types.ApiError
// @Failure 403 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Header 500 {string} X-Correlation-ID "Unique id correlating this error with the server-side log entry"
// @Router /{tenant}/cases/batch [put]
func PutCaseBatchHandler(repo batchCreator, auth utils.Auth) gin.HandlerFunc {
	return func(c *gin.Context) {
		var (
			body       types.UpdateCaseBatchBody
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

		batch, err := repo.CreateBatch(c.Request.Context(), *tenant, body.Cases, types.UpdateCaseBatchType, *username, queryParam.DryRun)
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
