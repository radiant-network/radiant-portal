package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"os"
	"strings"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/minio/minio-go/v7"
	"github.com/radiant-network/radiant-api/internal/repository"
	"github.com/radiant-network/radiant-api/internal/server"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

func Test_GetIGVBySeqIdHandler(t *testing.T) {
	testutils.ParallelTestWithAll(t, "simple", func(t *testing.T, client *minio.Client, endpoint string, postgres *gorm.DB, starrocks *gorm.DB) {
		// Setup env vars for S3
		_ = os.Setenv("AWS_REGION", "us-east-1")
		_ = os.Setenv("AWS_ENDPOINT_URL", client.EndpointURL().String())
		_ = os.Setenv("AWS_ACCESS_KEY_ID", "access")
		_ = os.Setenv("AWS_SECRET_ACCESS_KEY", "secret")

		repo := repository.NewIGVRepository(starrocks)
		router := gin.Default()
		router.GET("/igv/:seq_id", server.GetIGVHandler(repo, nil))

		req, _ := http.NewRequest("GET", "/igv/1", bytes.NewBuffer([]byte("{}")))
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		var actual types.IGVTracks
		if err := json.Unmarshal(w.Body.Bytes(), &actual); err != nil {
			assert.NoError(t, err)
		}
		expected := types.IGVTracks{
			Alignment: []types.IGVTrackEnriched{
				{
					PatientId:        3,
					FamilyRole:       "proband",
					Sex:              "male",
					Type:             "alignment",
					Format:           "cram",
					URL:              fmt.Sprintf("http://%s/cqdg-prod-file-workspace/sarek/preprocessing/recalibrated/NA12878/NA12878.recal.cram", endpoint),
					URLExpireAt:      0,
					IndexURL:         fmt.Sprintf("http://%s/cqdg-prod-file-workspace/sarek/preprocessing/recalibrated/NA12878/NA12878.recal.crai", endpoint),
					IndexURLExpireAt: 0,
					Name:             "Reads: S13224 proband",
				},
				{
					PatientId:        1,
					FamilyRole:       "mother",
					Sex:              "female",
					Type:             "alignment",
					Format:           "cram",
					URL:              fmt.Sprintf("http://%s/cqdg-prod-file-workspace/sarek/preprocessing/recalibrated/NA12891/NA12891.recal.cram", endpoint),
					URLExpireAt:      0,
					IndexURL:         fmt.Sprintf("http://%s/cqdg-prod-file-workspace/sarek/preprocessing/recalibrated/NA12891/NA12891.recal.crai", endpoint),
					IndexURLExpireAt: 0,
					Name:             "Reads: S13225 mother",
				},
				{
					PatientId:        2,
					FamilyRole:       "father",
					Sex:              "male",
					Type:             "alignment",
					Format:           "cram",
					URL:              fmt.Sprintf("http://%s/cqdg-prod-file-workspace/sarek/preprocessing/recalibrated/NA12892/NA12892.recal.cram", endpoint),
					URLExpireAt:      0,
					IndexURL:         fmt.Sprintf("http://%s/cqdg-prod-file-workspace/sarek/preprocessing/recalibrated/NA12892/NA12892.recal.crai", endpoint),
					IndexURLExpireAt: 0,
					Name:             "Reads: S13226 father",
				},
			},
		}

		assert.Equal(t, http.StatusOK, w.Code)
		assert.Equal(t, len(actual.Alignment), 3)
		for i := range len(actual.Alignment) {
			assert.Equal(t, expected.Alignment[i].PatientId, actual.Alignment[i].PatientId)
			assert.Equal(t, expected.Alignment[i].FamilyRole, actual.Alignment[i].FamilyRole)
			assert.Equal(t, expected.Alignment[i].Sex, actual.Alignment[i].Sex)
			assert.Equal(t, expected.Alignment[i].Type, actual.Alignment[i].Type)
			assert.Equal(t, expected.Alignment[i].Format, actual.Alignment[i].Format)
			assert.True(t, strings.HasPrefix(actual.Alignment[i].URL, expected.Alignment[i].URL))
			assert.True(t, strings.HasPrefix(actual.Alignment[i].IndexURL, expected.Alignment[i].IndexURL))
			assert.Equal(t, expected.Alignment[i].Name, actual.Alignment[i].Name)
		}
	})
}
