package main

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/repository/postgres"
	"github.com/radiant-network/radiant-api/internal/server"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func listRoles(t *testing.T, userID, tenant string) *httptest.ResponseRecorder {
	t.Helper()
	var w *httptest.ResponseRecorder
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		authRepo := postgres.NewAuthRepository(database.PostgresDB{DB: env.Postgres})
		rolesRepo := postgres.NewRolesRepository(database.PostgresDB{DB: env.Postgres})
		auth := &testutils.MockAuth{Id: userID}

		router := gin.Default()
		tenantRoutes := router.Group("/:tenant")
		tenantRoutes.Use(server.RequireTenantAccess(auth, authRepo))
		// Mirrors production: either management action opens the catalog.
		tenantRoutes.GET("/roles", server.RequireAnyAction(auth, authRepo, types.ActionManageRole, types.ActionManageUser), server.ListRolesHandler(rolesRepo))

		req, _ := http.NewRequest("GET", "/"+tenant+"/roles", nil)
		w = httptest.NewRecorder()
		router.ServeHTTP(w, req)
	})
	return w
}

func Test_ListRoles_RoleManager_ReturnsTenantCatalog(t *testing.T) {
	w := listRoles(t, taraID, "radiant")
	require.Equal(t, http.StatusOK, w.Code)

	var roles []types.RoleResult
	require.NoError(t, json.Unmarshal(w.Body.Bytes(), &roles))

	byCode := map[string]types.RoleResult{}
	for _, role := range roles {
		byCode[role.Code] = role
	}
	assert.True(t, byCode["member"].IsDefault)
	assert.Equal(t, types.RoleScopeTenant, byCode["member"].Scope)
	assert.False(t, byCode["practitioner"].IsDefault)
	assert.Equal(t, types.RoleScopeMixed, byCode["practitioner"].Scope)
	assert.NotEmpty(t, byCode["geneticist"].Actions)
}

func Test_ListRoles_WithoutEitherManagementActionDenied(t *testing.T) {
	// mike is a radiant member: tenant access passes, the action gate is what denies.
	w := listRoles(t, mikeID, "radiant")

	assert.Equal(t, http.StatusForbidden, w.Code)
}

func Test_ListRoles_CrossTenant_Forbidden(t *testing.T) {
	// tara manages roles in radiant only → RequireTenantAccess rejects before the handler runs.
	w := listRoles(t, taraID, "tenant_b")

	assert.Equal(t, http.StatusForbidden, w.Code)
}
