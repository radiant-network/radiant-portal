package main

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/repository/postgres"
	"github.com/radiant-network/radiant-api/internal/repository/starrocks"
	"github.com/radiant-network/radiant-api/internal/server"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
)

// Patient keys of the pcx_patients fixture: ...01 is at CHOP, where alice holds can_read_pii, ...04 at BCH.
const (
	patientKeyAtCHOP = "00000000-0000-4000-8000-000000000001"
	patientKeyAtBCH  = "00000000-0000-4000-8000-000000000004"
)

func assertPatientDownloadGate(t *testing.T, userID, patientKey string, expected int) {
	t.Helper()
	testutils.RunTest(t, testutils.Need{Starrocks: "pcx_patients", Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		authRepo := postgres.NewAuthRepository(database.PostgresDB{DB: env.Postgres})
		patients := starrocks.NewPcxPatientsRepository(database.StarrocksDB{DB: env.Starrocks})
		auth := &testutils.MockAuth{Id: userID}

		router := gin.New()
		tenantRoutes := router.Group("/:tenant")
		tenantRoutes.Use(server.RequireTenantAccess(auth, authRepo))
		tenantRoutes.GET("/patients/:patient_key/processing_report/download_url",
			server.RequireActionAt(auth, authRepo, types.ActionReadPII, server.OrgFromPatientKeyParam(patients)),
			func(c *gin.Context) { c.Status(http.StatusOK) })

		w := httptest.NewRecorder()
		router.ServeHTTP(w, httptest.NewRequest(http.MethodGet, "/radiant/patients/"+patientKey+"/processing_report/download_url", nil))
		assert.Equal(t, expected, w.Code)
	})
}

func Test_PatientDownloadGate_PhiGranteeAtThePatientsOrgAllowed(t *testing.T) {
	assertPatientDownloadGate(t, aliceID, patientKeyAtCHOP, http.StatusOK)
}

func Test_PatientDownloadGate_PhiGranteeAtAnotherOrgDenied(t *testing.T) {
	assertPatientDownloadGate(t, aliceID, patientKeyAtBCH, http.StatusForbidden)
}

func Test_PatientDownloadGate_WildcardPhiGranteeAllowed(t *testing.T) {
	assertPatientDownloadGate(t, wendyID, patientKeyAtBCH, http.StatusOK)
}

func Test_PatientDownloadGate_WithoutPhiActionDenied(t *testing.T) {
	assertPatientDownloadGate(t, mikeID, patientKeyAtCHOP, http.StatusForbidden)
}

func Test_PatientDownloadGate_UnknownKeyDenied(t *testing.T) {
	assertPatientDownloadGate(t, wendyID, "00000000-0000-4000-8000-000000000999", http.StatusForbidden)
}

func Test_PatientDownloadGate_MalformedKeyDenied(t *testing.T) {
	assertPatientDownloadGate(t, wendyID, "MRN-0002", http.StatusForbidden)
}
