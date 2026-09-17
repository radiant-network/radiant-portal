package main

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/beacon"
	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/repository/postgres"
	"github.com/radiant-network/radiant-api/internal/repository/starrocks"
	"github.com/radiant-network/radiant-api/internal/server"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
)

var beaconTestCfg = beacon.Config{
	ID: "org.test.beacon", Name: "Test Beacon", Environment: "test", ProductionStatus: "TEST", PublicURL: "http://api.test",
	Organization: beacon.Organization{ID: "org.test", Name: "Test Org"},
}

// beaconTestRouter wires the beacon query routes against the real repositories, with the auth
// middleware replaced by the tenant stub and the given probe user (see action_enforcement tests).
func beaconTestRouter(env *testutils.Env, userID string) *gin.Engine {
	repoVariants := starrocks.NewBeaconVariantsRepository(database.StarrocksDB{DB: env.Starrocks})
	repoProjects := postgres.NewProjectsRepository(database.PostgresDB{DB: env.Postgres})
	repoAuth := postgres.NewAuthRepository(database.PostgresDB{DB: env.Postgres})
	auth := &testutils.MockAuth{Id: userID}

	router := tenantRouter()
	g := router.Group("/:tenant/beacon")
	g.Use(server.WithBeaconConfig(beaconTestCfg))
	g.GET("/g_variants", server.BeaconGenomicVariationsHandler(beaconTestCfg, repoVariants, auth, repoAuth))
	g.POST("/g_variants", server.BeaconGenomicVariationsHandler(beaconTestCfg, repoVariants, auth, repoAuth))
	g.GET("/g_variants/:id", server.BeaconGenomicVariationByIDHandler(beaconTestCfg, repoVariants, auth, repoAuth))
	g.GET("/datasets", server.BeaconDatasetsHandler(beaconTestCfg, repoProjects))
	g.GET("/datasets/:id", server.BeaconDatasetByIDHandler(beaconTestCfg, repoProjects))
	return router
}

func beaconGet(router *gin.Engine, path string) *httptest.ResponseRecorder {
	req, _ := http.NewRequest(http.MethodGet, path, nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)
	return w
}

func Test_Beacon_SequenceQuery_Boolean(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "beacon", Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		// TP53 R175H is chr17:7674220 in the table; Beacon asks with the 0-based 7674219.
		w := beaconGet(beaconTestRouter(env, aliceID), "/radiant/beacon/g_variants?referenceName=NC_000017.11&start=7674219&referenceBases=C&alternateBases=T")
		assert.Equal(t, http.StatusOK, w.Code)
		assert.Contains(t, w.Body.String(), `"responseSummary":{"exists":true}`)
		assert.Contains(t, w.Body.String(), `"returnedGranularity":"boolean"`)
	})
}

func Test_Beacon_SequenceQuery_OneBasedCoordinateMisses(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "beacon", Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		w := beaconGet(beaconTestRouter(env, aliceID), "/radiant/beacon/g_variants?referenceName=17&start=7674220&referenceBases=C&alternateBases=T")
		assert.Equal(t, http.StatusOK, w.Code)
		assert.Contains(t, w.Body.String(), `"responseSummary":{"exists":false}`)
	})
}

func Test_Beacon_RangeQuery_Count(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "beacon", Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		w := beaconGet(beaconTestRouter(env, aliceID), "/radiant/beacon/g_variants?referenceName=chr17&start=7673000&end=7676000&requestedGranularity=count")
		assert.Equal(t, http.StatusOK, w.Code)
		assert.Contains(t, w.Body.String(), `"responseSummary":{"exists":true,"numTotalResults":3}`)
	})
}

func Test_Beacon_GeneQuery_Record_ForSearchCaseHolder(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "beacon", Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		// alice holds can_search_case (researcher tenant-wide), so record is not clamped.
		w := beaconGet(beaconTestRouter(env, aliceID), "/radiant/beacon/g_variants?geneId=BRAF&requestedGranularity=record")
		assert.Equal(t, http.StatusOK, w.Code)
		body := w.Body.String()
		assert.Contains(t, body, `"returnedGranularity":"record"`)
		assert.Contains(t, body, `"variantInternalId":"1003"`)
		assert.Contains(t, body, `"aminoacidChanges":["V600E"]`)
		assert.Contains(t, body, `"sequence_id":"refseq:NC_000007.14"`)
		assert.Contains(t, body, `"start":{"type":"Number","value":140753335}`)
		assert.Contains(t, body, `"population":"somatic tumor-normal WGS","alleleFrequency":0.2`)
		assert.Contains(t, body, `"population":"germline WGS","alleleFrequency":0,`, "pn>0 with pf=0 is still a reportable population")
	})
}

func Test_Beacon_GeneQuery_Record_ClampedForKbOnlyHolder(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "beacon", Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		// wendy is a geneticist with no can_search_case: record requests come back as counts.
		w := beaconGet(beaconTestRouter(env, wendyID), "/radiant/beacon/g_variants?geneId=TP53&requestedGranularity=record")
		assert.Equal(t, http.StatusOK, w.Code)
		assert.Contains(t, w.Body.String(), `"returnedGranularity":"count"`)
		assert.Contains(t, w.Body.String(), `"numTotalResults":3`)
		assert.NotContains(t, w.Body.String(), `"resultSets"`)
	})
}

func Test_Beacon_AminoacidQuery_POST(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "beacon", Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		body := `{"meta":{"apiVersion":"v2.0.0"},"query":{"requestParameters":{"aminoacidChange":"R175H"},"requestedGranularity":"count"}}`
		req, _ := http.NewRequest(http.MethodPost, "/radiant/beacon/g_variants", strings.NewReader(body))
		w := httptest.NewRecorder()
		beaconTestRouter(env, aliceID).ServeHTTP(w, req)
		assert.Equal(t, http.StatusOK, w.Code)
		assert.Contains(t, w.Body.String(), `"numTotalResults":1`)
	})
}

func Test_Beacon_VariantByID(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "beacon", Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		router := beaconTestRouter(env, aliceID)
		w := beaconGet(router, "/radiant/beacon/g_variants/1001")
		assert.Equal(t, http.StatusOK, w.Code)
		assert.Contains(t, w.Body.String(), `"genomicHGVSId":"chr17:g.7674220C\u003eT"`)
		assert.Contains(t, w.Body.String(), `"clinvarVariantId":"VCV000012374"`)

		w = beaconGet(router, "/radiant/beacon/g_variants/424242")
		assert.Equal(t, http.StatusNotFound, w.Code)
	})
}

func Test_Beacon_Datasets(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "beacon", Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		router := beaconTestRouter(env, wendyID)
		w := beaconGet(router, "/radiant/beacon/datasets")
		assert.Equal(t, http.StatusOK, w.Code)
		assert.Contains(t, w.Body.String(), `"results":[{"id":"N1","name":"NeuroDev Phase I"`)
		assert.Contains(t, w.Body.String(), `{"id":"N2","name":"NeuroDev Phase II"`)

		w = beaconGet(router, "/radiant/beacon/datasets/N1")
		assert.Equal(t, http.StatusOK, w.Code)
		assert.Contains(t, w.Body.String(), `"resultsCount":1`)

		w = beaconGet(router, "/radiant/beacon/datasets/N9")
		assert.Equal(t, http.StatusNotFound, w.Code)
	})
}

func Test_Beacon_Datasets_OtherTenantIsolated(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "beacon", Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		w := beaconGet(beaconTestRouter(env, wendyID), "/tenant_b/beacon/datasets")
		assert.Equal(t, http.StatusOK, w.Code)
		assert.Contains(t, w.Body.String(), `"responseSummary":{"exists":false,"numTotalResults":0}`)
	})
}
