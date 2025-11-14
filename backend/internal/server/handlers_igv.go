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
// @Description Get IGV tracks for a case
// @Tags igv
// @Security bearerauth
// @Param case_id path string true "Case ID"
// @Produce json
// @Success 200 {object} types.IGVTracks
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Router /igv/{case_id} [get]
func GetIGVHandler(repo repository.IGVRepositoryDAO, presigner utils.S3PreSigner) gin.HandlerFunc {
	if presigner == nil {
		presigner = &utils.DefaultS3PreSigner{}
	}

	return func(c *gin.Context) {
		caseID, err := strconv.Atoi(c.Param("case_id"))
		if err != nil {
			HandleError(c, err)
			return
		}
		internalIgvTracks, err := repo.GetIGV(caseID)
		if err != nil {
			HandleError(c, err)
			return
		}

		if len(internalIgvTracks) == 0 {
			HandleNotFoundError(c, "case_id")
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
