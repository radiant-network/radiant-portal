package main

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/repository/postgres"
	"github.com/radiant-network/radiant-api/internal/repository/starrocks"
	"github.com/radiant-network/radiant-api/internal/server"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
)

// tara holds tenant_admin (can_manage_org) tenant-wide in radiant (test/data/auth/06_user_role.sql).
const taraID = "a1a2a3a4-b5b6-4c70-8d90-e1e2e3e4e5e6"

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

func postOrganization(t *testing.T, userID, body string) *httptest.ResponseRecorder {
	t.Helper()
	var w *httptest.ResponseRecorder
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		authRepo := postgres.NewAuthRepository(database.PostgresDB{DB: env.Postgres})
		orgRepo := postgres.NewOrganizationRepository(database.PostgresDB{DB: env.Postgres})
		auth := &testutils.MockAuth{Id: userID}
		defer env.Postgres.Exec("DELETE FROM organization WHERE code LIKE 'int_org_%' AND tenant_code = 'radiant'")

		router := gin.Default()
		tenantRoutes := router.Group("/:tenant")
		tenantRoutes.Use(server.RequireTenantAccess(auth, authRepo))
		tenantRoutes.POST("/organizations", server.RequireAction(auth, authRepo, types.ActionManageOrg), server.PostOrganizationHandler(orgRepo))

		req, _ := http.NewRequest("POST", "/radiant/organizations", strings.NewReader(body))
		req.Header.Set("Content-Type", "application/json")
		w = httptest.NewRecorder()
		router.ServeHTTP(w, req)
	})
	return w
}

func Test_CreateOrganization_TenantAdmin_Created(t *testing.T) {
	w := postOrganization(t, taraID, `{"code":"int_org_a","name":"Integration Org","category_code":"healthcare_provider"}`)

	assert.Equal(t, http.StatusCreated, w.Code)
	assert.Empty(t, w.Body.String())
}

func Test_CreateOrganization_WithoutManageOrgs_Forbidden(t *testing.T) {
	// mike holds member (no can_manage_org) → the action gate 403s before the handler.
	w := postOrganization(t, mikeID, `{"code":"int_org_b","name":"Integration Org","category_code":"healthcare_provider"}`)

	assert.Equal(t, http.StatusForbidden, w.Code)
}
