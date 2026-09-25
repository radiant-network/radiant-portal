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
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
)

type mockCandidatesRepository struct {
	candidates []types.CaseAssignee
	labs       []string
	err        error
	gotOrg     string
	gotCaller  string
	gotQuery   types.ListAssignmentCandidatesQuery
}

func (m *mockCandidatesRepository) EligibleAssignees(_ context.Context, _, orgCode, callerID string, query types.ListAssignmentCandidatesQuery) ([]types.CaseAssignee, error) {
	m.gotOrg = orgCode
	m.gotCaller = callerID
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

// callerUserID stands in for the authenticated user the handler must hand to the repository.
const callerUserID = "caller-1"

func candidatesRequest(repo *mockCandidatesRepository, path string) *httptest.ResponseRecorder {
	router := gin.Default()
	router.Use(func(c *gin.Context) { c.Set(TenantContextKey, c.Param("tenant")) })
	router.GET("/:tenant/cases/:case_id/assignment_candidates", ListCaseAssignmentCandidatesHandler(repo, repo, &testutils.MockAuth{Id: callerUserID}))

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

type mockAssignmentsStore struct {
	err    error
	gotIDs *[]string
}

func (m *mockAssignmentsStore) ReplaceAssignees(_ context.Context, _ string, _ int, userIDs []string) error {
	m.gotIDs = &userIDs
	return m.err
}

func putAssignments(repo *mockAssignmentsStore, caseID, body string) *httptest.ResponseRecorder {
	router := gin.Default()
	router.Use(func(c *gin.Context) { c.Set(TenantContextKey, c.Param("tenant")) })
	router.PUT("/:tenant/cases/:case_id/assignments", PutCaseAssignmentsHandler(repo))

	req, _ := http.NewRequest("PUT", "/radiant/cases/"+caseID+"/assignments", strings.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)
	return w
}

// Like the other PUT endpoints, success is a bare 200: the stored set can differ from the
// submitted one (see the pruning rule), so a caller that needs to display it reads the case back.
func Test_PutCaseAssignmentsHandler_AssignsAndAnswersWithoutABody(t *testing.T) {
	repo := &mockAssignmentsStore{}

	w := putAssignments(repo, "12", `{"user_ids":["u1"]}`)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.Empty(t, w.Body.String())
	assert.Equal(t, []string{"u1"}, *repo.gotIDs)
}

func Test_PutCaseAssignmentsHandler_EmptyListUnassigns(t *testing.T) {
	repo := &mockAssignmentsStore{}

	w := putAssignments(repo, "12", `{"user_ids":[]}`)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.Equal(t, []string{}, *repo.gotIDs, "the empty set still reaches the repository")
}

func Test_PutCaseAssignmentsHandler_DeduplicatesUserIDs(t *testing.T) {
	repo := &mockAssignmentsStore{}

	w := putAssignments(repo, "12", `{"user_ids":["u1","u1"]}`)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.Equal(t, []string{"u1"}, *repo.gotIDs)
}

func Test_PutCaseAssignmentsHandler_IneligibleAssigneeIs422(t *testing.T) {
	repo := &mockAssignmentsStore{err: &types.IneligibleAssigneesError{OrgCode: "CQGC", UserIDs: []string{"outsider"}}}

	w := putAssignments(repo, "12", `{"user_ids":["outsider"]}`)

	assert.Equal(t, http.StatusUnprocessableEntity, w.Code)
	assert.Contains(t, w.Body.String(), "outsider")
	assert.Contains(t, w.Body.String(), "CQGC")
}

func Test_PutCaseAssignmentsHandler_UnknownCaseIs404(t *testing.T) {
	repo := &mockAssignmentsStore{err: types.ErrCaseNotFound}

	w := putAssignments(repo, "999", `{"user_ids":[]}`)

	assert.Equal(t, http.StatusNotFound, w.Code)
}

// Clearing a case has to be asked for, never inferred from a body that forgot the field.
func Test_PutCaseAssignmentsHandler_MissingUserIDsRejected(t *testing.T) {
	repo := &mockAssignmentsStore{}

	w := putAssignments(repo, "12", `{}`)

	assert.Equal(t, http.StatusBadRequest, w.Code)
	assert.Contains(t, w.Body.String(), "user_ids is required")
	assert.Nil(t, repo.gotIDs, "nothing reaches the repository")
}

func Test_PutCaseAssignmentsHandler_BlankUserIDRejected(t *testing.T) {
	repo := &mockAssignmentsStore{}

	w := putAssignments(repo, "12", `{"user_ids":["u1","  "]}`)

	assert.Equal(t, http.StatusBadRequest, w.Code)
	assert.Nil(t, repo.gotIDs)
}

func Test_PutCaseAssignmentsHandler_MalformedBodyRejected(t *testing.T) {
	repo := &mockAssignmentsStore{}

	w := putAssignments(repo, "12", `{"user_ids":"nope"}`)

	assert.Equal(t, http.StatusBadRequest, w.Code)
	assert.Nil(t, repo.gotIDs)
}

func Test_PutCaseAssignmentsHandler_MalformedCaseId(t *testing.T) {
	repo := &mockAssignmentsStore{}

	w := putAssignments(repo, "abc", `{"user_ids":[]}`)

	assert.Equal(t, http.StatusNotFound, w.Code)
	assert.Nil(t, repo.gotIDs)
}

func Test_PutCaseAssignmentsHandler_RepositoryError(t *testing.T) {
	repo := &mockAssignmentsStore{err: errors.New("boom")}

	w := putAssignments(repo, "12", `{"user_ids":[]}`)

	assert.Equal(t, http.StatusInternalServerError, w.Code)
	assert.JSONEq(t, `{"status":500,"message":"Internal Server Error"}`, w.Body.String())
}

// A token the caller cannot be read from is an authentication failure, not a missing resource:
// the handler answers 401, the same as the middlewares in front of it.
func Test_ListCaseAssignmentCandidatesHandler_UnreadableTokenIs401(t *testing.T) {
	repo := &mockCandidatesRepository{labs: []string{"CQGC"}}

	router := gin.Default()
	router.Use(func(c *gin.Context) { c.Set(TenantContextKey, c.Param("tenant")) })
	router.GET("/:tenant/cases/:case_id/assignment_candidates",
		ListCaseAssignmentCandidatesHandler(repo, repo, &testutils.MockAuth{Error: errors.New("no token")}))

	req, _ := http.NewRequest("GET", "/radiant/cases/12/assignment_candidates", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusUnauthorized, w.Code)
	assert.Empty(t, repo.gotOrg, "nothing is looked up for a caller we cannot identify")
}

// The picker puts the caller first, so the handler has to tell the repository who is asking.
func Test_ListCaseAssignmentCandidatesHandler_PassesTheCallerToTheRepository(t *testing.T) {
	repo := &mockCandidatesRepository{labs: []string{"CQGC"}}

	w := candidatesRequest(repo, "12/assignment_candidates")

	assert.Equal(t, http.StatusOK, w.Code)
	assert.Equal(t, callerUserID, repo.gotCaller)
}
