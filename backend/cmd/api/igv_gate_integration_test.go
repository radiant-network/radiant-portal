package main

import (
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
)

// Test_IGVRoute_RequiresDownloadFileAtTheCasesLab calls GET /radiant/igv/1 on the router main builds,
// as three fixture users. Case 1's diagnosis lab is CQGC.
func Test_IGVRoute_RequiresDownloadFileAtTheCasesLab(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple", Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		os.Setenv("CORS_ALLOWED_ORIGINS", "*")
		defer os.Unsetenv("CORS_ALLOWED_ORIGINS")

		auth := &testutils.MockAuth{}
		tokenAccepted := func(c *gin.Context) { c.Next() }
		router := setupRouterWithAuth(env.Starrocks, env.Postgres, false, "", tokenAccepted, auth)
		serveAs := func(userID string) int {
			auth.Id = userID
			req, _ := http.NewRequest(http.MethodGet, "/radiant/igv/1", nil)
			w := httptest.NewRecorder()
			router.ServeHTTP(w, req)
			return w.Code
		}

		assert.Equal(t, http.StatusForbidden, serveAs(mikeID), "mike: can_search_case at '*', no can_download_file")
		assert.Equal(t, http.StatusForbidden, serveAs(aliceID), "alice: can_search_case, can_download_file at CHOP only")
		assert.NotEqual(t, http.StatusForbidden, serveAs(wendyID), "wendy: can_download_file at '*', no can_search_case")
	})
}
