package main

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/repository"
	"github.com/radiant-network/radiant-api/internal/server"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
)

func assertGetMeHandler(t *testing.T, email string, expected string) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := repository.NewAuthRepository(env.Postgres)
		auth := &testutils.MockAuth{Email: email}

		router := gin.Default()
		router.GET("/auth/me", server.GetMeHandler(repo, auth))

		req, _ := http.NewRequest("GET", "/auth/me", nil)
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.JSONEq(t, expected, w.Body.String())
	})
}

func Test_GetMeHandler_SeededUser(t *testing.T) {
	// alice: geneticist @ CHOP + researcher tenant-wide, in the radiant tenant.
	assertGetMeHandler(t, "alice@test.authz", `[{
		"code": "radiant",
		"name": "Radiant",
		"tenant_actions": ["can_search_case", "can_view_kb"],
		"orgs_by_action": {
			"can_interpret_variant": ["CHOP"],
			"can_read_pii": ["CHOP"]
		}
	}]`)
}

func Test_GetMeHandler_UserWithoutGrants(t *testing.T) {
	assertGetMeHandler(t, "nobody@test.authz", `[]`)
}
