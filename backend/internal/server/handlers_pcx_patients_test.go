package server

import (
	"bytes"
	"context"
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func Test_PcxPatientHandlers_NotImplementedYet(t *testing.T) {
	handlers := map[string]gin.HandlerFunc{
		"filters":    PatientsFiltersHandler(),
		"statistics": PatientsStatisticsHandler(),
		"entity":     PatientEntityHandler(),
	}
	for name, handler := range handlers {
		router := gin.Default()
		router.GET("/", handler)
		w := httptest.NewRecorder()
		router.ServeHTTP(w, httptest.NewRequest(http.MethodGet, "/", nil))

		assert.Equal(t, http.StatusNotImplemented, w.Code, name)
		assert.JSONEq(t, `{"status":501,"message":"Not Implemented"}`, w.Body.String(), name)
	}
}

type pcxPatientsSearcherMock struct {
	patients []types.PatientListItem
	count    int64
	err      error
	query    types.ListQuery
}

func (m *pcxPatientsSearcherMock) SearchPatients(_ context.Context, query types.ListQuery) ([]types.PatientListItem, int64, error) {
	m.query = query
	return m.patients, m.count, m.err
}

func postPatientsSearch(repo pcxPatientsSearcher, body string) *httptest.ResponseRecorder {
	router := gin.Default()
	router.POST("/:tenant/patients/search", SearchPatientsHandler(repo))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, httptest.NewRequest(http.MethodPost, "/cbtn/patients/search", bytes.NewBufferString(body)))
	return w
}

func Test_SearchPatientsHandler_ReturnsListAndCount(t *testing.T) {
	birthYear, survival := 2015, 3000
	repo := &pcxPatientsSearcherMock{count: 7, patients: []types.PatientListItem{{
		PatientIdentity: types.PatientIdentity{
			PatientKey: "00000000-0000-4000-8000-000000000001", PatientID: "C100004", PatientIDType: "research_id",
			OrganizationCode: "BCH", OrganizationName: "Boston Children's Hospital",
			GivenName: "C100004_given_name", FamilyName: "C100004_family_name",
		},
		BirthYear: &birthYear, Gender: "female", VitalStatus: "deceased", SurvivalDays: &survival, HasImaging: true,
	}}}

	w := postPatientsSearch(repo, `{}`)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `{
		"list": [{
			"patient_key": "00000000-0000-4000-8000-000000000001",
			"patient_id": "C100004",
			"patient_id_type": "research_id",
			"can_read_phi": false,
			"radiant_patient_id": null,
			"organization_code": "BCH",
			"organization_name": "Boston Children's Hospital",
			"given_name": "C100004_given_name",
			"family_name": "C100004_family_name",
			"birth_year": 2015,
			"gender": "female",
			"cns_integrated_diagnosis": null,
			"cns_integrated_diagnosis_source": null,
			"vital_status": "deceased",
			"age_at_vital_status_days": null,
			"age_at_initial_dx_days": null,
			"survival_days": 3000,
			"has_imaging": true,
			"case_count": 0
		}],
		"count": 7
	}`, w.Body.String())
}

func Test_SearchPatientsHandler_EmptyResult(t *testing.T) {
	w := postPatientsSearch(&pcxPatientsSearcherMock{patients: []types.PatientListItem{}}, `{}`)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `{"list": [], "count": 0}`, w.Body.String())
}

func Test_SearchPatientsHandler_DefaultsToTenPerPage(t *testing.T) {
	repo := &pcxPatientsSearcherMock{}

	postPatientsSearch(repo, `{}`)

	require.NotNil(t, repo.query)
	assert.Equal(t, 10, repo.query.Pagination().Limit)
}

func Test_SearchPatientsHandler_KeepsRequestedPage(t *testing.T) {
	repo := &pcxPatientsSearcherMock{}

	postPatientsSearch(repo, `{"limit": 25, "page_index": 2}`)

	require.NotNil(t, repo.query)
	assert.Equal(t, types.Pagination{Limit: 25, PageIndex: 2}, *repo.query.Pagination())
}

func Test_SearchPatientsHandler_PassesCriteria(t *testing.T) {
	repo := &pcxPatientsSearcherMock{}

	postPatientsSearch(repo, `{"search_criteria": [{"field": "vital_status", "value": ["deceased"]}]}`)

	require.NotNil(t, repo.query)
	sql, params := repo.query.Filters().ToSQL(nil)
	assert.Equal(t, "(pl.vital_status = ?)", sql)
	assert.Equal(t, []interface{}{"deceased"}, params)
}

func Test_SearchPatientsHandler_UnknownCriterionField_400(t *testing.T) {
	repo := &pcxPatientsSearcherMock{}

	w := postPatientsSearch(repo, `{"search_criteria": [{"field": "can_read_phi", "value": [true]}]}`)

	assert.Equal(t, http.StatusBadRequest, w.Code)
	assert.Nil(t, repo.query)
}

func Test_SearchPatientsHandler_MalformedBody_400(t *testing.T) {
	w := postPatientsSearch(&pcxPatientsSearcherMock{}, `{"limit": "ten"}`)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func Test_SearchPatientsHandler_RepositoryError_500(t *testing.T) {
	w := postPatientsSearch(&pcxPatientsSearcherMock{err: errors.New("boom")}, `{}`)

	assert.Equal(t, http.StatusInternalServerError, w.Code)
	assert.JSONEq(t, `{"status":500,"message":"Internal Server Error"}`, w.Body.String())
}

type pcxPatientsAutocompleterMock struct {
	results []types.AutocompleteResult
	err     error
	called  bool
	prefix  string
	limit   int
}

func (m *pcxPatientsAutocompleterMock) AutocompletePatients(_ context.Context, prefix string, limit int) ([]types.AutocompleteResult, error) {
	m.called, m.prefix, m.limit = true, prefix, limit
	return m.results, m.err
}

func getPatientsAutocomplete(repo pcxPatientsAutocompleter, query string) *httptest.ResponseRecorder {
	router := gin.Default()
	router.GET("/:tenant/patients/autocomplete", PatientsAutocompleteHandler(repo))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, httptest.NewRequest(http.MethodGet, "/cbtn/patients/autocomplete"+query, nil))
	return w
}

func Test_PatientsAutocompleteHandler_ReturnsSuggestions(t *testing.T) {
	repo := &pcxPatientsAutocompleterMock{results: []types.AutocompleteResult{
		{Type: "patient_name", Value: "Ada Lovelace"},
		{Type: "patient_id", Value: "MRN-0001"},
	}}

	w := getPatientsAutocomplete(repo, "?prefix=a&limit=5")

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `[{"type":"patient_name","value":"Ada Lovelace"},{"type":"patient_id","value":"MRN-0001"}]`, w.Body.String())
	assert.Equal(t, "a", repo.prefix)
	assert.Equal(t, 5, repo.limit)
}

func Test_PatientsAutocompleteHandler_EmptyPrefixReturnsNothing(t *testing.T) {
	repo := &pcxPatientsAutocompleterMock{}

	w := getPatientsAutocomplete(repo, "?prefix=")

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `[]`, w.Body.String())
	assert.False(t, repo.called)
}

func Test_PatientsAutocompleteHandler_MissingOrInvalidLimitDefaultsToTen(t *testing.T) {
	for _, query := range []string{"?prefix=a", "?prefix=a&limit=ten", "?prefix=a&limit=0", "?prefix=a&limit=-3"} {
		repo := &pcxPatientsAutocompleterMock{}

		getPatientsAutocomplete(repo, query)

		assert.Equal(t, 10, repo.limit, query)
	}
}

func Test_PatientsAutocompleteHandler_LimitIsCapped(t *testing.T) {
	repo := &pcxPatientsAutocompleterMock{}

	getPatientsAutocomplete(repo, "?prefix=a&limit=100000")

	assert.Equal(t, 200, repo.limit)
}

func Test_PatientsAutocompleteHandler_NoMatchReturnsEmptyArray(t *testing.T) {
	w := getPatientsAutocomplete(&pcxPatientsAutocompleterMock{results: []types.AutocompleteResult{}}, "?prefix=zzz")

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `[]`, w.Body.String())
}

func Test_PatientsAutocompleteHandler_RepositoryError_500(t *testing.T) {
	w := getPatientsAutocomplete(&pcxPatientsAutocompleterMock{err: errors.New("boom")}, "?prefix=a")

	assert.Equal(t, http.StatusInternalServerError, w.Code)
	assert.JSONEq(t, `{"status":500,"message":"Internal Server Error"}`, w.Body.String())
}
