package main

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/repository/starrocks"
	"github.com/radiant-network/radiant-api/internal/server"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
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

func postPatientsSearchIntegration(t *testing.T, env *testutils.Env, body string) *httptest.ResponseRecorder {
	t.Helper()
	repo := starrocks.NewPcxPatientsRepository(database.StarrocksDB{DB: env.Starrocks})
	router := tenantRouter()
	router.POST("/:tenant/patients/search", server.SearchPatientsHandler(repo))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, httptest.NewRequest(http.MethodPost, "/cbtn/patients/search", bytes.NewBufferString(body)))
	return w
}

func Test_SearchPatients_NameCriterionReturnsTheIdentifiablePatient(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "pcx_patients"}, func(t *testing.T, env *testutils.Env) {
		w := postPatientsSearchIntegration(t, env, `{"search_criteria": [{"field": "patient_name", "value": ["Ada Lovelace"]}]}`)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.JSONEq(t, `{
			"list": [{
				"patient_key": "00000000-0000-4000-8000-000000000001",
				"patient_id": "MRN-0002",
				"patient_id_type": "mrn",
				"can_read_phi": true,
				"radiant_patient_id": 11,
				"organization_code": "CHOP",
				"organization_name": "Children's Hospital of Philadelphia",
				"given_name": "Ada",
				"family_name": "Lovelace",
				"birth_year": 2015,
				"gender": "female",
				"cns_integrated_diagnosis": "ATRT",
				"cns_integrated_diagnosis_source": "CBTN",
				"vital_status": "alive",
				"age_at_vital_status_days": 4000,
				"age_at_initial_dx_days": 1000,
				"survival_days": 3000,
				"has_imaging": true,
				"case_count": 2
			}],
			"count": 1
		}`, w.Body.String())
	})
}

func Test_SearchPatients_DefaultSortAndPage(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "pcx_patients"}, func(t *testing.T, env *testutils.Env) {
		w := postPatientsSearchIntegration(t, env, `{"limit": 3}`)

		require.Equal(t, http.StatusOK, w.Code)
		var resp types.PatientsSearchResponse
		require.NoError(t, json.Unmarshal(w.Body.Bytes(), &resp))
		ids := make([]string, len(resp.List))
		for i, p := range resp.List {
			ids[i] = p.PatientID
		}
		assert.Equal(t, int64(5), resp.Count)
		assert.Equal(t, []string{"MRN-0001", "MRN-0002", "MRN-0100"}, ids)
	})
}

func Test_SearchPatients_UnfilterableField_400(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "pcx_patients"}, func(t *testing.T, env *testutils.Env) {
		w := postPatientsSearchIntegration(t, env, `{"search_criteria": [{"field": "given_name", "value": ["Ada"]}]}`)

		assert.Equal(t, http.StatusBadRequest, w.Code)
	})
}
