package main

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/repository/postgres"
	"github.com/radiant-network/radiant-api/internal/repository/starrocks"
	"github.com/radiant-network/radiant-api/internal/server"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
)

func listOrganizations(t *testing.T, userID, tenant string) *httptest.ResponseRecorder {
	t.Helper()
	var w *httptest.ResponseRecorder
	testutils.RunTest(t, testutils.Need{Starrocks: "simple", Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		authRepo := postgres.NewAuthRepository(database.PostgresDB{DB: env.Postgres})
		orgRepo := starrocks.NewOrganizationsRepository(database.StarrocksDB{DB: env.Starrocks})
		auth := &testutils.MockAuth{Id: userID}

		router := gin.Default()
		tenantRoutes := router.Group("/:tenant")
		tenantRoutes.Use(server.RequireTenantAccess(auth, authRepo))
		tenantRoutes.GET("/organizations", server.ListOrganizationsHandler(orgRepo))

		req, _ := http.NewRequest("GET", "/"+tenant+"/organizations", nil)
		w = httptest.NewRecorder()
		router.ServeHTTP(w, req)
	})
	return w
}

func Test_ListOrganizations_Member_ReturnsTenantOrganizations(t *testing.T) {
	w := listOrganizations(t, aliceID, "radiant")

	assert.Equal(t, http.StatusOK, w.Code)
	assert.Contains(t, w.Body.String(), `"code":"CHOP"`)
	assert.Contains(t, w.Body.String(), `"category_name":"Healthcare Provider"`)
}

func Test_ListOrganizations_CrossTenant_Forbidden(t *testing.T) {
	// alice has no grant in tenant_b → RequireTenantAccess rejects before the handler runs.
	w := listOrganizations(t, aliceID, "tenant_b")

	assert.Equal(t, http.StatusForbidden, w.Code)
}
