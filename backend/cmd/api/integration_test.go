package main

import (
	"fmt"
	"math/rand"
	"net/http"
	"os"
	"testing"
	"time"

	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

func Test_SecureRoutes(t *testing.T) {
	testutils.ParallelTestWithReadOnlyPostgresAndStarrocks(t, "simple", func(t *testing.T, starrocks *gorm.DB, postgres *gorm.DB) {

		os.Setenv("CORS_ALLOWED_ORIGINS", "*")
		defer os.Unsetenv("CORS_ALLOWED_ORIGINS")

		router := setupRouter(starrocks, postgres)
		randomPort := 10000 + rand.Intn(50000)

		srv := &http.Server{
			Addr:    fmt.Sprintf(":%d", randomPort),
			Handler: router,
		}
		go func() {
			_ = srv.ListenAndServe()
		}()
		defer srv.Close()

		time.Sleep(500 * time.Millisecond)

		// Run your HTTP request tests
		resp, err := http.Get(fmt.Sprintf("http://localhost:%d/status", randomPort))
		assert.NoError(t, err)
		assert.Equal(t, 200, resp.StatusCode)

		// Validate all the other routes are private

		// GET requests. Tenant-scoped routes now live under /{tenant}/; a missing token is
		// still rejected (401) by the Keycloak middleware before tenant resolution, so the
		// tenant segment value is irrelevant here. Global routes (users/*) stay at root.
		for _, route := range []string{
			"radiant/sequencing/1/details",
			"radiant/cases/1",
			"radiant/cases/filters",
			"radiant/cases/autocomplete",
			"radiant/genes/autocomplete",
			"radiant/hpo/autocomplete",
			"radiant/igv/1",
			"radiant/interpretations/pubmed/1",
			"radiant/interpretations/germline",
			"radiant/interpretations/somatic",
			"radiant/interpretations/germline/1/1/1",
			"radiant/interpretations/somatic/1/1/1",
			"radiant/mondo/autocomplete",
			"radiant/occurrences/germline/snv/1/1/1/1/expanded",
			"radiant/occurrences/somatic/snv/1/1/1/1/expanded",
			"users/preferences/table_1",
			"users/sets/1",
			"radiant/variants/germline/1/header",
			"radiant/variants/germline/1/overview",
			"radiant/variants/germline/1/consequences",
			"radiant/variants/germline/1/cases/count",
			"radiant/variants/germline/cases/filters",
			"radiant/variants/germline/1/conditions/omim",
			"radiant/variants/germline/1/conditions/clinvar",
			"radiant/variants/germline/1/external_frequencies",
			"radiant/variants/germline/1/internal_frequencies",
			"radiant/notes/1/1/1/10000",
			"radiant/cases/1/1/tasks_with_occurrences?data_type=germline_snv",
		} {
			resp, err = http.Get(fmt.Sprintf("http://localhost:%d/%s", randomPort, route))
			assert.NoError(t, err)
			assert.Equal(t, 401, resp.StatusCode)
		}

		// POST requests
		for _, route := range []string{
			"radiant/cases/search",
			"radiant/genes/search",
			"radiant/interpretations/germline/1/1/1",
			"radiant/interpretations/somatic/1/1/1",
			"radiant/occurrences/germline/snv/1/1/1/count",
			"radiant/occurrences/germline/snv/1/1/1/list",
			"radiant/occurrences/germline/snv/1/1/1/aggregate",
			"radiant/occurrences/germline/snv/1/1/1/statistics",
			"radiant/occurrences/somatic/snv/1/1/1/count",
			"radiant/occurrences/somatic/snv/1/1/1/list",
			"radiant/occurrences/somatic/snv/1/1/1/aggregate",
			"radiant/occurrences/somatic/snv/1/1/1/statistics",
			"radiant/occurrences/germline/cnv/1/1/1/list",
			"radiant/occurrences/flags/1/1/1/10000",
			"users/preferences/table_1",
			"radiant/variants/germline/1/cases/interpreted",
			"radiant/variants/germline/1/cases/uninterpreted",
			"radiant/notes",
		} {
			resp, err = http.Post(fmt.Sprintf("http://localhost:%d/%s", randomPort, route), "application/json", nil)
			assert.NoError(t, err)
			assert.Equal(t, 401, resp.StatusCode)
		}

		// DELETE requests
		for _, route := range []string{
			"radiant/occurrences/flags/1/1/1/10000",
		} {
			req, err := http.NewRequest(http.MethodDelete, fmt.Sprintf("http://localhost:%d/%s", randomPort, route), nil)
			assert.NoError(t, err)
			resp, err = http.DefaultClient.Do(req)
			assert.NoError(t, err)
			assert.Equal(t, 401, resp.StatusCode)
		}

		// PUT requests
		for _, route := range []string{
			"radiant/patients/batch",
			"radiant/samples/batch",
			"radiant/sequencing/batch",
			"radiant/cases/batch",
		} {
			req, err := http.NewRequest(http.MethodPut, fmt.Sprintf("http://localhost:%d/%s", randomPort, route), nil)
			assert.NoError(t, err)
			resp, err = http.DefaultClient.Do(req)
			assert.NoError(t, err)
			assert.Equal(t, 401, resp.StatusCode)
		}
	})
}

func TestMain(m *testing.M) {
	testutils.StartAllContainers()
	code := m.Run()
	testutils.StopAllContainers()
	os.Exit(code)
}
