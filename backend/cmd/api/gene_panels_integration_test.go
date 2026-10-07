package main

import (
	"bytes"
	"context"
	"fmt"
	"mime/multipart"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/repository/postgres"
	"github.com/radiant-network/radiant-api/internal/repository/starrocks"
	"github.com/radiant-network/radiant-api/internal/server"
	"github.com/radiant-network/radiant-api/internal/service"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"gorm.io/gorm"
)

type genePanelMVRow struct {
	Panel  string
	Symbol string
}

// genePanelUploadRouter serves PUT /:tenant/gene_panels with the real repositories. The tenant
// is set from the path: access and action checks have their own tests.
func genePanelUploadRouter(env *testutils.Env) *gin.Engine {
	sr := database.StarrocksDB{DB: env.Starrocks}
	uploader := service.NewGenePanelUploader(
		starrocks.NewGenesRepository(sr),
		postgres.NewGenePanelsRepository(database.PostgresDB{DB: env.Postgres}),
		starrocks.NewStarrocksTenantRepository(sr),
	)
	router := gin.New()
	group := router.Group("/:tenant")
	group.Use(func(c *gin.Context) { c.Set(server.TenantContextKey, c.Param("tenant")) })
	group.PUT("/gene_panels", server.PutGenePanelsHandler(uploader))
	return router
}

func putGenePanelFile(t *testing.T, router *gin.Engine, tenant, query, content string) *httptest.ResponseRecorder {
	t.Helper()
	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)
	part, err := writer.CreateFormFile("file", "gene_panels.tsv")
	require.NoError(t, err)
	_, err = part.Write([]byte(content))
	require.NoError(t, err)
	require.NoError(t, writer.Close())

	req, _ := http.NewRequest(http.MethodPut, "/"+tenant+"/gene_panels"+query, body)
	req.Header.Set("Content-Type", writer.FormDataContentType())
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)
	return w
}

// genePanelUploadTenant creates a throwaway tenant with its StarRocks database and gene panel MV.
// The StarRocks database is left behind: the test connection cannot DROP. Tests that use it need
// ExclusivePostgres: with tenant views off, the case filters list the panels of every tenant.
func genePanelUploadTenant(t *testing.T, env *testutils.Env) string {
	t.Helper()
	code := fmt.Sprintf("gpapi_%d", time.Now().UnixNano())
	require.NoError(t, env.Postgres.Exec("INSERT INTO tenant (code, name) VALUES (?, ?)", code, code).Error)
	t.Cleanup(func() {
		env.Postgres.Exec("DELETE FROM panel_has_genes WHERE panel_id IN (SELECT id FROM panel WHERE tenant_code = ?)", code)
		env.Postgres.Exec("DELETE FROM panel WHERE tenant_code = ?", code)
		env.Postgres.Exec("DELETE FROM tenant WHERE code = ?", code)
	})
	require.NoError(t, env.Starrocks.Exec(fmt.Sprintf("CREATE DATABASE IF NOT EXISTS `%s_tenant`", code)).Error)
	require.NoError(t, starrocks.NewStarrocksTenantRepository(database.StarrocksDB{DB: env.Starrocks}).EnsureGenePanelMV(t.Context(), code))
	return code
}

func readTenantGenePanelMV(t *testing.T, sr *gorm.DB, tenant string) []genePanelMVRow {
	t.Helper()
	var rows []genePanelMVRow
	require.NoError(t, sr.Raw(fmt.Sprintf("SELECT panel, symbol FROM `%s_tenant`.`gene_panel_mv` ORDER BY panel, symbol", tenant)).Scan(&rows).Error)
	return rows
}

func Test_PutGenePanels_UploadFillsTheTenantMV(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple", Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		tenant := genePanelUploadTenant(t, env)
		router := genePanelUploadRouter(env)

		w := putGenePanelFile(t, router, tenant, "", "symbol\tpanels\tversion\n"+
			"tnmd\tEPILEP\tEPILEP_v2\n"+
			"NOTAGENE\tEPILEP,ONCO\tEPILEP_v2,ONCO_v1\n"+
			"BRAF\tONCO\tONCO_v1\n")

		assert.Equal(t, http.StatusOK, w.Code)
		assert.JSONEq(t, `{"panels":2,"genes":2,"warnings":[
			{"line":3,"symbol":"NOTAGENE","message":"symbol matches no Ensembl gene, row skipped"}
		]}`, w.Body.String())
		assert.Equal(t, []genePanelMVRow{{"EPILEP", "TNMD"}, {"ONCO", "BRAF"}}, readTenantGenePanelMV(t, env.Starrocks, tenant))
	})
}

func Test_PutGenePanels_SecondUploadReplacesTheFirstInTheMV(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple", Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		tenant := genePanelUploadTenant(t, env)
		router := genePanelUploadRouter(env)
		require.Equal(t, http.StatusOK, putGenePanelFile(t, router, tenant, "", "symbol\tpanels\nTNMD\tEPILEP\n").Code)

		w := putGenePanelFile(t, router, tenant, "", "symbol\tpanels\nBRAF\tONCO\n")

		assert.Equal(t, http.StatusOK, w.Code)
		assert.Equal(t, []genePanelMVRow{{"ONCO", "BRAF"}}, readTenantGenePanelMV(t, env.Starrocks, tenant))
	})
}

func Test_PutGenePanels_StrictUnmatchedKeepsThePreviousPanels(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple", Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		tenant := genePanelUploadTenant(t, env)
		router := genePanelUploadRouter(env)
		require.Equal(t, http.StatusOK, putGenePanelFile(t, router, tenant, "", "symbol\tpanels\nTNMD\tEPILEP\n").Code)

		w := putGenePanelFile(t, router, tenant, "?strict=true", "symbol\tpanels\nNOTAGENE\tONCO\n")

		assert.Equal(t, http.StatusUnprocessableEntity, w.Code)
		assert.Equal(t, []genePanelMVRow{{"EPILEP", "TNMD"}}, readTenantGenePanelMV(t, env.Starrocks, tenant))
	})
}

func Test_PutGenePanels_FileWithoutVersionColumnIsAccepted(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple", Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		tenant := genePanelUploadTenant(t, env)
		router := genePanelUploadRouter(env)

		w := putGenePanelFile(t, router, tenant, "", "symbol\tpanels\nTNMD\tEPILEP,ONCO\n")

		assert.Equal(t, http.StatusOK, w.Code)
		assert.JSONEq(t, `{"panels":2,"genes":2,"warnings":[]}`, w.Body.String())
		assert.Equal(t, []genePanelMVRow{{"EPILEP", "TNMD"}, {"ONCO", "TNMD"}}, readTenantGenePanelMV(t, env.Starrocks, tenant))
	})
}

func Test_PutGenePanels_FillsTheGenesOfAnAnalysisCatalogPanel(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple", Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		tenant := genePanelUploadTenant(t, env)
		require.NoError(t, env.Postgres.Exec("INSERT INTO panel (code, name, type_code, tenant_code) VALUES ('EPILEP', 'Epilepsy', 'physical', ?)", tenant).Error)
		router := genePanelUploadRouter(env)

		w := putGenePanelFile(t, router, tenant, "", "symbol\tpanels\tversion\nTNMD\tepilep\tepilep_v2\n")

		assert.Equal(t, http.StatusOK, w.Code)
		assert.Equal(t, []genePanelMVRow{{"Epilepsy", "TNMD"}}, readTenantGenePanelMV(t, env.Starrocks, tenant),
			"the catalog panel keeps its name and gets the genes")
	})
}

// genePanelsFixtureDB is the database the "gene_panels" fixture folder is loaded into.
const genePanelsFixtureDB = "gene_panels"

// bindTenantToGenePanelsFixture makes the tenant read path resolve against the "gene_panels"
// fixture: per-tenant occurrence tables become views in <tenant>_tenant over the fixture tables,
// next to the real gene_panel_mv, and the shared database points at the fixture database.
// Changing types.SharedDatabase is safe only because the caller is serial (ExclusivePostgres):
// Go starts the paused parallel tests after every sequential test has returned.
func bindTenantToGenePanelsFixture(t *testing.T, env *testutils.Env, tenant string) context.Context {
	t.Helper()
	for _, table := range []types.Table{types.GermlineSNVOccurrenceTable, types.SomaticSNVOccurrenceTable, types.VariantTable} {
		require.NoError(t, env.Starrocks.Exec(fmt.Sprintf("CREATE VIEW `%s_tenant`.`%s` AS SELECT * FROM `%s`.`%s`",
			tenant, table.Name, genePanelsFixtureDB, table.Name)).Error)
	}
	shared := types.SharedDatabase
	types.SharedDatabase = genePanelsFixtureDB
	t.Cleanup(func() { types.SharedDatabase = shared })
	return types.ContextWithTenant(t.Context(), tenant)
}

func aggregateTenantGenePanel(t *testing.T, ctx context.Context, snvFields []types.Field, aggregate func(context.Context, types.AggQuery) ([]types.Aggregation, error)) []types.Aggregation {
	t.Helper()
	query, err := types.NewAggregationQueryFromSqon("tenant_gene_panel", nil, types.FieldsForContext(ctx, snvFields))
	require.NoError(t, err)
	buckets, err := aggregate(ctx, query)
	require.NoError(t, err)
	return buckets
}

func Test_PutGenePanels_UploadedPanelsFilterAndAggregateSNVOccurrences(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: genePanelsFixtureDB, Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		tenant := genePanelUploadTenant(t, env)
		router := genePanelUploadRouter(env)
		w := putGenePanelFile(t, router, tenant, "", "symbol\tpanels\n"+
			"BRAF\tEPILEP,ONCO\n"+
			"TP53\tONCO\n"+
			"MYH7\tCARDIO\n")
		require.Equal(t, http.StatusOK, w.Code, w.Body.String())

		ctx := bindTenantToGenePanelsFixture(t, env, tenant)
		sr := database.StarrocksDB{DB: env.Starrocks}
		germline := starrocks.NewGermlineSNVOccurrencesRepository(sr)
		somatic := starrocks.NewSomaticSNVOccurrencesRepository(sr)

		// The buckets are the panel codes: the upload names a new panel by its code. CARDIO (MYH7)
		// has no consequence in the case, so it is not a bucket.
		assert.Equal(t, []types.Aggregation{{Bucket: "EPILEP", Count: 2}, {Bucket: "ONCO", Count: 3}},
			aggregateTenantGenePanel(t, ctx, types.GermlineSNVOccurrencesFields, func(ctx context.Context, q types.AggQuery) ([]types.Aggregation, error) {
				return germline.AggregateOccurrences(ctx, 1, 1, 1, q)
			}))
		assert.Equal(t, []types.Aggregation{{Bucket: "EPILEP", Count: 1}, {Bucket: "ONCO", Count: 2}},
			aggregateTenantGenePanel(t, ctx, types.SomaticSNVOccurrencesFields, func(ctx context.Context, q types.AggQuery) ([]types.Aggregation, error) {
				return somatic.AggregateOccurrences(ctx, 1, 1, 1, q)
			}))

		sqon := &types.Sqon{Op: "in", Content: types.LeafContent{Field: "tenant_gene_panel", Value: []any{"EPILEP"}}}
		countQuery, err := types.NewOccurrenceCountQueryFromSqon(sqon, types.FieldsForContext(ctx, types.GermlineSNVOccurrencesFields))
		require.NoError(t, err)
		count, err := germline.CountOccurrences(ctx, 1, 1, 1, countQuery)
		require.NoError(t, err)
		assert.EqualValues(t, 2, count.Count)
	})
}

func Test_PutGenePanels_ReuploadUpdatesTheTenantGenePanelFacet(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: genePanelsFixtureDB, Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		tenant := genePanelUploadTenant(t, env)
		router := genePanelUploadRouter(env)
		require.Equal(t, http.StatusOK, putGenePanelFile(t, router, tenant, "", "symbol\tpanels\nBRAF\tEPILEP,ONCO\n").Code)
		require.Equal(t, http.StatusOK, putGenePanelFile(t, router, tenant, "", "symbol\tpanels\nTP53\tONCO\n").Code)

		ctx := bindTenantToGenePanelsFixture(t, env, tenant)
		germline := starrocks.NewGermlineSNVOccurrencesRepository(database.StarrocksDB{DB: env.Starrocks})

		// EPILEP left the file, so it is gone; ONCO now holds TP53 only (loci 1000 and 1001).
		assert.Equal(t, []types.Aggregation{{Bucket: "ONCO", Count: 2}},
			aggregateTenantGenePanel(t, ctx, types.GermlineSNVOccurrencesFields, func(ctx context.Context, q types.AggQuery) ([]types.Aggregation, error) {
				return germline.AggregateOccurrences(ctx, 1, 1, 1, q)
			}))
	})
}
