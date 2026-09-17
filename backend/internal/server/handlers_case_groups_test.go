package server

import (
	"context"
	"errors"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
)

type mockCaseGroupStore struct {
	upsertErr error
	getErr    error
	stored    *types.CaseGroup
	storedIDs []int

	gotTenant, gotName, gotCreatedBy string
	gotCaseIDs                       []int
}

func (m *mockCaseGroupStore) UpsertCaseGroup(_ context.Context, tenantCode, name string, caseIDs []int, createdBy string) (*types.CaseGroup, []int, error) {
	m.gotTenant, m.gotName, m.gotCaseIDs, m.gotCreatedBy = tenantCode, name, caseIDs, createdBy
	if m.upsertErr != nil {
		return nil, nil, m.upsertErr
	}
	return &types.CaseGroup{ID: 7, TenantCode: tenantCode, Name: name, CreatedBy: createdBy}, types.NormalizeCaseIDs(caseIDs), nil
}

func (m *mockCaseGroupStore) GetCaseGroupByName(_ context.Context, _, _ string) (*types.CaseGroup, []int, error) {
	return m.stored, m.storedIDs, m.getErr
}

func serveCaseGroups(store caseGroupStore, method, path, body string) *httptest.ResponseRecorder {
	router := tenantRouter()
	router.POST("/:tenant/case_groups", PostCaseGroupHandler(store, &testutils.MockAuth{Id: "user-sub"}))
	router.GET("/:tenant/case_groups/:name", GetCaseGroupHandler(store))
	req, _ := http.NewRequest(method, path, strings.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)
	return w
}

func Test_PostCaseGroupHandler_Success(t *testing.T) {
	store := &mockCaseGroupStore{}
	w := serveCaseGroups(store, "POST", "/radiant/case_groups", `{"name":"run_1","case_ids":[3,1,3]}`)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `{"name":"run_1","tenant_code":"radiant","case_ids":[3,1]}`, w.Body.String())
	assert.Equal(t, "radiant", store.gotTenant)
	assert.Equal(t, "run_1", store.gotName)
	assert.Equal(t, []int{3, 1, 3}, store.gotCaseIDs)
	assert.Equal(t, "user-sub", store.gotCreatedBy)
}

func Test_PostCaseGroupHandler_EmptyCaseIds(t *testing.T) {
	w := serveCaseGroups(&mockCaseGroupStore{}, "POST", "/radiant/case_groups", `{"name":"run_1","case_ids":[]}`)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `{"name":"run_1","tenant_code":"radiant","case_ids":[]}`, w.Body.String())
}

func Test_PostCaseGroupHandler_MissingCaseIds_400(t *testing.T) {
	w := serveCaseGroups(&mockCaseGroupStore{}, "POST", "/radiant/case_groups", `{"name":"run_1"}`)
	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func Test_PostCaseGroupHandler_InvalidName_400(t *testing.T) {
	store := &mockCaseGroupStore{}
	w := serveCaseGroups(store, "POST", "/radiant/case_groups", `{"name":"bad/name","case_ids":[1]}`)

	assert.Equal(t, http.StatusBadRequest, w.Code)
	assert.Empty(t, store.gotName, "store must not be called on an invalid name")
}

func Test_PostCaseGroupHandler_UnknownCaseIds_400ListsIds(t *testing.T) {
	store := &mockCaseGroupStore{upsertErr: &types.UnknownCaseIDsError{IDs: []int{7, 42}}}
	w := serveCaseGroups(store, "POST", "/radiant/case_groups", `{"name":"run_1","case_ids":[1,7,42]}`)

	assert.Equal(t, http.StatusBadRequest, w.Code)
	assert.JSONEq(t, `{"status":400,"message":"unknown case ids in this tenant: [7 42]"}`, w.Body.String())
}

func Test_PostCaseGroupHandler_StoreError_500Generic(t *testing.T) {
	store := &mockCaseGroupStore{upsertErr: errors.New("boom")}
	w := serveCaseGroups(store, "POST", "/radiant/case_groups", `{"name":"run_1","case_ids":[1]}`)

	assert.Equal(t, http.StatusInternalServerError, w.Code)
	assert.JSONEq(t, `{"status":500,"message":"Internal Server Error"}`, w.Body.String())
}

func Test_GetCaseGroupHandler_Success(t *testing.T) {
	store := &mockCaseGroupStore{stored: &types.CaseGroup{ID: 7, TenantCode: "radiant", Name: "run_1"}, storedIDs: []int{1, 3}}
	w := serveCaseGroups(store, "GET", "/radiant/case_groups/run_1", "")

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `{"name":"run_1","tenant_code":"radiant","case_ids":[1,3]}`, w.Body.String())
}

func Test_GetCaseGroupHandler_NotFound_404(t *testing.T) {
	w := serveCaseGroups(&mockCaseGroupStore{}, "GET", "/radiant/case_groups/run_missing", "")

	assert.Equal(t, http.StatusNotFound, w.Code)
	assert.JSONEq(t, `{"status":404,"message":"case group not found"}`, w.Body.String())
}

func Test_GetCaseGroupHandler_InvalidName_400(t *testing.T) {
	w := serveCaseGroups(&mockCaseGroupStore{}, "GET", "/radiant/case_groups/-bad", "")
	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func Test_GetCaseGroupHandler_StoreError_500Generic(t *testing.T) {
	w := serveCaseGroups(&mockCaseGroupStore{getErr: errors.New("boom")}, "GET", "/radiant/case_groups/run_1", "")

	assert.Equal(t, http.StatusInternalServerError, w.Code)
	assert.JSONEq(t, `{"status":500,"message":"Internal Server Error"}`, w.Body.String())
}
