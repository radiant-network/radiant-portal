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

type mockOrganizationsReader struct {
	organizations []types.OrganizationResponse
	err           error
}

func (m *mockOrganizationsReader) ListOrganizations(_ context.Context) ([]types.OrganizationResponse, error) {
	return m.organizations, m.err
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
