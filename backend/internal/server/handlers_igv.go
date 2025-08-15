package server

import (
	"fmt"
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/repository"
	"github.com/radiant-network/radiant-api/internal/types"
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

		igvEnrichedTracks, err := prepareIgvTracks(internalIgvTracks, presigner)
		if err != nil {
			HandleError(c, err)
			return
		}

		c.JSON(http.StatusOK, igvEnrichedTracks)
	}
}

func prepareIgvTracks(internalTracks []repository.IGVTrack, presigner utils.S3PreSigner) (*types.IGVTracks, error) {
	result := types.IGVTracks{}

	grouped := map[string]types.IGVTrackEnriched{}

	for _, r := range internalTracks {
		key := strings.Join([]string{
			r.DataTypeCode,
			strconv.Itoa(r.PatientId),
		}, "|")

		enriched, exists := grouped[key]
		if !exists {
			enriched = types.IGVTrackEnriched{
				PatientId:  r.PatientId,
				Type:       r.DataTypeCode,
				Sex:        r.SexCode,
				FamilyRole: r.FamilyRole,
			}
		}

		presigned, err := presigner.GenerateS3PreSignedURL(r.URL)
		if err != nil {
			return nil, err
		}

		if r.FormatCode == "cram" {
			enriched.Name = fmt.Sprintf("Reads: %s %s", r.SampleId, r.FamilyRole)
			enriched.Format = r.FormatCode
			enriched.URL = presigned.URL
			enriched.URLExpireAt = presigned.URLExpireAt
		} else if r.FormatCode == "crai" {
			enriched.IndexURL = presigned.URL
			enriched.IndexURLExpireAt = presigned.URLExpireAt
		}

		grouped[key] = enriched
	}

	for _, track := range grouped {
		switch track.Type {
		case "alignment":
			// Ensure the proband is always first in the alignment list
			if track.FamilyRole == "proband" {
				result.Alignment = append([]types.IGVTrackEnriched{track}, result.Alignment...)
			} else {
				result.Alignment = append(result.Alignment, track)
			}
		}
	}

	return &result, nil
}
