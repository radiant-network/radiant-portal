package main

import (
	"os"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
)

var patientViewRoutes = []string{
	"POST /:tenant/patients/search",
	"GET /:tenant/patients/autocomplete",
	"GET /:tenant/patients/filters",
	"GET /:tenant/patients/statistics",
	"GET /:tenant/patients/:patient_key",
}

func registeredRoutes(router *gin.Engine) map[string]bool {
	routes := map[string]bool{}
	for _, route := range router.Routes() {
		routes[route.Method+" "+route.Path] = true
	}
	return routes
}

func Test_PatientViewRoutes_NotRegisteredWhenDisabled(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple", Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		os.Setenv("CORS_ALLOWED_ORIGINS", "*")
		defer os.Unsetenv("CORS_ALLOWED_ORIGINS")

		routes := registeredRoutes(setupRouter(env.Starrocks, env.Postgres, false))

		for _, route := range patientViewRoutes {
			assert.Falsef(t, routes[route], "route %q is registered while the patient view is disabled", route)
		}
		assert.True(t, routes["POST /:tenant/patients/batch"], "the patient batch routes must not depend on the patient view flag")
		assert.True(t, routes["PUT /:tenant/patients/batch"], "the patient batch routes must not depend on the patient view flag")
	})
}

func Test_PatientViewRoutes_RegisteredWhenEnabled(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple", Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		os.Setenv("CORS_ALLOWED_ORIGINS", "*")
		defer os.Unsetenv("CORS_ALLOWED_ORIGINS")

		routes := registeredRoutes(setupRouter(env.Starrocks, env.Postgres, true))

		for _, route := range patientViewRoutes {
			assert.Truef(t, routes[route], "route %q is missing while the patient view is enabled", route)
		}
	})
}
