package server

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/repository"
	"github.com/radiant-network/radiant-api/internal/utils"
)

// GetIGVHandler
// @Summary Get IGV
// @Id getIGV
// @Description Get IGV tracks for a sequencing experiment
// @Tags igv
// @Security bearerauth
// @Param seq_id path string true "Sequencing ID"
// @Produce json
// @Success 200 {object} types.IGVTracks
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Router /igv/{seq_id} [get]
func GetIGVHandler(repo repository.IGVRepositoryDAO, presigner utils.S3PreSigner) gin.HandlerFunc {
	if presigner == nil {
		presigner = &utils.DefaultS3PreSigner{}
	}

	return func(c *gin.Context) {
		sequencingId, err := strconv.Atoi(c.Param("seq_id"))
		if err != nil {
			HandleError(c, err)
			return
		}
		internalIgvTracks, err := repo.GetIGV(sequencingId)
		if err != nil {
			HandleError(c, err)
			return
		}

		if len(internalIgvTracks) == 0 {
			HandleNotFoundError(c, "seq_id")
			return
		}

		igvEnrichedTracks, err := repository.PrepareIgvTracks(internalIgvTracks, presigner)
		if err != nil {
			HandleError(c, err)
			return
		}

		c.JSON(http.StatusOK, igvEnrichedTracks)
	}
}
