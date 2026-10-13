package server

import (
	"context"
	"errors"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

// scopedCasesReader embeds the shared mock and records the query the handler built, so a test
// can look at the filter the case_group criterion was turned into.
type scopedCasesReader struct {
	MockRepository
	gotQuery types.ListQuery
	calls    int
}

func (m *scopedCasesReader) SearchCases(ctx context.Context, userQuery types.ListQuery) (*[]types.CaseResult, *int64, error) {
	m.gotQuery = userQuery
	m.calls++
	return m.MockRepository.SearchCases(ctx, userQuery)
}

type mockCaseGroupReader struct {
	groups  map[string][]int
	err     error
	lookups []string
}

func (m *mockCaseGroupReader) GetCaseGroupByName(_ context.Context, _, name string) (*types.CaseGroup, []int, error) {
	m.lookups = append(m.lookups, name)
	if m.err != nil {
		return nil, nil, m.err
	}
	ids, ok := m.groups[name]
	if !ok {
		return nil, nil, nil
	}
	return &types.CaseGroup{Name: name}, ids, nil
}

func serveCasesSearch(repo *scopedCasesReader, groups caseGroupReader, body string) *httptest.ResponseRecorder {
	router := tenantRouter()
	router.POST("/:tenant/cases/search", SearchCasesHandler(repo, repo, groups))
	req, _ := http.NewRequest("POST", "/radiant/cases/search", strings.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)
	return w
}

func comparisons(t *testing.T, query types.ListQuery) []*types.ComparisonNode {
	t.Helper()
	root, ok := query.Filters().(*types.AndNode)
	require.True(t, ok, "root filter is an AND node")
	out := make([]*types.ComparisonNode, 0, len(root.Children))
	for _, child := range root.Children {
		leaf, ok := child.(*types.ComparisonNode)
		require.True(t, ok, "criteria map to comparison leaves")
		out = append(out, leaf)
	}
	return out
}

func Test_SearchCasesHandler_CaseGroup_BecomesCaseIdFilter(t *testing.T) {
	repo := &scopedCasesReader{}
	groups := &mockCaseGroupReader{groups: map[string][]int{"run_1": {3, 1}}}
	w := serveCasesSearch(repo, groups, `{"search_criteria":[
		{"field":"case_group","operator":"in","value":["run_1"]},
		{"field":"priority_code","value":["stat"]}
	]}`)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.Equal(t, []string{"run_1"}, groups.lookups)
	leaves := comparisons(t, repo.gotQuery)
	require.Len(t, leaves, 2)
	assert.Equal(t, "priority_code", leaves[0].Field.GetAlias())
	assert.Equal(t, "case_id", leaves[1].Field.GetAlias())
	assert.Equal(t, "in", leaves[1].Operator)
	assert.Equal(t, []interface{}{3, 1}, leaves[1].Value)
}

func Test_SearchCasesHandler_CaseGroup_SeveralGroups_Union(t *testing.T) {
	repo := &scopedCasesReader{}
	groups := &mockCaseGroupReader{groups: map[string][]int{"run_1": {1, 2}, "run_2": {2, 5}}}
	w := serveCasesSearch(repo, groups, `{"search_criteria":[{"field":"case_group","value":["run_1","run_2"]}]}`)

	assert.Equal(t, http.StatusOK, w.Code)
	leaves := comparisons(t, repo.gotQuery)
	require.Len(t, leaves, 1)
	assert.Equal(t, []interface{}{1, 2, 5}, leaves[0].Value)
}

func Test_SearchCasesHandler_CaseGroup_Unknown_EmptyPageWithoutQuery(t *testing.T) {
	repo := &scopedCasesReader{}
	w := serveCasesSearch(repo, &mockCaseGroupReader{}, `{"search_criteria":[{"field":"case_group","value":["run_missing"]}]}`)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `{"list":[],"count":0}`, w.Body.String())
	assert.Zero(t, repo.calls, "no search when no case can match")
}

func Test_SearchCasesHandler_CaseGroup_EmptyGroup_EmptyPage(t *testing.T) {
	repo := &scopedCasesReader{}
	w := serveCasesSearch(repo, &mockCaseGroupReader{groups: map[string][]int{"run_empty": {}}}, `{"search_criteria":[{"field":"case_group","value":["run_empty"]}]}`)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `{"list":[],"count":0}`, w.Body.String())
}

func Test_SearchCasesHandler_CaseGroup_InvalidName_EmptyPageNoLookup(t *testing.T) {
	groups := &mockCaseGroupReader{}
	w := serveCasesSearch(&scopedCasesReader{}, groups, `{"search_criteria":[{"field":"case_group","value":["bad/name"]}]}`)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `{"list":[],"count":0}`, w.Body.String())
	assert.Empty(t, groups.lookups)
}

func Test_SearchCasesHandler_CaseGroup_UnsupportedOperator_400(t *testing.T) {
	groups := &mockCaseGroupReader{}
	w := serveCasesSearch(&scopedCasesReader{}, groups, `{"search_criteria":[{"field":"case_group","operator":"not-in","value":["run_1"]}]}`)

	assert.Equal(t, http.StatusBadRequest, w.Code)
	assert.JSONEq(t, `{"status":400,"message":"operation not-in is not supported on case_group, only in"}`, w.Body.String())
	assert.Empty(t, groups.lookups)
}

func Test_SearchCasesHandler_CaseGroup_StoreError_500Generic(t *testing.T) {
	w := serveCasesSearch(&scopedCasesReader{}, &mockCaseGroupReader{err: errors.New("boom")}, `{"search_criteria":[{"field":"case_group","value":["run_1"]}]}`)

	assert.Equal(t, http.StatusInternalServerError, w.Code)
	assert.JSONEq(t, `{"status":500,"message":"Internal Server Error"}`, w.Body.String())
}

func Test_SearchCasesHandler_NoCaseGroup_NoLookup(t *testing.T) {
	groups := &mockCaseGroupReader{}
	w := serveCasesSearch(&scopedCasesReader{}, groups, `{"search_criteria":[{"field":"priority_code","value":["stat"]}]}`)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.Empty(t, groups.lookups)
}
