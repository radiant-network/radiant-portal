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
	"github.com/stretchr/testify/require"
	"gorm.io/gorm"
)

// assertGetIGV calls GET /igv/{caseID} and asserts the response matches expected.
// PrepareIgvTracks returns tracks in a deterministic order (leading track first,
// then by PatientId, then by Name), so we can compare positionally.
func assertGetIGV(t *testing.T, router *gin.Engine, caseID int, expected []types.IGVTrackEnriched) {
	t.Helper()

	req, _ := http.NewRequest("GET", fmt.Sprintf("/igv/%d", caseID), bytes.NewBuffer([]byte("{}")))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)
	assert.Equal(t, http.StatusOK, w.Code)

	var actual types.IGVTracks
	require.NoError(t, json.Unmarshal(w.Body.Bytes(), &actual))

	assert.Equal(t, len(expected), len(actual.Alignment))
	for i := range actual.Alignment {
		a, e := actual.Alignment[i], expected[i]
		assert.Equal(t, e.PatientId, a.PatientId)
		assert.Equal(t, e.FamilyRole, a.FamilyRole)
		assert.Equal(t, e.Sex, a.Sex)
		assert.Equal(t, e.Type, a.Type)
		assert.Equal(t, e.Format, a.Format)
		assert.True(t, strings.HasPrefix(a.URL, e.URL), "URL prefix mismatch at %d: got %s", i, a.URL)
		assert.True(t, strings.HasPrefix(a.IndexURL, e.IndexURL), "IndexURL prefix mismatch at %d: got %s", i, a.IndexURL)
		assert.Equal(t, e.Name, a.Name)
	}
}

func Test_GetIGVByCaseIdHandler(t *testing.T) {
	testutils.SequentialTestWithMinIOPostgresStarrocks(t, "simple", func(t *testing.T, client *minio.Client, endpoint string, _ *gorm.DB, starrocks *gorm.DB) {
		_ = os.Setenv("AWS_REGION", "us-east-1")
		_ = os.Setenv("AWS_ENDPOINT_URL", client.EndpointURL().String())
		_ = os.Setenv("AWS_ACCESS_KEY_ID", "access")
		_ = os.Setenv("AWS_SECRET_ACCESS_KEY", "secret")
		_ = os.Setenv("AWS_USE_SSL", "false")

		repo := repository.NewIGVRepository(starrocks)
		router := gin.Default()
		router.GET("/igv/:case_id", server.GetIGVHandler(repo, nil))

		t.Run("germline trio (case 70)", func(t *testing.T) {
			assertGetIGV(t, router, 70, []types.IGVTrackEnriched{
				{
					PatientId:  3,
					FamilyRole: "proband",
					Sex:        "male",
					Type:       "alignment",
					Format:     "cram",
					URL:        fmt.Sprintf("http://%s/cqdg-prod-file-workspace/sarek/preprocessing/recalibrated/NA12892/NA12892.recal.cram", endpoint),
					IndexURL:   fmt.Sprintf("http://%s/cqdg-prod-file-workspace/sarek/preprocessing/recalibrated/NA12892/NA12892.recal.crai", endpoint),
					Name:       "Reads: S13224 proband",
				},
				{
					PatientId:  1,
					FamilyRole: "mother",
					Sex:        "female",
					Type:       "alignment",
					Format:     "cram",
					URL:        fmt.Sprintf("http://%s/cqdg-prod-file-workspace/sarek/preprocessing/recalibrated/NA12891/NA12891.recal.cram", endpoint),
					IndexURL:   fmt.Sprintf("http://%s/cqdg-prod-file-workspace/sarek/preprocessing/recalibrated/NA12891/NA12891.recal.crai", endpoint),
					Name:       "Reads: S13225 mother",
				},
				{
					PatientId:  2,
					FamilyRole: "father",
					Sex:        "male",
					Type:       "alignment",
					Format:     "cram",
					URL:        fmt.Sprintf("http://%s/cqdg-prod-file-workspace/sarek/preprocessing/recalibrated/NA12878/NA12878.recal.cram", endpoint),
					IndexURL:   fmt.Sprintf("http://%s/cqdg-prod-file-workspace/sarek/preprocessing/recalibrated/NA12878/NA12878.recal.crai", endpoint),
					Name:       "Reads: S13226 father",
				},
			})
		})

		t.Run("somatic (case 71)", func(t *testing.T) {
			assertGetIGV(t, router, 71, []types.IGVTrackEnriched{
				{
					PatientId:  62,
					FamilyRole: "proband",
					Sex:        "female",
					Type:       "alignment",
					Format:     "cram",
					URL:        fmt.Sprintf("http://%s/cqdg-prod-file-workspace/sarek/preprocessing/SRX1091647-T.recal.cram", endpoint),
					IndexURL:   fmt.Sprintf("http://%s/cqdg-prod-file-workspace/sarek/preprocessing/SRX1091647-T.recal.cram.crai", endpoint),
					Name:       "Reads: SRX1091647 tumoral",
				},
				{
					PatientId:  62,
					FamilyRole: "proband",
					Sex:        "female",
					Type:       "alignment",
					Format:     "cram",
					URL:        fmt.Sprintf("http://%s/cqdg-prod-file-workspace/sarek/preprocessing/SRX1091646-N.recal.cram", endpoint),
					IndexURL:   fmt.Sprintf("http://%s/cqdg-prod-file-workspace/sarek/preprocessing/SRX1091646-N.recal.cram.crai", endpoint),
					Name:       "Reads: SRX1091646 normal",
				},
			})
		})
	})
}
