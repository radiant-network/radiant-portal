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
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
)

type caseStatusChangeAuthorizerMock struct {
	labs     map[int]string
	labsErr  error
	granted  map[[2]string]bool
	grantErr error
	checked  [][2]string
}

func (m *caseStatusChangeAuthorizerMock) DiagnosisLabForCases(_ context.Context, _ string, caseIDs []int) (map[int]string, error) {
	if m.labsErr != nil {
		return nil, m.labsErr
	}
	labs := map[int]string{}
	for _, id := range caseIDs {
		if lab, ok := m.labs[id]; ok {
			labs[id] = lab
		}
	}
	return labs, nil
}

func (m *caseStatusChangeAuthorizerMock) HasAction(_ context.Context, _, _, orgCode, actionCode string) (bool, error) {
	m.checked = append(m.checked, [2]string{orgCode, actionCode})
	return m.granted[[2]string{orgCode, actionCode}], m.grantErr
}

func serveCaseStatusGate(repo caseStatusChangeAuthorizer, auth *testutils.MockAuth, body string) *httptest.ResponseRecorder {
	router := tenantRouter()
	router.PATCH("/:tenant/cases/status", RequireCaseStatusChangeActions(auth, repo), func(c *gin.Context) { c.Status(http.StatusOK) })

	req, _ := http.NewRequest("PATCH", "/radiant/cases/status", bytes.NewBufferString(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)
	return w
}

const (
	systemChangeOnCase1 = `{"case_id":1,"status_code":"processing","expected_status_codes":["submitted"]}`
	userChangeOnCase2   = `{"case_id":2,"status_code":"in_review","expected_status_codes":["in_progress"]}`
)

func Test_RequireCaseStatusChangeActions_SystemChangeNeedsIngest(t *testing.T) {
	repo := &caseStatusChangeAuthorizerMock{labs: map[int]string{1: "CQGC"}, granted: map[[2]string]bool{{"CQGC", types.ActionIngestData}: true}}
	w := serveCaseStatusGate(repo, &testutils.MockAuth{}, `{"cases":[`+systemChangeOnCase1+`]}`)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.Equal(t, [][2]string{{"CQGC", types.ActionIngestData}}, repo.checked)
}

func Test_RequireCaseStatusChangeActions_ProcessingToInProgressNeedsIngest(t *testing.T) {
	repo := &caseStatusChangeAuthorizerMock{labs: map[int]string{1: "CQGC"}, granted: map[[2]string]bool{{"CQGC", types.ActionEditCase}: true}}
	w := serveCaseStatusGate(repo, &testutils.MockAuth{}, `{"cases":[{"case_id":1,"status_code":"in_progress","expected_status_codes":["processing"]}]}`)

	assert.Equal(t, http.StatusForbidden, w.Code, "leaving processing is the pipeline's change, even though in_progress is a user status")
}

func Test_RequireCaseStatusChangeActions_UserChangeNeedsEditCase(t *testing.T) {
	repo := &caseStatusChangeAuthorizerMock{labs: map[int]string{2: "CQGC"}, granted: map[[2]string]bool{{"CQGC", types.ActionEditCase}: true}}
	w := serveCaseStatusGate(repo, &testutils.MockAuth{}, `{"cases":[`+userChangeOnCase2+`]}`)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.Equal(t, [][2]string{{"CQGC", types.ActionEditCase}}, repo.checked)
}

func Test_RequireCaseStatusChangeActions_SystemChangeWithoutIngestForbidden(t *testing.T) {
	repo := &caseStatusChangeAuthorizerMock{labs: map[int]string{1: "CQGC"}, granted: map[[2]string]bool{{"CQGC", types.ActionEditCase}: true}}
	w := serveCaseStatusGate(repo, &testutils.MockAuth{}, `{"cases":[`+systemChangeOnCase1+`]}`)

	assert.Equal(t, http.StatusForbidden, w.Code)
}

func Test_RequireCaseStatusChangeActions_UserChangeWithIngestOnlyForbidden(t *testing.T) {
	repo := &caseStatusChangeAuthorizerMock{labs: map[int]string{2: "CQGC"}, granted: map[[2]string]bool{{"CQGC", types.ActionIngestData}: true}}
	w := serveCaseStatusGate(repo, &testutils.MockAuth{}, `{"cases":[`+userChangeOnCase2+`]}`)

	assert.Equal(t, http.StatusForbidden, w.Code, "the pipeline must not be able to make a geneticist's change")
}

func Test_RequireCaseStatusChangeActions_OneMissingGrantRefusesTheRequest(t *testing.T) {
	repo := &caseStatusChangeAuthorizerMock{labs: map[int]string{1: "CQGC", 2: "CQGC"}, granted: map[[2]string]bool{{"CQGC", types.ActionEditCase}: true}}
	w := serveCaseStatusGate(repo, &testutils.MockAuth{}, `{"cases":[`+userChangeOnCase2+`,`+systemChangeOnCase1+`]}`)

	assert.Equal(t, http.StatusForbidden, w.Code)
}

func Test_RequireCaseStatusChangeActions_EachChangeCheckedAtItsOwnLab(t *testing.T) {
	repo := &caseStatusChangeAuthorizerMock{labs: map[int]string{1: "CQGC", 2: "CHUSJ"}, granted: map[[2]string]bool{{"CQGC", types.ActionEditCase}: true}}
	w := serveCaseStatusGate(repo, &testutils.MockAuth{}, `{"cases":[{"case_id":1,"status_code":"in_review","expected_status_codes":["in_progress"]},`+userChangeOnCase2+`]}`)

	assert.Equal(t, http.StatusForbidden, w.Code, "can_edit_case at CQGC does not cover case 2 at CHUSJ")
}

func Test_RequireCaseStatusChangeActions_UnknownCaseForbidden(t *testing.T) {
	repo := &caseStatusChangeAuthorizerMock{labs: map[int]string{}, granted: map[[2]string]bool{{"CQGC", types.ActionIngestData}: true}}
	w := serveCaseStatusGate(repo, &testutils.MockAuth{}, `{"cases":[`+systemChangeOnCase1+`]}`)

	assert.Equal(t, http.StatusForbidden, w.Code)
	assert.Empty(t, repo.checked)
}

func Test_RequireCaseStatusChangeActions_UnattributableBodiesForbidden(t *testing.T) {
	for name, body := range map[string]string{
		"malformed body": "not json",
		"no cases":       `{"cases":[]}`,
		"no case_id":     `{"cases":[{"status_code":"processing","expected_status_codes":["submitted"]}]}`,
	} {
		t.Run(name, func(t *testing.T) {
			repo := &caseStatusChangeAuthorizerMock{}
			assert.Equal(t, http.StatusForbidden, serveCaseStatusGate(repo, &testutils.MockAuth{}, body).Code)
		})
	}
}

func Test_RequireCaseStatusChangeActions_InvalidTokenUnauthorized(t *testing.T) {
	repo := &caseStatusChangeAuthorizerMock{}
	w := serveCaseStatusGate(repo, &testutils.MockAuth{Error: errors.New("bad token")}, `{"cases":[`+systemChangeOnCase1+`]}`)

	assert.Equal(t, http.StatusUnauthorized, w.Code)
}

func Test_RequireCaseStatusChangeActions_LabLookupErrorIsInternal(t *testing.T) {
	repo := &caseStatusChangeAuthorizerMock{labsErr: errors.New("connection refused")}
	w := serveCaseStatusGate(repo, &testutils.MockAuth{}, `{"cases":[`+systemChangeOnCase1+`]}`)

	assert.Equal(t, http.StatusInternalServerError, w.Code)
}

func Test_RequireCaseStatusChangeActions_GrantLookupErrorIsInternal(t *testing.T) {
	repo := &caseStatusChangeAuthorizerMock{labs: map[int]string{1: "CQGC"}, grantErr: errors.New("connection refused")}
	w := serveCaseStatusGate(repo, &testutils.MockAuth{}, `{"cases":[`+systemChangeOnCase1+`]}`)

	assert.Equal(t, http.StatusInternalServerError, w.Code)
}
