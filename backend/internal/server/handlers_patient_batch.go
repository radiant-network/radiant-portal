package server

import (
	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/repository"
)

// PostPatientBatchHandler
// @Summary Create a new patient batch
// @Id postPatientBatch
// @Description Create a new patient batch
// @Tags patients
// @Security bearerauth
// @Accept json
// @Produce json
// @Success 202 {object} types.Batch
// @Failure 400 {object} types.ApiError
// @Failure 401 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Router /patients/batch [post]
func PostPatientBatchHandler(repo repository.BatchRepositoryDAO) gin.HandlerFunc {
	return func(c *gin.Context) {

	}
}
