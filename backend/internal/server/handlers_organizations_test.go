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

type mockOrganizationsReader struct {
	organizations []types.OrganizationResponse
	err           error
}

func (m *mockOrganizationsReader) ListOrganizations(_ context.Context) ([]types.OrganizationResponse, error) {
	return m.organizations, m.err
}

type mockOrganizationCreator struct {
	err error
	got types.Organization
}

func (m *mockOrganizationCreator) CreateOrganization(_ context.Context, org types.Organization) error {
	m.got = org
	return m.err
}

type mockOrganizationUpdater struct {
	err                error
	gotTenant, gotCode string
	got                types.UpdateOrganizationRequest
}

func (m *mockOrganizationUpdater) UpdateOrganization(_ context.Context, tenantCode, code string, req types.UpdateOrganizationRequest) error {
	m.gotTenant, m.gotCode, m.got = tenantCode, code, req
	return m.err
}

func serveListOrganizations(repo organizationsReader) *httptest.ResponseRecorder {
	router := gin.Default()
	router.GET("/:tenant/organizations", ListOrganizationsHandler(repo))
	req, _ := http.NewRequest("GET", "/radiant/organizations", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)
	return w
}

func Test_ListOrganizationsHandler(t *testing.T) {
	repo := &mockOrganizationsReader{organizations: []types.OrganizationResponse{
		{Code: "CHOP", Name: "Children Hospital of Philadelphia", CategoryCode: "healthcare_provider", CategoryName: "Healthcare Provider"},
		{Code: "CQGC", Name: "Quebec Clinical Genomic Center", CategoryCode: "sequencing_center", CategoryName: "Sequencing Center", NotificationEmails: "a@cqgc.invalid,b@cqgc.invalid"},
	}}
	w := serveListOrganizations(repo)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `[
		{"code":"CHOP","name":"Children Hospital of Philadelphia","category_code":"healthcare_provider","category_name":"Healthcare Provider","notification_emails":""},
		{"code":"CQGC","name":"Quebec Clinical Genomic Center","category_code":"sequencing_center","category_name":"Sequencing Center","notification_emails":"a@cqgc.invalid,b@cqgc.invalid"}
	]`, w.Body.String())
}

func Test_ListOrganizationsHandler_Empty(t *testing.T) {
	repo := &mockOrganizationsReader{organizations: []types.OrganizationResponse{}}
	w := serveListOrganizations(repo)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `[]`, w.Body.String())
}

func Test_ListOrganizationsHandler_RepoError(t *testing.T) {
	repo := &mockOrganizationsReader{err: errors.New("boom")}
	w := serveListOrganizations(repo)

	assert.Equal(t, http.StatusInternalServerError, w.Code)
	assert.JSONEq(t, `{"status":500,"message":"Internal Server Error"}`, w.Body.String())
}

func servePostOrganization(repo organizationCreator, body string) *httptest.ResponseRecorder {
	router := gin.Default()
	group := router.Group("/:tenant")
	group.Use(func(c *gin.Context) { c.Set(TenantContextKey, c.Param("tenant")) })
	group.POST("/organizations", PostOrganizationHandler(repo))
	req, _ := http.NewRequest("POST", "/radiant/organizations", strings.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)
	return w
}

func Test_PostOrganizationHandler(t *testing.T) {
	repo := &mockOrganizationCreator{}
	w := servePostOrganization(repo, `{"code":"chop2","name":"CHOP 2","category_code":"healthcare_provider"}`)

	assert.Equal(t, http.StatusCreated, w.Code)
	assert.Empty(t, w.Body.String())
	assert.Equal(t, types.Organization{Code: "chop2", Name: "CHOP 2", CategoryCode: "healthcare_provider", TenantCode: "radiant"}, repo.got)
}

func Test_PostOrganizationHandler_WithNotificationEmails(t *testing.T) {
	repo := &mockOrganizationCreator{}
	w := servePostOrganization(repo, `{"code":"ldm2","name":"Lab 2","category_code":"diagnostic_laboratory","notification_emails":"a@lab.invalid, b@lab.invalid"}`)

	assert.Equal(t, http.StatusCreated, w.Code)
	assert.Equal(t, "a@lab.invalid, b@lab.invalid", *repo.got.NotificationEmails)
}

func Test_PostOrganizationHandler_InvalidNotificationEmail(t *testing.T) {
	repo := &mockOrganizationCreator{}
	w := servePostOrganization(repo, `{"code":"ldm2","name":"Lab 2","category_code":"diagnostic_laboratory","notification_emails":"not-an-email"}`)

	assert.Equal(t, http.StatusBadRequest, w.Code)
	assert.Empty(t, repo.got.Code, "invalid payload must not reach the repository")
}

func Test_PostOrganizationHandler_InvalidCode(t *testing.T) {
	// starts with a digit → invalid (uppercase and dashes are allowed, e.g. LDM-CHUSJ).
	w := servePostOrganization(&mockOrganizationCreator{}, `{"code":"9chop","name":"X","category_code":"healthcare_provider"}`)
	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func Test_PostOrganizationHandler_MissingName(t *testing.T) {
	w := servePostOrganization(&mockOrganizationCreator{}, `{"code":"chop2","category_code":"healthcare_provider"}`)
	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func Test_PostOrganizationHandler_DuplicateCode(t *testing.T) {
	repo := &mockOrganizationCreator{err: types.ErrOrganizationCodeExists}
	w := servePostOrganization(repo, `{"code":"chop","name":"X","category_code":"healthcare_provider"}`)
	assert.Equal(t, http.StatusConflict, w.Code)
}

func Test_PostOrganizationHandler_UnknownCategory(t *testing.T) {
	repo := &mockOrganizationCreator{err: types.ErrOrganizationUnknownCategory}
	w := servePostOrganization(repo, `{"code":"chop2","name":"X","category_code":"nope"}`)
	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func Test_PostOrganizationHandler_RepoError(t *testing.T) {
	repo := &mockOrganizationCreator{err: errors.New("boom")}
	w := servePostOrganization(repo, `{"code":"chop2","name":"X","category_code":"healthcare_provider"}`)
	assert.Equal(t, http.StatusInternalServerError, w.Code)
	assert.JSONEq(t, `{"status":500,"message":"Internal Server Error"}`, w.Body.String())
}

func servePutOrganization(repo organizationUpdater, code, body string) *httptest.ResponseRecorder {
	router := gin.Default()
	group := router.Group("/:tenant")
	group.Use(func(c *gin.Context) { c.Set(TenantContextKey, c.Param("tenant")) })
	group.PUT("/organizations/:code", PutOrganizationHandler(repo))
	req, _ := http.NewRequest("PUT", "/radiant/organizations/"+code, strings.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)
	return w
}

func Test_PutOrganizationHandler(t *testing.T) {
	repo := &mockOrganizationUpdater{}
	w := servePutOrganization(repo, "CHOP", `{"name":"New Name"}`)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.Empty(t, w.Body.String())
	assert.Equal(t, "radiant", repo.gotTenant)
	assert.Equal(t, "CHOP", repo.gotCode)
	assert.Equal(t, "New Name", repo.got.Name)
	assert.Equal(t, "", repo.got.NotificationEmails)
}

func Test_PutOrganizationHandler_NotificationEmails(t *testing.T) {
	repo := &mockOrganizationUpdater{}
	w := servePutOrganization(repo, "LDM-CHUSJ", `{"name":"Lab","notification_emails":"a@lab.invalid,b@lab.invalid"}`)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.Equal(t, "a@lab.invalid,b@lab.invalid", repo.got.NotificationEmails)
}

func Test_PutOrganizationHandler_InvalidNotificationEmail(t *testing.T) {
	repo := &mockOrganizationUpdater{}
	w := servePutOrganization(repo, "LDM-CHUSJ", `{"name":"Lab","notification_emails":"Lab <a@lab.invalid>"}`)

	assert.Equal(t, http.StatusBadRequest, w.Code)
	assert.Empty(t, repo.gotCode, "invalid payload must not reach the repository")
}

func Test_PutOrganizationHandler_MissingName(t *testing.T) {
	w := servePutOrganization(&mockOrganizationUpdater{}, "CHOP", `{}`)
	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func Test_PutOrganizationHandler_NotFound(t *testing.T) {
	repo := &mockOrganizationUpdater{err: types.ErrOrganizationNotFound}
	w := servePutOrganization(repo, "nope", `{"name":"X"}`)
	assert.Equal(t, http.StatusNotFound, w.Code)
}

func Test_PutOrganizationHandler_RepoError(t *testing.T) {
	repo := &mockOrganizationUpdater{err: errors.New("boom")}
	w := servePutOrganization(repo, "CHOP", `{"name":"X"}`)
	assert.Equal(t, http.StatusInternalServerError, w.Code)
	assert.JSONEq(t, `{"status":500,"message":"Internal Server Error"}`, w.Body.String())
}
