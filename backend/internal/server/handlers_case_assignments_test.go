package server

import (
	"context"
	"errors"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/stretchr/testify/assert"
)

type mockCandidatesRepository struct {
	candidates []types.CaseAssignee
	labs       map[int]string
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

func (m *mockCandidatesRepository) OrgsForCases(_ context.Context, _ string, _ []int) (map[int]string, error) {
	if m.err != nil {
		return nil, m.err
	}
	return m.labs, nil
}

func candidatesRequest(repo *mockCandidatesRepository, body string) *httptest.ResponseRecorder {
	router := gin.Default()
	router.Use(func(c *gin.Context) { c.Set(TenantContextKey, c.Param("tenant")) })
	router.POST("/:tenant/cases/assignment_candidates", ListCaseAssignmentCandidatesHandler(repo, repo))

	req, _ := http.NewRequest("POST", "/radiant/cases/assignment_candidates", strings.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)
	return w
}

func Test_ListCaseAssignmentCandidatesHandler(t *testing.T) {
	repo := &mockCandidatesRepository{
		labs: map[int]string{12: "CQGC"},
		candidates: []types.CaseAssignee{
			{UserID: "u1", FirstName: "Wendy", LastName: "Walsh", Email: "wendy@test.authz"},
		},
	}

	w := candidatesRequest(repo, `{"case_ids":[12]}`)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `[{"user_id":"u1","first_name":"Wendy","last_name":"Walsh","email":"wendy@test.authz"}]`, w.Body.String())
	assert.Equal(t, "CQGC", repo.gotOrg, "candidates are looked up at the cases' diagnosis lab")
}

func Test_ListCaseAssignmentCandidatesHandler_NoCandidates(t *testing.T) {
	repo := &mockCandidatesRepository{labs: map[int]string{12: "CQGC"}, candidates: []types.CaseAssignee{}}

	w := candidatesRequest(repo, `{"case_ids":[12]}`)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `[]`, w.Body.String())
}

// An empty picker must read as [] and not null, whatever the repository hands back.
func Test_ListCaseAssignmentCandidatesHandler_NilCandidatesSerializeAsEmptyArray(t *testing.T) {
	repo := &mockCandidatesRepository{labs: map[int]string{12: "CQGC"}, candidates: nil}

	w := candidatesRequest(repo, `{"case_ids":[12]}`)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `[]`, w.Body.String())
}

func Test_ListCaseAssignmentCandidatesHandler_PassesSearchAndPagination(t *testing.T) {
	repo := &mockCandidatesRepository{labs: map[int]string{12: "CQGC"}}

	w := candidatesRequest(repo, `{"case_ids":[12],"search":"wal","limit":5,"offset":10}`)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.Equal(t, "wal", repo.gotQuery.Search)
	assert.Equal(t, 5, repo.gotQuery.Pagination.Limit)
	assert.Equal(t, 10, repo.gotQuery.Pagination.Offset)
}

// Several cases at one lab is the batch picker's normal request, and must resolve to that lab.
func Test_ListCaseAssignmentCandidatesHandler_SeveralCasesOneLab(t *testing.T) {
	repo := &mockCandidatesRepository{labs: map[int]string{12: "CQGC", 13: "CQGC"}}

	w := candidatesRequest(repo, `{"case_ids":[12,13]}`)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.Equal(t, "CQGC", repo.gotOrg)
	assert.Equal(t, []int{12, 13}, repo.gotQuery.CaseIDs)
}

func Test_ListCaseAssignmentCandidatesHandler_CasesSpanSeveralLabs(t *testing.T) {
	repo := &mockCandidatesRepository{labs: map[int]string{12: "CQGC", 13: "CHOP"}}

	w := candidatesRequest(repo, `{"case_ids":[12,13]}`)

	assert.Equal(t, http.StatusBadRequest, w.Code)
	assert.Contains(t, w.Body.String(), "several organizations")
	assert.Empty(t, repo.gotOrg, "no lab is guessed when the selection spans more than one")
}

func Test_ListCaseAssignmentCandidatesHandler_UnknownCase(t *testing.T) {
	repo := &mockCandidatesRepository{labs: map[int]string{12: "CQGC"}}

	w := candidatesRequest(repo, `{"case_ids":[12,999]}`)

	assert.Equal(t, http.StatusBadRequest, w.Code)
	assert.Contains(t, w.Body.String(), "case 999 not found")
}

func Test_ListCaseAssignmentCandidatesHandler_MissingCaseIDs(t *testing.T) {
	repo := &mockCandidatesRepository{}

	w := candidatesRequest(repo, `{}`)

	assert.Equal(t, http.StatusBadRequest, w.Code)
	assert.Contains(t, w.Body.String(), "case_ids is required")
}

func Test_ListCaseAssignmentCandidatesHandler_MalformedBody(t *testing.T) {
	repo := &mockCandidatesRepository{}

	w := candidatesRequest(repo, `{"case_ids":"nope"}`)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func Test_ListCaseAssignmentCandidatesHandler_NegativeLimit(t *testing.T) {
	repo := &mockCandidatesRepository{}

	w := candidatesRequest(repo, `{"case_ids":[12],"limit":-1}`)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func Test_ListCaseAssignmentCandidatesHandler_RepositoryError(t *testing.T) {
	repo := &mockCandidatesRepository{err: errors.New("boom")}

	w := candidatesRequest(repo, `{"case_ids":[12]}`)

	assert.Equal(t, http.StatusInternalServerError, w.Code)
	assert.JSONEq(t, `{"status":500,"message":"Internal Server Error"}`, w.Body.String())
}
