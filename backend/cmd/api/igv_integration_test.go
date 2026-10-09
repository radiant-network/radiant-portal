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
	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/repository/starrocks"
	"github.com/radiant-network/radiant-api/internal/server"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

// getIGV calls GET /igv/{caseID} and returns the decoded response.
func getIGV(t *testing.T, router *gin.Engine, caseID int) types.IGVTracks {
	t.Helper()

	req, _ := http.NewRequest("GET", fmt.Sprintf("/radiant/igv/%d", caseID), bytes.NewBuffer([]byte("{}")))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)
	require.Equal(t, http.StatusOK, w.Code)

	var actual types.IGVTracks
	require.NoError(t, json.Unmarshal(w.Body.Bytes(), &actual))
	return actual
}

// assertIGVTracks compares tracks positionally: PrepareIgvTracks returns them in a deterministic
// order (leading track first, then by Name). Presigned URLs are compared on their prefix.
func assertIGVTracks(t *testing.T, expected []types.IGVTrackEnriched, actual []types.IGVTrackEnriched) {
	t.Helper()

	require.Equal(t, len(expected), len(actual))
	for i := range actual {
		a, e := actual[i], expected[i]
		assert.Equal(t, e.SequencingExperimentId, a.SequencingExperimentId)
		assert.Equal(t, e.PatientId, a.PatientId)
		assert.Equal(t, e.FamilyRole, a.FamilyRole)
		assert.Equal(t, e.Sex, a.Sex)
		assert.Equal(t, e.Type, a.Type)
		assert.Equal(t, e.Format, a.Format)
		assert.True(t, strings.HasPrefix(a.URL, e.URL), "URL prefix mismatch at %d: got %s", i, a.URL)
		if e.IndexURL == "" {
			assert.Empty(t, a.IndexURL)
		} else {
			assert.True(t, strings.HasPrefix(a.IndexURL, e.IndexURL), "IndexURL prefix mismatch at %d: got %s", i, a.IndexURL)
		}
		assert.Equal(t, e.Name, a.Name)
	}
}

func Test_GetIGVByCaseIdHandler(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple", Postgres: testutils.ExclusivePostgres, ObjectStore: true}, func(t *testing.T, env *testutils.Env) {
		_ = os.Setenv("AWS_REGION", "us-east-1")
		_ = os.Setenv("AWS_ENDPOINT_URL", env.ObjectStore.Client.EndpointURL().String())
		_ = os.Setenv("AWS_ACCESS_KEY_ID", "access")
		_ = os.Setenv("AWS_SECRET_ACCESS_KEY", "secret")
		_ = os.Setenv("AWS_USE_SSL", "false")

		igvRepo := starrocks.NewIGVRepository(database.StarrocksDB{DB: env.Starrocks})
		casesRepo := starrocks.NewCasesRepository(database.StarrocksDB{DB: env.Starrocks})
		router := tenantRouter()
		router.GET("/:tenant/igv/:case_id", server.GetIGVHandler(igvRepo, casesRepo, nil, ""))

		url := func(key string) string {
			return fmt.Sprintf("http://%s/cqdg-prod-file-workspace/%s", env.ObjectStore.Endpoint, key)
		}
		proband := types.IGVTrackEnriched{SequencingExperimentId: 70, PatientId: 3, FamilyRole: "proband", Sex: "male"}
		mother := types.IGVTrackEnriched{SequencingExperimentId: 71, PatientId: 1, FamilyRole: "mother", Sex: "female"}
		father := types.IGVTrackEnriched{SequencingExperimentId: 72, PatientId: 2, FamilyRole: "father", Sex: "male"}
		tumor := types.IGVTrackEnriched{SequencingExperimentId: 74, PatientId: 62, FamilyRole: "proband", Sex: "female"}
		normal := types.IGVTrackEnriched{SequencingExperimentId: 73, PatientId: 62, FamilyRole: "proband", Sex: "female"}
		track := func(member types.IGVTrackEnriched, dataType, format, name, file, index string) types.IGVTrackEnriched {
			member.Type, member.Format, member.Name, member.URL = dataType, format, name, url(file)
			if index != "" {
				member.IndexURL = url(index)
			}
			return member
		}

		t.Run("germline trio (case 70)", func(t *testing.T) {
			actual := getIGV(t, router, 70)

			assertIGVTracks(t, []types.IGVTrackEnriched{
				track(proband, "alignment", "cram", "Reads: S13224 proband", "sarek/preprocessing/recalibrated/NA12892/NA12892.recal.cram", "sarek/preprocessing/recalibrated/NA12892/NA12892.recal.crai"),
				track(mother, "alignment", "cram", "Reads: S13225 mother", "sarek/preprocessing/recalibrated/NA12891/NA12891.recal.cram", "sarek/preprocessing/recalibrated/NA12891/NA12891.recal.crai"),
				track(father, "alignment", "cram", "Reads: S13226 father", "sarek/preprocessing/recalibrated/NA12878/NA12878.recal.cram", "sarek/preprocessing/recalibrated/NA12878/NA12878.recal.crai"),
			}, actual.Alignment)
			// The family-level annotation VCF (task 86, no index) gives no track.
			assertIGVTracks(t, []types.IGVTrackEnriched{
				track(proband, "gcnv", "vcf", "CNVs: S13224 proband", "dragen/NA12892/NA12892.cnv.vcf.gz", "dragen/NA12892/NA12892.cnv.vcf.gz.tbi"),
				track(mother, "gcnv", "vcf", "CNVs: S13225 mother", "dragen/NA12891/NA12891.cnv.vcf.gz", "dragen/NA12891/NA12891.cnv.vcf.gz.tbi"),
			}, actual.CNV)
			// The mother has no Seg file; NA12892.coverage.bw has an unknown suffix.
			assertIGVTracks(t, []types.IGVTrackEnriched{
				track(proband, "igv", "bw", "Seg: S13224 proband", "dragen/NA12892/NA12892.seg.bw", ""),
			}, actual.Seg)
			assertIGVTracks(t, []types.IGVTrackEnriched{
				track(proband, "igv", "bw", "BAF: S13224 proband", "dragen/NA12892/NA12892.hard-filtered.baf.bw", ""),
				track(mother, "igv", "bw", "BAF: S13225 mother", "dragen/NA12891/NA12891.hard-filtered.baf.bw", ""),
			}, actual.BAF)
			assertIGVTracks(t, []types.IGVTrackEnriched{
				track(proband, "igv", "bed", "ROH: S13224 proband", "dragen/NA12892/NA12892.roh.bed", ""),
				track(mother, "igv", "bed", "ROH: S13225 mother", "dragen/NA12891/NA12891.roh.bed", ""),
			}, actual.ROH)
			assertIGVTracks(t, []types.IGVTrackEnriched{
				track(proband, "igv", "bed", "Capture targets", "dragen/NA12892/NA12892.HyperExomeV2_combined_targets.bed", ""),
			}, actual.CaptureTargets)
			assert.Empty(t, actual.PublicTracks)
		})

		t.Run("somatic (case 71)", func(t *testing.T) {
			actual := getIGV(t, router, 71)

			assertIGVTracks(t, []types.IGVTrackEnriched{
				track(tumor, "alignment", "cram", "Reads: SRX1091647 tumoral", "sarek/preprocessing/SRX1091647-T.recal.cram", "sarek/preprocessing/SRX1091647-T.recal.cram.crai"),
				track(normal, "alignment", "cram", "Reads: SRX1091646 normal", "sarek/preprocessing/SRX1091646-N.recal.cram", "sarek/preprocessing/SRX1091646-N.recal.cram.crai"),
			}, actual.Alignment)
			assertIGVTracks(t, []types.IGVTrackEnriched{
				track(tumor, "scnv", "vcf", "CNVs: SRX1091647 tumoral", "dragen/SRX1091647-T/SRX1091647-T.cnv.vcf.gz", "dragen/SRX1091647-T/SRX1091647-T.cnv.vcf.gz.tbi"),
			}, actual.CNV)
			assertIGVTracks(t, []types.IGVTrackEnriched{
				track(tumor, "igv", "bw", "Seg: SRX1091647 tumoral", "dragen/SRX1091647-T/SRX1091647-T.seg.bw", ""),
				track(normal, "igv", "bw", "Seg: SRX1091646 normal", "dragen/SRX1091646-N/SRX1091646-N.seg.bw", ""),
			}, actual.Seg)
			assert.Empty(t, actual.BAF)
			assert.Empty(t, actual.ROH)
			assertIGVTracks(t, []types.IGVTrackEnriched{
				track(tumor, "igv", "bed", "Capture targets", "dragen/SRX1091647-T/SRX1091647-T_targets.bed", ""),
			}, actual.CaptureTargets)
		})

		t.Run("public tracks", func(t *testing.T) {
			publicRouter := tenantRouter()
			publicRouter.GET("/:tenant/igv/:case_id", server.GetIGVHandler(igvRepo, casesRepo, nil, "s3://tracks/igv/"))

			actual := getIGV(t, publicRouter, 70)

			assert.Len(t, actual.PublicTracks, 11)
			clinvar := actual.PublicTracks["clinvar"]
			assert.True(t, strings.HasPrefix(clinvar.URL, fmt.Sprintf("http://%s/tracks/igv/clinvar.vcf.gz?", env.ObjectStore.Endpoint)), "got %s", clinvar.URL)
			assert.True(t, strings.HasPrefix(clinvar.IndexURL, fmt.Sprintf("http://%s/tracks/igv/clinvar.vcf.gz.tbi?", env.ObjectStore.Endpoint)), "got %s", clinvar.IndexURL)
			assert.NotZero(t, clinvar.URLExpireAt)
			assert.NotZero(t, clinvar.IndexURLExpireAt)
		})
	})
}
