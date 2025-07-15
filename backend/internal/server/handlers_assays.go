package server

import (
	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/repository"
	"net/http"
	"strconv"
)

// GetAssayBySeqIdHandler handles get assay by seq_id
// @Summary Get types.Assay by seq_id
// @Id getAssayBySeqId
// @Description Get types.Assay by seq_id
// @Tags assays
// @Security bearerauth
// @Param seq_id path string true "Seq ID"
// @Produce json
// @Success 200 {object} types.Assay
// @Failure 400 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Router /assays/{seq_id} [get]
func GetAssayBySeqIdHandler(repo repository.AssaysDAO) gin.HandlerFunc {
	return func(c *gin.Context) {
		seqId, errSeqId := strconv.Atoi(c.Param("seq_id"))
		if errSeqId != nil {
			HandleNotFoundError(c, "seq_id")
			return
		}
		assay, err := repo.GetAssayBySeqId(seqId)
		if err != nil {
			HandleError(c, err)
			return
		}

		c.JSON(http.StatusOK, assay)
	}
}
