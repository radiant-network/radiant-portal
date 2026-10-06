package main

import (
	"bytes"
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

		w := putGenePanelFile(t, router, tenant, "", "symbol\tEpilepsy\tOncology\n"+
			"tnmd\ttrue\tfalse\n"+
			"NOTAGENE\ttrue\ttrue\n"+
			"BRAF\tfalse\ttrue\n")

		assert.Equal(t, http.StatusOK, w.Code)
		assert.JSONEq(t, `{"panels":2,"genes":2,"warnings":[
			{"line":3,"symbol":"NOTAGENE","message":"symbol matches no Ensembl gene, row skipped"}
		]}`, w.Body.String())
		assert.Equal(t, []genePanelMVRow{{"Epilepsy", "TNMD"}, {"Oncology", "BRAF"}}, readTenantGenePanelMV(t, env.Starrocks, tenant))
	})
}

func Test_PutGenePanels_SecondUploadReplacesTheFirstInTheMV(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple", Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		tenant := genePanelUploadTenant(t, env)
		router := genePanelUploadRouter(env)
		require.Equal(t, http.StatusOK, putGenePanelFile(t, router, tenant, "", "symbol\tEpilepsy\nTNMD\ttrue\n").Code)

		w := putGenePanelFile(t, router, tenant, "", "symbol\tOncology\nBRAF\ttrue\n")

		assert.Equal(t, http.StatusOK, w.Code)
		assert.Equal(t, []genePanelMVRow{{"Oncology", "BRAF"}}, readTenantGenePanelMV(t, env.Starrocks, tenant))
	})
}

func Test_PutGenePanels_StrictUnmatchedKeepsThePreviousPanels(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple", Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		tenant := genePanelUploadTenant(t, env)
		router := genePanelUploadRouter(env)
		require.Equal(t, http.StatusOK, putGenePanelFile(t, router, tenant, "", "symbol\tEpilepsy\nTNMD\ttrue\n").Code)

		w := putGenePanelFile(t, router, tenant, "?strict=true", "symbol\tOncology\nNOTAGENE\ttrue\n")

		assert.Equal(t, http.StatusUnprocessableEntity, w.Code)
		assert.Equal(t, []genePanelMVRow{{"Epilepsy", "TNMD"}}, readTenantGenePanelMV(t, env.Starrocks, tenant))
	})
}
