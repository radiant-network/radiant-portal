package main

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"github.com/minio/minio-go/v7"
	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/repository/starrocks"
	"github.com/radiant-network/radiant-api/internal/server"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/internal/utils"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

// putCNVProfileFiles uploads the bigwig fixtures as the DRAGEN files of sequencing 70, a genome:
// its copy ratio has 1,000 bins.
func putCNVProfileFiles(t *testing.T, env *testutils.Env) {
	t.Helper()
	bucket := "cqdg-prod-file-workspace"
	require.NoError(t, env.ObjectStore.Client.MakeBucket(env.Ctx, bucket, minio.MakeBucketOptions{}))
	put := func(key string, content []byte) {
		_, err := env.ObjectStore.Client.PutObject(env.Ctx, bucket, key, bytes.NewReader(content), int64(len(content)), minio.PutObjectOptions{})
		require.NoError(t, err)
	}
	for key, fixture := range map[string]string{"dragen/NA12892/NA12892.tn.bw": "zoomed.bw", "dragen/NA12892/NA12892.hard-filtered.baf.bw": "baf.bw"} {
		content, err := os.ReadFile("../../test/data/bigwig/" + fixture)
		require.NoError(t, err)
		put(key, content)
	}
	put("dragen/NA12892/NA12892.roh.bed", []byte("chr1\t100\t900\t1.57\t63\t0\n"))
}

// Sequencing 70 is a genome: its profile is an overview, read from the object store by range.
func Test_GetGermlineCNVProfileHandler_GenomeOverview(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple", ObjectStore: true}, func(t *testing.T, env *testutils.Env) {
		putCNVProfileFiles(t, env)
		store, err := utils.NewS3Store()
		require.NoError(t, err)
		repo := starrocks.NewCNVProfileRepository(database.StarrocksDB{DB: env.Starrocks})
		router := tenantRouter()
		router.GET("/:tenant/occurrences/germline/cnv/:case_id/:seq_id/:task_id/profile", server.GetGermlineCNVProfileHandler(repo, store))

		req, _ := http.NewRequest("GET", "/radiant/occurrences/germline/cnv/70/70/71/profile", nil)
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		require.Equal(t, http.StatusOK, w.Code)
		var profile types.CNVProfile
		require.NoError(t, json.Unmarshal(w.Body.Bytes(), &profile))
		// The baf has a chromosome 2 that the copy ratio has not: the profile lists both.
		assert.Equal(t, []types.CNVProfileChromosome{{Name: "1", Size: 100_000}, {Name: "2", Size: 500}}, profile.Chromosomes)
		assert.Equal(t, &types.CNVProfileOverview{CopyRatioStride: 1, BAFStride: 1, RegionMaxSpan: types.CNVProfileRegionMaxSpan}, profile.Overview)
		require.Len(t, profile.CopyRatio, 1)
		assert.Len(t, profile.CopyRatio[0].Positions, 1000)
		assert.Equal(t, []types.CNVProfileTrack{
			{Chromosome: "1", Positions: []int{10, 150}, Values: []float64{0.5, 0.25}},
			{Chromosome: "2", Positions: []int{20}, Values: []float64{1}},
		}, profile.BAF)
		assert.Equal(t, []types.CNVProfileROH{{Chromosome: "1", Start: 100, End: 900, Score: 1.57, NbHom: 63, NbHet: 0}}, profile.ROH)
		assert.Len(t, profile.Cytobands, 2)
	})
}

func Test_GetGermlineCNVProfileRegionHandler(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple", ObjectStore: true}, func(t *testing.T, env *testutils.Env) {
		putCNVProfileFiles(t, env)
		store, err := utils.NewS3Store()
		require.NoError(t, err)
		repo := starrocks.NewCNVProfileRepository(database.StarrocksDB{DB: env.Starrocks})
		router := tenantRouter()
		router.GET("/:tenant/occurrences/germline/cnv/:case_id/:seq_id/:task_id/profile/region", server.GetGermlineCNVProfileRegionHandler(repo, store))

		req, _ := http.NewRequest("GET", "/radiant/occurrences/germline/cnv/70/70/71/profile/region?chromosome=1&start=120&end=320", nil)
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.JSONEq(t, `{
			"chromosome":"1","start":120,"end":320,
			"copy_ratio":{"chromosome":"1","positions":[150,250,350],"values":[1.072,1.149,1.231]},
			"baf":{"chromosome":"1","positions":[150],"values":[0.25]}
		}`, w.Body.String())
	})
}

// Sequencing 75 is an exome whose calling task 83 wrote no igv file.
func Test_GetGermlineCNVProfileHandler_NoProfileFiles(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := starrocks.NewCNVProfileRepository(database.StarrocksDB{DB: env.Starrocks})
		router := tenantRouter()
		router.GET("/:tenant/occurrences/germline/cnv/:case_id/:seq_id/:task_id/profile", server.GetGermlineCNVProfileHandler(repo, nil))

		req, _ := http.NewRequest("GET", "/radiant/occurrences/germline/cnv/72/75/83/profile", nil)
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusNotFound, w.Code)
		assert.JSONEq(t, `{"status":404,"message":"cnv profile files not found","detail":{"missing":["copy_ratio","baf"]}}`, w.Body.String())
	})
}
