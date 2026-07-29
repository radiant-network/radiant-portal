package main

import (
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
)

func listActions(t *testing.T, userID string) *httptest.ResponseRecorder {
	t.Helper()
	var w *httptest.ResponseRecorder
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		authRepo := postgres.NewAuthRepository(database.PostgresDB{DB: env.Postgres})
		auth := &testutils.MockAuth{Id: userID}

		router := gin.Default()
		tenantRoutes := router.Group("/:tenant")
		tenantRoutes.Use(server.RequireTenantAccess(auth, authRepo))
		tenantRoutes.GET("/actions", server.RequireAction(auth, authRepo, types.ActionManageRole), server.ListActionsHandler(authRepo))

		req, _ := http.NewRequest("GET", "/radiant/actions", nil)
		w = httptest.NewRecorder()
		router.ServeHTTP(w, req)
	})
	return w
}

func Test_ListActions_TenantAdmin_ReturnsCatalog(t *testing.T) {
	// tara holds tenant_admin → can_manage_role.
	w := listActions(t, taraID)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.Contains(t, w.Body.String(), `"code":"can_manage_org"`)
	assert.Contains(t, w.Body.String(), `"name":"Manage organizations"`)
}

func Test_ListActions_WithoutManageRole_Forbidden(t *testing.T) {
	// mike holds member (no can_manage_role) → the action gate 403s.
	w := listActions(t, mikeID)

	assert.Equal(t, http.StatusForbidden, w.Code)
}
