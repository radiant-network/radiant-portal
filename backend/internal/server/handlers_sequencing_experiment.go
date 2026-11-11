package server

import (
	"context"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/types"
)

type seqExpDetailReader interface {
	GetSequencingExperimentDetailById(ctx context.Context, seqId int) (*types.SequencingExperimentDetail, error)
}

// GetSequencingExperimentDetailByIdHandler handles get sequencing experiment details by id
// @Summary Get types.SequencingExperimentDetail by id
// @Id getSequencingExperimentDetailById
// @Description Get types.SequencingExperimentDetail by id
// @Tags sequencing
// @Security bearerauth
// @Param tenant path string true "Tenant code"
// @Param seq_id path string true "Seq ID"
// @Produce json
// @Success 200 {object} types.SequencingExperimentDetail
// @Failure 400 {object} types.ApiError
// @Failure 401 {object} types.ApiError
// @Failure 403 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Header 500 {string} X-Correlation-ID "Unique id correlating this error with the server-side log entry"
// @Router /{tenant}/sequencing/{seq_id}/details [get]
func GetSequencingExperimentDetailByIdHandler(repo seqExpDetailReader) gin.HandlerFunc {
	return func(c *gin.Context) {
		seqId, errSeqId := strconv.Atoi(c.Param("seq_id"))
		if errSeqId != nil {
			HandleNotFoundError(c, "seq_id")
			return
		}
		seqExpDetail, err := repo.GetSequencingExperimentDetailById(c.Request.Context(), seqId)
		if err != nil {
			HandleError(c, err)
			return
		}

		c.JSON(http.StatusOK, seqExpDetail)
	}
}
