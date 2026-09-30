package server

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/radiant-network/radiant-api/internal/notification"
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

type mockCaseGroupNotifier struct {
	report             *types.NotifyCaseGroupResponse
	err                error
	gotTenant, gotName string
}

func (m *mockCaseGroupNotifier) Notify(_ context.Context, tenantCode, groupName string) (*types.NotifyCaseGroupResponse, error) {
	m.gotTenant, m.gotName = tenantCode, groupName
	return m.report, m.err
}

func serveNotify(svc caseGroupNotifier, name string) *httptest.ResponseRecorder {
	router := tenantRouter()
	router.POST("/:tenant/case_groups/:name/notify", PostCaseGroupNotifyHandler(svc))
	req, _ := http.NewRequest("POST", "/radiant/case_groups/"+name+"/notify", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)
	return w
}

func Test_PostCaseGroupNotifyHandler_Report(t *testing.T) {
	svc := &mockCaseGroupNotifier{report: &types.NotifyCaseGroupResponse{
		Group: types.CaseGroupResponse{Name: "run-a", TenantCode: "radiant", CaseIDs: []int{1, 2}},
		Emails: []types.CaseGroupEmailReport{
			{OrganizationCode: "LDM-CHUSJ", Status: types.CaseGroupEmailSent, Recipients: []string{"a@lab.invalid"}, CaseCount: 1, DocumentCount: 3, Template: "manifest_radiant.tmpl",
				Context: types.CaseGroupEmailContext{HasStat: true, AnalysisCodes: []string{"WGS"}, CaseIDs: []int{1}, ManifestFilename: "run-a_20260924_manifest.tsv"}},
			{OrganizationCode: "CQGC", Status: types.CaseGroupEmailSkippedNoContact, Recipients: []string{}, CaseCount: 1, DocumentCount: 2, Template: "manifest_radiant.tmpl",
				Context: types.CaseGroupEmailContext{AnalysisCodes: []string{}, CaseIDs: []int{2}, ManifestFilename: "run-a_20260924_manifest.tsv"}},
		},
	}}
	w := serveNotify(svc, "run-a")

	assert.Equal(t, http.StatusOK, w.Code)
	assert.Equal(t, "radiant", svc.gotTenant)
	assert.Equal(t, "run-a", svc.gotName)
	assert.JSONEq(t, `{
		"group": {"name":"run-a","tenant_code":"radiant","case_ids":[1,2]},
		"emails": [
			{"organization_code":"LDM-CHUSJ","status":"sent","recipients":["a@lab.invalid"],"case_count":1,"document_count":3,"template":"manifest_radiant.tmpl",
			 "context":{"has_stat":true,"analysis_codes":["WGS"],"case_ids":[1],"manifest_filename":"run-a_20260924_manifest.tsv"}},
			{"organization_code":"CQGC","status":"skipped_no_contact","recipients":[],"case_count":1,"document_count":2,"template":"manifest_radiant.tmpl",
			 "context":{"has_stat":false,"analysis_codes":[],"case_ids":[2],"manifest_filename":"run-a_20260924_manifest.tsv"}}
		]
	}`, w.Body.String())
}

func Test_PostCaseGroupNotifyHandler_FailedLabCarriesError(t *testing.T) {
	svc := &mockCaseGroupNotifier{report: &types.NotifyCaseGroupResponse{
		Group:  types.CaseGroupResponse{Name: "run-a", TenantCode: "radiant", CaseIDs: []int{}},
		Emails: []types.CaseGroupEmailReport{{OrganizationCode: "LDM-CHUSJ", Status: types.CaseGroupEmailFailed, Error: "relay refused", Recipients: []string{"a@lab.invalid"}, Context: types.CaseGroupEmailContext{AnalysisCodes: []string{}, CaseIDs: []int{}}}},
	}}
	w := serveNotify(svc, "run-a")

	assert.Equal(t, http.StatusOK, w.Code)
	assert.Contains(t, w.Body.String(), `"status":"failed","error":"relay refused"`)
}

func Test_PostCaseGroupNotifyHandler_InvalidName(t *testing.T) {
	svc := &mockCaseGroupNotifier{}
	w := serveNotify(svc, "bad%20name")
	assert.Equal(t, http.StatusBadRequest, w.Code)
	assert.Empty(t, svc.gotName, "invalid name must not reach the service")
}

func Test_PostCaseGroupNotifyHandler_NotFound(t *testing.T) {
	w := serveNotify(&mockCaseGroupNotifier{err: types.ErrCaseGroupNotFound}, "nope")
	assert.Equal(t, http.StatusNotFound, w.Code)
}

func Test_PostCaseGroupNotifyHandler_TemplateMissing_500Generic(t *testing.T) {
	w := serveNotify(&mockCaseGroupNotifier{err: fmt.Errorf("%w %q", notification.ErrTemplateMissing, "radiant")}, "run-a")
	assert.Equal(t, http.StatusInternalServerError, w.Code)
	assert.JSONEq(t, `{"status":500,"message":"Internal Server Error"}`, w.Body.String())
}

func Test_PostCaseGroupNotifyHandler_ServiceError_500(t *testing.T) {
	w := serveNotify(&mockCaseGroupNotifier{err: errors.New("boom")}, "run-a")
	assert.Equal(t, http.StatusInternalServerError, w.Code)
	assert.JSONEq(t, `{"status":500,"message":"Internal Server Error"}`, w.Body.String())
}
