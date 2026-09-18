package server

import (
	"context"
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/stretchr/testify/assert"
)

type mockCandidatesRepository struct {
	candidates []types.CaseAssignee
	labs       []string
	err        error
	gotOrg     string
	gotQuery   types.ListAssignmentCandidatesQuery
}

func (m *mockCandidatesRepository) EligibleAssignees(_ context.Context, _, orgCode string, query types.ListAssignmentCandidatesQuery) ([]types.CaseAssignee, error) {
	m.gotOrg = orgCode
	m.gotQuery = query
	if m.err != nil {
		return nil, m.err
	}
	return m.candidates, nil
}

func (m *mockCandidatesRepository) OrgsForCase(_ context.Context, _ string, _ int) ([]string, error) {
	if m.err != nil {
		return nil, m.err
	}
	return m.labs, nil
}

func candidatesRequest(repo *mockCandidatesRepository, path string) *httptest.ResponseRecorder {
	router := gin.Default()
	router.Use(func(c *gin.Context) { c.Set(TenantContextKey, c.Param("tenant")) })
	router.GET("/:tenant/cases/:case_id/assignment_candidates", ListCaseAssignmentCandidatesHandler(repo, repo))

	req, _ := http.NewRequest("GET", "/radiant/cases/"+path, nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)
	return w
}

func Test_ListCaseAssignmentCandidatesHandler(t *testing.T) {
	repo := &mockCandidatesRepository{
		labs: []string{"CQGC"},
		candidates: []types.CaseAssignee{
			{UserID: "u1", FirstName: "Wendy", LastName: "Walsh", Email: "wendy@test.authz"},
		},
	}

	w := candidatesRequest(repo, "12/assignment_candidates")

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `[{"user_id":"u1","first_name":"Wendy","last_name":"Walsh","email":"wendy@test.authz"}]`, w.Body.String())
	assert.Equal(t, "CQGC", repo.gotOrg, "candidates are looked up at the case's diagnosis lab")
}

func Test_ListCaseAssignmentCandidatesHandler_NoCandidates(t *testing.T) {
	repo := &mockCandidatesRepository{labs: []string{"CQGC"}, candidates: []types.CaseAssignee{}}

	w := candidatesRequest(repo, "12/assignment_candidates")

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `[]`, w.Body.String())
}

// An empty picker must read as [] and not null, whatever the repository hands back.
func Test_ListCaseAssignmentCandidatesHandler_NilCandidatesSerializeAsEmptyArray(t *testing.T) {
	repo := &mockCandidatesRepository{labs: []string{"CQGC"}, candidates: nil}

	w := candidatesRequest(repo, "12/assignment_candidates")

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `[]`, w.Body.String())
}

func Test_ListCaseAssignmentCandidatesHandler_PassesSearchAndPagination(t *testing.T) {
	repo := &mockCandidatesRepository{labs: []string{"CQGC"}}

	w := candidatesRequest(repo, "12/assignment_candidates?search=wal&limit=5&offset=10")

	assert.Equal(t, http.StatusOK, w.Code)
	assert.Equal(t, "wal", repo.gotQuery.Search)
	assert.Equal(t, 5, repo.gotQuery.Pagination.Limit)
	assert.Equal(t, 10, repo.gotQuery.Pagination.Offset)
}

// The handler still resolves the case itself rather than trusting the gate to have done it.
func Test_ListCaseAssignmentCandidatesHandler_UnknownCase(t *testing.T) {
	repo := &mockCandidatesRepository{labs: []string{}}

	w := candidatesRequest(repo, "999/assignment_candidates")

	assert.Equal(t, http.StatusNotFound, w.Code)
	assert.Empty(t, repo.gotOrg, "no lab is guessed for a case that resolves to none")
}

func Test_ListCaseAssignmentCandidatesHandler_MalformedCaseId(t *testing.T) {
	repo := &mockCandidatesRepository{}

	w := candidatesRequest(repo, "abc/assignment_candidates")

	assert.Equal(t, http.StatusNotFound, w.Code)
}

func Test_ListCaseAssignmentCandidatesHandler_NegativeLimit(t *testing.T) {
	repo := &mockCandidatesRepository{labs: []string{"CQGC"}}

	w := candidatesRequest(repo, "12/assignment_candidates?limit=-1")

	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func Test_ListCaseAssignmentCandidatesHandler_RepositoryError(t *testing.T) {
	repo := &mockCandidatesRepository{err: errors.New("boom")}

	w := candidatesRequest(repo, "12/assignment_candidates")

	assert.Equal(t, http.StatusInternalServerError, w.Code)
	assert.JSONEq(t, `{"status":500,"message":"Internal Server Error"}`, w.Body.String())
}
