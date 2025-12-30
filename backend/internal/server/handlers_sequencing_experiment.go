package server

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/repository"
)

// GetSequencing handles retrieving a sequencing by its id
// @Summary Get a Sequencing
// @Id getSequencing
// @Description Retrieve Sequencing data for a given sequence ID
// @Tags sequencing
// @Security bearerauth
// @Param seq_id path string true "Sequence ID"
// @Produce json
// @Success 200 {object} types.Sequencing
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Router /sequencing/{seq_id} [get]
func GetSequencing(repo repository.SequencingDAO) gin.HandlerFunc {
	return func(c *gin.Context) {
		seqID, err := strconv.Atoi(c.Param("seq_id"))
		if err != nil {
			HandleNotFoundError(c, "seq_id")
			return
		}
		sequencing, err := repo.GetSequencing(seqID)
		if err != nil {
			HandleError(c, err)
			return
		}
		if sequencing == nil {
			HandleNotFoundError(c, "sequencing")
			return
		}
		c.JSON(http.StatusOK, sequencing)
	}
}

// GetSequencingExperimentDetailByIdHandler handles get sequencing experiment details by id
// @Summary Get types.SequencingExperimentDetail by id
// @Id getSequencingExperimentDetailById
// @Description Get types.SequencingExperimentDetail by id
// @Tags sequencing
// @Security bearerauth
// @Param seq_id path string true "Seq ID"
// @Produce json
// @Success 200 {object} types.SequencingExperimentDetail
// @Failure 400 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Router /sequencing/{seq_id}/details [get]
func GetSequencingExperimentDetailByIdHandler(repo repository.SequencingExperimentDAO) gin.HandlerFunc {
	return func(c *gin.Context) {
		seqId, errSeqId := strconv.Atoi(c.Param("seq_id"))
		if errSeqId != nil {
			HandleNotFoundError(c, "seq_id")
			return
		}
		seqExpDetail, err := repo.GetSequencingExperimentDetailById(seqId)
		if err != nil {
			HandleError(c, err)
			return
		}

		c.JSON(http.StatusOK, seqExpDetail)
	}
}
