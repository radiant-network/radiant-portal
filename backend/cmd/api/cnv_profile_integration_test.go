package main

import (
	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/repository/starrocks"
	"github.com/radiant-network/radiant-api/internal/server"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"net/http"
	"net/http/httptest"
	"testing"
)

// Sequencing 70 is a genome: its profile comes with RAD-364.
func Test_GetGermlineCNVProfileHandler_GenomeNotYetSupported(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := starrocks.NewCNVProfileRepository(database.StarrocksDB{DB: env.Starrocks})
		router := tenantRouter()
		router.GET("/:tenant/occurrences/germline/cnv/:case_id/:seq_id/:task_id/profile", server.GetGermlineCNVProfileHandler(repo, nil))

		req, _ := http.NewRequest("GET", "/radiant/occurrences/germline/cnv/70/70/71/profile", nil)
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusUnprocessableEntity, w.Code)
		assert.JSONEq(t, `{"status":422,"message":"cnv profile unsupported: only exome sequencings have one"}`, w.Body.String())
	})
}

// Sequencing 75 is an exome whose calling task 83 wrote no igv file.
func Test_GetGermlineCNVProfileHandler_NoProfileFiles(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := starrocks.NewCNVProfileRepository(database.StarrocksDB{DB: env.Starrocks})
		router := tenantRouter()
		router.GET("/:tenant/occurrences/germline/cnv/:case_id/:seq_id/:task_id/profile", server.GetGermlineCNVProfileHandler(repo, nil))

		req, _ := http.NewRequest("GET", "/radiant/occurrences/germline/cnv/72/75/83/profile", nil)
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusNotFound, w.Code)
		assert.JSONEq(t, `{"status":404,"message":"cnv profile files not found","detail":{"missing":["copy_ratio","baf"]}}`, w.Body.String())
	})
}
