package repository

import (
	"testing"
	"time"

	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"gorm.io/gorm"
)

func Test_GetPatientBySubmitterPatientId_Not_Null(t *testing.T) {
	testutils.ParallelTestWithPostgres(t, func(t *testing.T, db *gorm.DB) {
		repo := NewPatientsRepository(database.PostgresDB{DB: db})
		patient, err := repo.GetPatientByOrgCodeAndSubmitterPatientId(t.Context(), "CHUSJ", "MRN-283773")
		assert.NoError(t, err)
		assert.NotNil(t, patient)
		assert.Equal(t, 1, patient.ID)
		assert.Equal(t, "female", patient.SexCode)
	})
}

func Test_GetPatientBySubmitterPatientId_Null_Mrn(t *testing.T) {
	testutils.ParallelTestWithPostgres(t, func(t *testing.T, db *gorm.DB) {
		repo := NewPatientsRepository(database.PostgresDB{DB: db})
		patient, err := repo.GetPatientByOrgCodeAndSubmitterPatientId(t.Context(), "CHUSJ", "MRN-UNKNOWN")
		assert.NoError(t, err)
		assert.Nil(t, patient)
	})
}

func Test_GetPatientBySubmitterPatientId_Null_OrgId(t *testing.T) {
	testutils.ParallelTestWithPostgres(t, func(t *testing.T, db *gorm.DB) {
		repo := NewPatientsRepository(database.PostgresDB{DB: db})
		patient, err := repo.GetPatientByOrgCodeAndSubmitterPatientId(t.Context(), "UNKNOWN-ORG", "MRN-283773")
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
			SubmitterPatientIdType: "ramq",
			SexCode:                "female",
			LifeStatusCode:         "deceased",
			FirstName:              "Updated",
			LastName:               "Person",
			Jhn:                    "JHN-UPDATED",
			DateOfBirth:            time.Time(dob),
		}
		err = repo.UpdatePatient(t.Context(), updated)
		require.NoError(t, err)

		patient, err := repo.GetPatientByOrgCodeAndSubmitterPatientId(t.Context(), "CHUSJ", "MRN-UPDATE-1")
		require.NoError(t, err)
		require.NotNil(t, patient)
		assert.Equal(t, "ramq", patient.SubmitterPatientIdType)
		assert.Equal(t, "female", patient.SexCode)
		assert.Equal(t, "deceased", patient.LifeStatusCode)
		assert.Equal(t, "Updated", patient.FirstName)
		assert.Equal(t, "Person", patient.LastName)
		assert.Equal(t, "JHN-UPDATED", patient.Jhn)
		assert.True(t, time.Time(dob).Equal(patient.DateOfBirth))
	})
}

func Test_UpdatePatient_NotFound(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewPatientsRepository(database.PostgresDB{DB: env.Postgres})

		err := repo.UpdatePatient(t.Context(), &types.Patient{
			SubmitterPatientId: "MRN-DOES-NOT-EXIST",
			OrganizationCode:   "CHUSJ",
		})
		assert.NoError(t, err)

		patient, err := repo.GetPatientByOrgCodeAndSubmitterPatientId(t.Context(), "CHUSJ", "MRN-DOES-NOT-EXIST")
		assert.NoError(t, err)
		assert.Nil(t, patient)
	})
}
