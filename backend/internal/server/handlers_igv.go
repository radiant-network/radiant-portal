package server

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/repository"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/internal/utils"
)

type igvReader interface {
	GetIGV(caseID int) ([]types.IGVTrack, error)
}

type caseTypeReader interface {
	GetCaseType(caseID int) (string, error)
}

// GetIGVHandler
// @Summary Get IGV
// @Id getIGV
// @Description Get IGV tracks for a case
// @Tags igv
// @Security bearerauth
// @Param tenant path string true "Tenant code"
// @Param case_id path string true "Case ID"
// @Produce json
// @Success 200 {object} types.IGVTracks
// @Failure 401 {object} types.ApiError
// @Failure 403 {object} types.ApiError
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Router /{tenant}/igv/{case_id} [get]
func GetIGVHandler(igvRepo igvReader, casesRepo caseTypeReader, presigner utils.PreSigner) gin.HandlerFunc {
	if presigner == nil {
		presigner = utils.NewS3PreSigner()
	}

	return func(c *gin.Context) {
		caseID, err := strconv.Atoi(c.Param("case_id"))
		if err != nil {
			HandleError(c, err)
			return
		}

		caseType, err := casesRepo.GetCaseType(caseID)
		if err != nil {
			HandleError(c, err)
			return
		}

		internalIgvTracks, err := igvRepo.GetIGV(caseID)
		if err != nil {
			HandleError(c, err)
			return
		}

		if len(internalIgvTracks) == 0 {
			HandleNotFoundError(c, "case_id")
			return
		}

		var igvEnrichedTracks *types.IGVTracks
		switch caseType {
		case "germline":
			igvEnrichedTracks, err = repository.PrepareGermlineIgvTracks(internalIgvTracks, presigner)
		case "somatic":
			igvEnrichedTracks, err = repository.PrepareSomaticIgvTracks(internalIgvTracks, presigner)
		default:
			HandleError(c, fmt.Errorf("unsupported case type: %s", caseType))
			return
		}
		if err != nil {
			HandleError(c, err)
			return
		}

		c.JSON(http.StatusOK, igvEnrichedTracks)
	}
}
