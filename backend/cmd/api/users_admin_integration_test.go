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

func listUsers(t *testing.T, userID, tenant, queryString string) *httptest.ResponseRecorder {
	t.Helper()
	var w *httptest.ResponseRecorder
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		authRepo := postgres.NewAuthRepository(database.PostgresDB{DB: env.Postgres})
		usersRepo := postgres.NewUsersRepository(database.PostgresDB{DB: env.Postgres})
		auth := &testutils.MockAuth{Id: userID}

		router := gin.Default()
		tenantRoutes := router.Group("/:tenant")
		tenantRoutes.Use(server.RequireTenantAccess(auth, authRepo))
		tenantRoutes.GET("/users", server.RequireAction(auth, authRepo, types.ActionManageUser), server.ListUsersHandler(usersRepo))

		req, _ := http.NewRequest("GET", "/"+tenant+"/users"+queryString, nil)
		w = httptest.NewRecorder()
		router.ServeHTTP(w, req)
	})
	return w
}

func Test_ListUsers_TenantAdmin_ReturnsTenantUsers(t *testing.T) {
	w := listUsers(t, taraID, "radiant", "?search=alice@test.authz")

	require.Equal(t, http.StatusOK, w.Code)
	var response types.UsersSearchResponse
	require.NoError(t, json.Unmarshal(w.Body.Bytes(), &response))

	assert.Equal(t, int64(1), response.Count)
	require.Len(t, response.List, 1)
	assert.Equal(t, "Alice", response.List[0].FirstName)
	assert.Len(t, response.List[0].Roles, 2, "alice holds geneticist @ CHOP and researcher tenant-wide")
}

func Test_ListUsers_WithoutManageUser_Forbidden(t *testing.T) {
	// mike holds member (no can_manage_user) → the action gate 403s before the handler.
	w := listUsers(t, mikeID, "radiant", "")

	assert.Equal(t, http.StatusForbidden, w.Code)
}

func Test_ListUsers_CrossTenant_Forbidden(t *testing.T) {
	// tara is a radiant admin only → RequireTenantAccess rejects her on tenant_b.
	w := listUsers(t, taraID, "tenant_b", "")

	assert.Equal(t, http.StatusForbidden, w.Code)
}
