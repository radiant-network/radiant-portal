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
		{Code: "CQGC", Name: "Quebec Clinical Genomic Center", CategoryCode: "sequencing_center", CategoryName: "Sequencing Center"},
	}}
	w := serveListOrganizations(repo)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `[
		{"code":"CHOP","name":"Children Hospital of Philadelphia","category_code":"healthcare_provider","category_name":"Healthcare Provider"},
		{"code":"CQGC","name":"Quebec Clinical Genomic Center","category_code":"sequencing_center","category_name":"Sequencing Center"}
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

func Test_PostOrganizationHandler_InvalidCode(t *testing.T) {
	w := servePostOrganization(&mockOrganizationCreator{}, `{"code":"BadCode","name":"X","category_code":"healthcare_provider"}`)
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
