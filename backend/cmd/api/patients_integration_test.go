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
	"GET /:tenant/patients/:patient_key/treatments",
	"GET /:tenant/patients/:patient_key/laboratory",
	"GET /:tenant/patients/:patient_key/imaging",
	"GET /:tenant/patients/:patient_key/genomics",
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

		routes := registeredRoutes(setupRouter(env.Starrocks, env.Postgres, false, ""))

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

		routes := registeredRoutes(setupRouter(env.Starrocks, env.Postgres, true, ""))

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
				"radiant_patient_id": 3,
				"organization_code": "CHOP",
				"organization_name": "Children's Hospital of Philadelphia",
				"given_name": "Ada",
				"family_name": "Lovelace",
				"birth_year": 2015,
				"gender": "female",
				"diagnosis_type_cohort": "Atypical teratoid/rhabdoid tumor",
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

func Test_SearchPatients_BooleanCriterionMatchesOnlyThatValue(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "pcx_patients"}, func(t *testing.T, env *testutils.Env) {
		w := postPatientsSearchIntegration(t, env, `{"search_criteria": [{"field": "got_radiation_ever", "value": [false]}]}`)

		require.Equal(t, http.StatusOK, w.Code)
		var resp types.PatientsSearchResponse
		require.NoError(t, json.Unmarshal(w.Body.Bytes(), &resp))
		ids := make([]string, len(resp.List))
		for i, p := range resp.List {
			ids[i] = p.PatientID
		}
		assert.Equal(t, []string{"MRN-0001", "MRN-0100", "C100005"}, ids)
	})
}

func Test_SearchPatients_UnfilterableField_400(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "pcx_patients"}, func(t *testing.T, env *testutils.Env) {
		w := postPatientsSearchIntegration(t, env, `{"search_criteria": [{"field": "given_name", "value": ["Ada"]}]}`)

		assert.Equal(t, http.StatusBadRequest, w.Code)
	})
}

func Test_PatientsAutocomplete_SuggestsIdsAndIdentifiableNames(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "pcx_patients"}, func(t *testing.T, env *testutils.Env) {
		repo := starrocks.NewPcxPatientsRepository(database.StarrocksDB{DB: env.Starrocks})
		router := tenantRouter()
		router.GET("/:tenant/patients/autocomplete", server.PatientsAutocompleteHandler(repo))
		w := httptest.NewRecorder()
		router.ServeHTTP(w, httptest.NewRequest(http.MethodGet, "/cbtn/patients/autocomplete?prefix=a&limit=5", nil))

		assert.Equal(t, http.StatusOK, w.Code)
		assert.JSONEq(t, `[
			{"type": "patient_name", "value": "Ada Lovelace"},
			{"type": "patient_name", "value": "Alan Turing"}
		]`, w.Body.String())
	})
}

func Test_PatientsFilters_ValuesOfTheList(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "pcx_patients"}, func(t *testing.T, env *testutils.Env) {
		repo := starrocks.NewPcxPatientsRepository(database.StarrocksDB{DB: env.Starrocks})
		router := tenantRouter()
		router.GET("/:tenant/patients/filters", server.PatientsFiltersHandler(repo))
		w := httptest.NewRecorder()
		router.ServeHTTP(w, httptest.NewRequest(http.MethodGet, "/cbtn/patients/filters", nil))

		assert.Equal(t, http.StatusOK, w.Code)
		assert.JSONEq(t, `{
			"vital_status": [{"key": "alive"}, {"key": "deceased"}],
			"organization_code": [
				{"key": "BCH", "label": "Boston Children's Hospital"},
				{"key": "CHOP", "label": "Children's Hospital of Philadelphia"},
				{"key": "SCH", "label": "Seattle Children's Hospital"}
			],
			"cns_integrated_diagnosis": [{"key": "ATRT"}, {"key": "Ependymoma"}, {"key": "Medulloblastoma"}],
			"diagnosis_type_cohort": [{"key": "Atypical teratoid/rhabdoid tumor"}, {"key": "Ependymoma"}, {"key": "Medulloblastoma"}],
			"age_at_initial_dx_group": [
				{"key": "congenital"}, {"key": "neonatal"}, {"key": "infantile"}, {"key": "childhood"}, {"key": "juvenile"},
				{"key": "young_adult"}, {"key": "middle_age"}, {"key": "senior"}, {"key": "unknown"}
			],
			"chemotherapy_agents": [{"key": "carboplatin"}, {"key": "cisplatin"}, {"key": "methotrexate"}, {"key": "vincristine"}],
			"got_radiation_ever": [{"key": "true", "label": "Yes"}, {"key": "false", "label": "No"}]
		}`, w.Body.String())
	})
}

func getPatientIntegration(t *testing.T, env *testutils.Env, path string) *httptest.ResponseRecorder {
	t.Helper()
	repo := starrocks.NewPcxPatientsRepository(database.StarrocksDB{DB: env.Starrocks})
	router := tenantRouter()
	router.GET("/:tenant/patients/:patient_key", server.PatientEntityHandler(repo))
	router.GET("/:tenant/patients/:patient_key/treatments", server.PatientTreatmentsHandler(repo))
	router.GET("/:tenant/patients/:patient_key/laboratory", server.PatientLaboratoryHandler(repo))
	router.GET("/:tenant/patients/:patient_key/imaging", server.PatientImagingHandler(repo))
	router.GET("/:tenant/patients/:patient_key/genomics", server.PatientGenomicsHandler(repo))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, httptest.NewRequest(http.MethodGet, "/cbtn/patients/"+path, nil))
	return w
}

func Test_PatientEntity_ReturnsThePatientPage(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "pcx_patients"}, func(t *testing.T, env *testutils.Env) {
		w := getPatientIntegration(t, env, "00000000-0000-4000-8000-000000000002")

		require.Equal(t, http.StatusOK, w.Code)
		var patient types.PatientEntity
		require.NoError(t, json.Unmarshal(w.Body.Bytes(), &patient))
		assert.Equal(t, "MRN-0001", patient.PatientID)
		assert.NotNil(t, patient.Events)
	})
}

func Test_PatientEntity_UnknownKey_404(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "pcx_patients"}, func(t *testing.T, env *testutils.Env) {
		w := getPatientIntegration(t, env, "00000000-0000-4000-8000-000000000999")

		assert.Equal(t, http.StatusNotFound, w.Code)
		assert.JSONEq(t, `{"status":404,"message":"patient not found"}`, w.Body.String())
	})
}

func Test_PatientGenomics_ReturnsTheCasesOfThePatient(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "pcx_patients", Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		w := getPatientIntegration(t, env, "00000000-0000-4000-8000-000000000002/genomics")

		require.Equal(t, http.StatusOK, w.Code)
		var genomics types.PatientGenomics
		require.NoError(t, json.Unmarshal(w.Body.Bytes(), &genomics))
		require.Len(t, genomics.Cases, 1)
		assert.Equal(t, "father", genomics.Cases[0].Relationship)
	})
}

func Test_PatientTabs_UnknownKey_404(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "pcx_patients"}, func(t *testing.T, env *testutils.Env) {
		for _, tab := range []string{"treatments", "laboratory", "imaging", "genomics"} {
			w := getPatientIntegration(t, env, "00000000-0000-4000-8000-000000000999/"+tab)

			assert.Equal(t, http.StatusNotFound, w.Code, tab)
			assert.JSONEq(t, `{"status":404,"message":"patient not found"}`, w.Body.String(), tab)
		}
	})
}
