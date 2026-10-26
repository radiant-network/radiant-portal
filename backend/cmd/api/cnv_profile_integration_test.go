package main

import (
	"bytes"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"github.com/minio/minio-go/v7"
	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/repository/starrocks"
	"github.com/radiant-network/radiant-api/internal/server"
	"github.com/radiant-network/radiant-api/internal/utils"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

// putCNVProfileFiles uploads the bigwig fixtures as the DRAGEN files of sequencing 70.
func putCNVProfileFiles(t *testing.T, env *testutils.Env) {
	t.Helper()
	bucket := "cqdg-prod-file-workspace"
	require.NoError(t, env.ObjectStore.Client.MakeBucket(env.Ctx, bucket, minio.MakeBucketOptions{}))
	put := func(key string, content []byte) {
		_, err := env.ObjectStore.Client.PutObject(env.Ctx, bucket, key, bytes.NewReader(content), int64(len(content)), minio.PutObjectOptions{})
		require.NoError(t, err)
	}
	for key, fixture := range map[string]string{"dragen/NA12892/NA12892.tn.bw": "tn.bw", "dragen/NA12892/NA12892.hard-filtered.baf.bw": "baf.bw"} {
		content, err := os.ReadFile("../../test/data/bigwig/" + fixture)
		require.NoError(t, err)
		put(key, content)
	}
	put("dragen/NA12892/NA12892.roh.bed", []byte("chr1\t100\t900\t1.57\t63\t0\n"))
}

func Test_GetGermlineCNVProfileHandler(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple", ObjectStore: true}, func(t *testing.T, env *testutils.Env) {
		t.Setenv("AWS_ENDPOINT_URL", env.ObjectStore.Endpoint)
		t.Setenv("AWS_ACCESS_KEY_ID", "admin")
		t.Setenv("AWS_SECRET_ACCESS_KEY", "password")
		t.Setenv("AWS_USE_SSL", "false")
		putCNVProfileFiles(t, env)

		store, err := utils.NewS3Store()
		require.NoError(t, err)
		repo := starrocks.NewCNVProfileRepository(database.StarrocksDB{DB: env.Starrocks})
		router := tenantRouter()
		router.GET("/:tenant/occurrences/germline/cnv/:case_id/:seq_id/:task_id/profile", server.GetGermlineCNVProfileHandler(repo, store))

		req, _ := http.NewRequest("GET", "/radiant/occurrences/germline/cnv/70/70/71/profile", nil)
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.JSONEq(t, `{
			"chromosomes": [{"name":"1","size":1000},{"name":"2","size":500},{"name":"X","size":300}],
			"copy_ratio": [
				{"chromosome":"1","positions":[50,150],"values":[1,2]},
				{"chromosome":"2","positions":[50],"values":[0.5]},
				{"chromosome":"X","positions":[],"values":[]}
			],
			"baf": [
				{"chromosome":"1","positions":[10,150],"values":[0.5,0.25]},
				{"chromosome":"2","positions":[20],"values":[1]}
			],
			"segments": [],
			"roh": [{"chromosome":"1","start":100,"end":900,"score":1.57,"nb_hom":63,"nb_het":0}],
			"cytobands": [
				{"chromosome":"1","cytoband":"p1.1","start":10000,"end":10200,"gie_stain":"gneg"},
				{"chromosome":"1","cytoband":"p1.2","start":10500,"end":10800,"gie_stain":"gpos25"}
			]
		}`, w.Body.String())
	})
}

func Test_GetGermlineCNVProfileHandler_NoProfileFiles(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := starrocks.NewCNVProfileRepository(database.StarrocksDB{DB: env.Starrocks})
		router := tenantRouter()
		router.GET("/:tenant/occurrences/germline/cnv/:case_id/:seq_id/:task_id/profile", server.GetGermlineCNVProfileHandler(repo, nil))

		req, _ := http.NewRequest("GET", "/radiant/occurrences/germline/cnv/1/1/1/profile", nil)
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusNotFound, w.Code)
		assert.JSONEq(t, `{"status":404,"message":"cnv profile files not found","detail":{"missing":["copy_ratio","baf"]}}`, w.Body.String())
	})
}

func Test_GetGeneTrackHandler(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := starrocks.NewGenesRepository(database.StarrocksDB{DB: env.Starrocks})
		router := tenantRouter()
		router.GET("/:tenant/genes/track", server.GetGeneTrackHandler(repo))

		req, _ := http.NewRequest("GET", "/radiant/genes/track?chromosome=1&start=10120&end=10130", nil)
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.JSONEq(t, `[
			{"gene_id":"ENSG00000000003","symbol":"TSPAN6","chromosome":"1","start":10000,"end":10200,"strand":"-","biotype":"protein_coding","description":"tetraspanin 6","exons":[{"start":10000,"end":10100}]},
			{"gene_id":"ENSG00000000005","symbol":"TNMD","chromosome":"1","start":10000,"end":20000,"strand":"+","biotype":"protein_coding","description":"tenomodulin","exons":[{"start":10000,"end":10100},{"start":10150,"end":10250},{"start":10450,"end":10750}]}
		]`, w.Body.String())
	})
}
