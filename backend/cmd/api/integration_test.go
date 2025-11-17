package main

import (
	"fmt"
	"math/rand"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"
	"time"

	"github.com/radiant-network/radiant-api/internal/authorization"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/radiant-network/radiant-api/test/testutils/jwt"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

func Test_SecureRoutes(t *testing.T) {
	testutils.ParallelTestWithPostgresAndStarrocks(t, "simple", func(t *testing.T, starrocks *gorm.DB, postgres *gorm.DB) {

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
			"assays/1",
			"cases/1",
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
			"occurrences/germline/snv/1/1/expanded",
			"sequencing/1",
			"users/preferences",
			"users/sets/1",
			"variants/germline/1/header",
			"variants/germline/1/overview",
			"variants/germline/1/consequences",
			"variants/germline/1/cases/interpreted/1/1",
			"variants/germline/1/cases/count",
			"variants/germline/cases/filters",
			"variants/germline/1/conditions/omim",
			"variants/germline/1/conditions/clinvar",
		} {
			resp, err = http.Get(fmt.Sprintf("http://localhost:%d/%s", randomPort, route))
			assert.NoError(t, err)
			assert.Equal(t, 401, resp.StatusCode)
		}

		// POST requests
		for _, route := range []string{
			"cases/search",
			"cases/filters",
			"interpretations/germline/1/1/1",
			"interpretations/somatic/1/1/1",
			"occurrences/germline/snv/1/count",
			"occurrences/germline/snv/1/list",
			"occurrences/germline/snv/1/aggregate",
			"occurrences/germline/snv/1/statistics",
			"occurrences/germline/cnv/1/list",
			"users/preferences",
			"variants/germline/1/cases/interpreted",
			"variants/germline/1/cases/uninterpreted",
		} {
			resp, err = http.Post(fmt.Sprintf("http://localhost:%d/%s", randomPort, route), "application/json", nil)
			assert.NoError(t, err)
			assert.Equal(t, 401, resp.StatusCode)
		}
	})
}

func Test_OpenFGA_Authorization(t *testing.T) {
	testutils.ParallelTestWithOpenFGAAndPostgresAndStarrocks(t, "simple",
		func(t *testing.T, openfga *authorization.OpenFGAModelConfiguration, starrocks *gorm.DB, postgres *gorm.DB) {
			token, err := jwt.GenerateMockJWT()
			assert.NoError(t, err)

			// We can't use t.Setenv because we need OpenFGA context during the setup of the environment
			for key, value := range map[string]string{
				"CORS_ALLOWED_ORIGINS":                   "*",
				"RADIANT_AUTHORIZATION_PROVIDER":         "openfga",
				"RADIANT_AUTHORIZATION_OPENFGA_ENDPOINT": openfga.Endpoint,
				"RADIANT_AUTHORIZATION_OPENFGA_STORE_ID": openfga.StoreID,
			} {
				os.Setenv(key, value)
				defer os.Unsetenv(key)
			}

			router := setupRouter(starrocks, postgres)
			server := httptest.NewServer(router)
			t.Cleanup(server.Close)

			resp, err := http.Get(server.URL + "/status")
			assert.NoError(t, err)
			assert.Equal(t, http.StatusOK, resp.StatusCode)

			client := server.Client()

			getTests := []struct {
				route string
				code  int
			}{
				{"assays/1", 200},
				{"cases/1", 200},
				{"genes/autocomplete", 200},
				{"hpo/autocomplete", 200},
				{"igv/1", 404},
				{"interpretations/pubmed/1", 500},
				{"mondo/autocomplete", 200},
				{"occurrences/germline/snv/1/1000/expanded", 200},
				{"sequencing/1", 200},
				{"users/sets/1", 500},
				{"variants/germline/1000/header", 200},
			}

			for _, tc := range getTests {
				t.Run("GET_"+tc.route, func(t *testing.T) {
					req, err := http.NewRequest(http.MethodGet, server.URL+"/"+tc.route, nil)
					assert.NoError(t, err)
					req.Header.Set("Authorization", "Bearer "+token)

					res, err := client.Do(req)
					assert.NoError(t, err)
					defer res.Body.Close()
					assert.Equal(t, tc.code, res.StatusCode)
				})
			}

			postTests := []struct {
				route string
				code  int
			}{
				{"cases/search", 400},
				{"cases/filters", 400},
				{"interpretations/germline/1/1000/T001", 400},
				{"occurrences/germline/snv/1/count", 400},
				{"variants/germline/1000/cases/interpreted", 400},
			}

			for _, tc := range postTests {
				t.Run("POST_"+tc.route, func(t *testing.T) {
					req, err := http.NewRequest(http.MethodPost, server.URL+"/"+tc.route, nil)
					assert.NoError(t, err)
					req.Header.Set("Authorization", "Bearer "+token)

					res, err := client.Do(req)
					assert.NoError(t, err)
					defer res.Body.Close()
					assert.Equal(t, tc.code, res.StatusCode)
				})
			}
		})
}

func TestMain(m *testing.M) {
	testutils.StartAllContainers()
	code := m.Run()
	testutils.StopAllContainers()
	os.Exit(code)
}
