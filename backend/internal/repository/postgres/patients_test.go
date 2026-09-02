package postgres

import (
	"testing"
	"time"

	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/internal/utils"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func Test_GetPatientBySubmitterPatientId_Not_Null(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewPatientsRepository(database.PostgresDB{DB: env.Postgres})
		patient, err := repo.GetPatientByOrgCodeAndSubmitterPatientId(t.Context(), "CHUSJ", "MRN-283773", types.DefaultTenantCode)
		assert.NoError(t, err)
		assert.NotNil(t, patient)
		assert.Equal(t, 1, patient.ID)
		assert.Equal(t, "female", patient.SexCode)
	})
}

func Test_GetPatientBySubmitterPatientId_Null_Mrn(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewPatientsRepository(database.PostgresDB{DB: env.Postgres})
		patient, err := repo.GetPatientByOrgCodeAndSubmitterPatientId(t.Context(), "CHUSJ", "MRN-UNKNOWN", types.DefaultTenantCode)
		assert.NoError(t, err)
		assert.Nil(t, patient)
	})
}

func Test_GetPatientBySubmitterPatientId_Null_OrgId(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewPatientsRepository(database.PostgresDB{DB: env.Postgres})
		patient, err := repo.GetPatientByOrgCodeAndSubmitterPatientId(t.Context(), "UNKNOWN-ORG", "MRN-283773", types.DefaultTenantCode)
		assert.NoError(t, err)
		assert.Nil(t, patient)
	})
}

// Test_GetPatientBySubmitterPatientId_Null_TenantCode reproduces CLIN-6157: the same
// (organization_code, submitter_patient_id) exists under a different tenant, so the lookup must
// not resolve it — it is a distinct patient, not a fallback across tenants.
func Test_GetPatientBySubmitterPatientId_Null_TenantCode(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewPatientsRepository(database.PostgresDB{DB: env.Postgres})
		patient, err := repo.GetPatientByOrgCodeAndSubmitterPatientId(t.Context(), "CHUSJ", "MRN-283773", "other-tenant")
		assert.NoError(t, err)
		assert.Nil(t, patient)
	})
}

func Test_UpdatePatient_ExistingRow(t *testing.T) {
	// ExclusivePostgres: inserts directly into "patient" (id >= 1000), a table other parallel
	// WritePostgres tests may bulk-clean concurrently — see setup_postgres.go cleanUp.
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		db := env.Postgres
		repo := NewPatientsRepository(database.PostgresDB{DB: db})

		err := db.Exec(`
			INSERT INTO patient (id, submitter_patient_id, submitter_patient_id_type, organization_code, tenant_code, sex_code, date_of_birth, life_status_code, first_name, last_name, jhn)
			VALUES (1001, 'MRN-UPDATE-1', 'mrn', 'CHUSJ', 'radiant', 'male', '2000-01-01', 'alive', 'Original', 'Name', 'JHN-ORIGINAL')
		`).Error
		require.NoError(t, err)

		dob := types.DateISO8601(time.Date(2001, 2, 3, 0, 0, 0, 0, time.UTC))
		updated := &types.Patient{
			SubmitterPatientId:     "MRN-UPDATE-1",
			OrganizationCode:       "CHUSJ",
			TenantCode:             types.DefaultTenantCode,
			SubmitterPatientIdType: "ramq",
			SexCode:                "female",
			LifeStatusCode:         "deceased",
			FirstName:              "Updated",
			LastName:               "Person",
			Jhn:                    "JHN-UPDATED",
			DateOfBirth:            utils.TimePtr(time.Time(dob)),
		}
		err = repo.UpdatePatient(t.Context(), updated)
		require.NoError(t, err)

		patient, err := repo.GetPatientByOrgCodeAndSubmitterPatientId(t.Context(), "CHUSJ", "MRN-UPDATE-1", types.DefaultTenantCode)
		require.NoError(t, err)
		require.NotNil(t, patient)
		assert.Equal(t, "ramq", patient.SubmitterPatientIdType)
		assert.Equal(t, "female", patient.SexCode)
		assert.Equal(t, "deceased", patient.LifeStatusCode)
		assert.Equal(t, "Updated", patient.FirstName)
		assert.Equal(t, "Person", patient.LastName)
		assert.Equal(t, "JHN-UPDATED", patient.Jhn)
		require.NotNil(t, patient.DateOfBirth)
		assert.True(t, time.Time(dob).Equal(*patient.DateOfBirth))
	})
}

// Test_UpdatePatient_DoesNotUpdateAnotherTenantsPatient reproduces CLIN-6157 on the write side:
// a patient row sharing (organization_code, submitter_patient_id) with the one being updated,
// but belonging to a different tenant, must be left untouched.
func Test_UpdatePatient_DoesNotUpdateAnotherTenantsPatient(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		db := env.Postgres
		repo := NewPatientsRepository(database.PostgresDB{DB: db})

		// A dedicated org code — not "CHUSJ" — so the temporary duplicate (code, *) pair below
		// can't make an unrelated, concurrently-running test's unscoped org lookup flaky.
		const orgCode = "TENANT-ISO-UPDATE-ORG"
		require.NoError(t, db.Exec(`
			INSERT INTO organization (code, name, category_code, tenant_code)
			VALUES (?, 'Tenant Isolation Update Test Org', 'healthcare_provider', 'tenant_b')
			ON CONFLICT (code, tenant_code) DO NOTHING
		`, orgCode).Error)
		// Registered before the patient delete below so it runs after it (defers are LIFO) —
		// the organization delete would otherwise fail on the patient's FK.
		defer db.Exec(`DELETE FROM organization WHERE code = ?`, orgCode)
		defer db.Exec(`DELETE FROM patient WHERE id = 1002`)

		require.NoError(t, db.Exec(`
			INSERT INTO patient (id, submitter_patient_id, submitter_patient_id_type, organization_code, tenant_code, sex_code, date_of_birth, life_status_code, first_name, last_name, jhn)
			VALUES (1002, 'MRN-UPDATE-2', 'mrn', ?, 'tenant_b', 'male', '2000-01-01', 'alive', 'Original', 'Name', 'JHN-ORIGINAL')
		`, orgCode).Error)

		err := repo.UpdatePatient(t.Context(), &types.Patient{
			SubmitterPatientId: "MRN-UPDATE-2",
			OrganizationCode:   orgCode,
			TenantCode:         types.DefaultTenantCode,
			SexCode:            "female",
			LifeStatusCode:     "deceased",
		})
		require.NoError(t, err)

		patient, err := repo.GetPatientByOrgCodeAndSubmitterPatientId(t.Context(), orgCode, "MRN-UPDATE-2", "tenant_b")
		require.NoError(t, err)
		if assert.NotNil(t, patient, "tenant_b's patient must still exist, untouched") {
			assert.Equal(t, "male", patient.SexCode)
			assert.Equal(t, "alive", patient.LifeStatusCode)
		}
	})
}

func Test_UpdatePatient_NotFound(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewPatientsRepository(database.PostgresDB{DB: env.Postgres})

		err := repo.UpdatePatient(t.Context(), &types.Patient{
			SubmitterPatientId: "MRN-DOES-NOT-EXIST",
			OrganizationCode:   "CHUSJ",
			TenantCode:         types.DefaultTenantCode,
		})
		assert.NoError(t, err)

		patient, err := repo.GetPatientByOrgCodeAndSubmitterPatientId(t.Context(), "CHUSJ", "MRN-DOES-NOT-EXIST", types.DefaultTenantCode)
		assert.NoError(t, err)
		assert.Nil(t, patient)
	})
}
