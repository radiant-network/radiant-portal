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

		// GET requests
		for _, route := range []string{
			"sequencing/1/details",
			"cases/1",
			"cases/filters",
			"cases/autocomplete",
			"genes/autocomplete",
			"hpo/autocomplete",
			"igv/1",
			"interpretations/pubmed/1",
			"interpretations/germline",
			"interpretations/somatic",
			"interpretations/germline/1/1/1",
			"interpretations/somatic/1/1/1",
			"mondo/autocomplete",
			"occurrences/germline/snv/1/1/1/1/expanded",
			"occurrences/somatic/snv/1/1/1/1/expanded",
			"users/preferences/table_1",
			"users/sets/1",
			"variants/germline/1/header",
			"variants/germline/1/overview",
			"variants/germline/1/consequences",
			"variants/germline/1/cases/count",
			"variants/germline/cases/filters",
			"variants/germline/1/conditions/omim",
			"variants/germline/1/conditions/clinvar",
			"variants/germline/1/external_frequencies",
			"variants/germline/1/internal_frequencies",
			"notes/1/1/1/10000",
			"cases/1/1/tasks_with_occurrences?data_type=germline_snv",
		} {
			resp, err = http.Get(fmt.Sprintf("http://localhost:%d/%s", randomPort, route))
			assert.NoError(t, err)
			assert.Equal(t, 401, resp.StatusCode)
		}

		// POST requests
		for _, route := range []string{
			"cases/search",
			"genes/search",
			"interpretations/germline/1/1/1",
			"interpretations/somatic/1/1/1",
			"occurrences/germline/snv/1/1/1/count",
			"occurrences/germline/snv/1/1/1/list",
			"occurrences/germline/snv/1/1/1/aggregate",
			"occurrences/germline/snv/1/1/1/statistics",
			"occurrences/somatic/snv/1/1/1/count",
			"occurrences/somatic/snv/1/1/1/list",
			"occurrences/somatic/snv/1/1/1/aggregate",
			"occurrences/somatic/snv/1/1/1/statistics",
			"occurrences/germline/cnv/1/1/1/list",
			"occurrences/flags/1/1/1/10000",
			"users/preferences/table_1",
			"variants/germline/1/cases/interpreted",
			"variants/germline/1/cases/uninterpreted",
			"notes",
		} {
			resp, err = http.Post(fmt.Sprintf("http://localhost:%d/%s", randomPort, route), "application/json", nil)
			assert.NoError(t, err)
			assert.Equal(t, 401, resp.StatusCode)
		}

		// DELETE requests
		for _, route := range []string{
			"occurrences/flags/1/1/1/10000",
		} {
			req, err := http.NewRequest(http.MethodDelete, fmt.Sprintf("http://localhost:%d/%s", randomPort, route), nil)
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
