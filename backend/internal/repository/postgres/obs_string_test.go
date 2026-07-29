package postgres

import (
	"testing"

	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/internal/utils"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
)

func Test_GetObservationStringById_OK(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewObservationStringRepository(database.PostgresDB{DB: env.Postgres})
		result, err := repo.GetById(t.Context(), 1)
		assert.NoError(t, err)
		assert.Equal(t, 1, result.ID)
		assert.Equal(t, 16, result.CaseID)
		assert.Equal(t, utils.IntPtr(44), result.PatientID)
		assert.Equal(t, "phenotype", result.ObservationCode)
		assert.Equal(t, "HP:0001263", result.Value)
	})
}

func Test_GetObservationStringById_NotFound(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewObservationStringRepository(database.PostgresDB{DB: env.Postgres})
		result, err := repo.GetById(t.Context(), 999)
		assert.NoError(t, err)
		assert.Nil(t, result)
	})
}

func Test_CreateObservationString_OK(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		newObs := &types.ObsString{
			ID:              9999,
			CaseID:          1,
			PatientID:       utils.IntPtr(1),
			ObservationCode: "phenotype",
			Value:           "HP:00314159",
			TenantCode:      types.DefaultTenantCode,
		}

		repo := NewObservationStringRepository(database.PostgresDB{DB: env.Postgres})
		err := repo.CreateObservationString(t.Context(), newObs)
		assert.NoError(t, err)

		result, err := repo.GetById(t.Context(), 9999)
		assert.NoError(t, err)
		assert.Equal(t, 9999, result.ID)
		assert.Equal(t, 1, result.CaseID)
		assert.Equal(t, utils.IntPtr(1), result.PatientID)
		assert.Equal(t, "phenotype", result.ObservationCode)
		assert.Equal(t, "HP:00314159", result.Value)

		env.Postgres.Exec("DELETE FROM obs_string WHERE id=9999")
	})
}

func Test_CreateObservationString_WithExam_OK(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		newObs := &types.ObsString{
			ID:                 9998,
			CaseID:             1,
			PatientID:          utils.IntPtr(1),
			ObservationCode:    "exam",
			Value:              "Normal",
			InterpretationCode: utils.NilIfEmpty("normal"),
			ExamCode:           utils.NilIfEmpty("other"),
			TenantCode:         types.DefaultTenantCode,
		}

		repo := NewObservationStringRepository(database.PostgresDB{DB: env.Postgres})
		err := repo.CreateObservationString(t.Context(), newObs)
		assert.NoError(t, err)

		result, err := repo.GetById(t.Context(), 9998)
		assert.NoError(t, err)
		assert.Equal(t, utils.NilIfEmpty("other"), result.ExamCode)
		assert.Equal(t, utils.NilIfEmpty("normal"), result.InterpretationCode)

		env.Postgres.Exec("DELETE FROM obs_string WHERE id=9998")
	})
}

func Test_CreateObservationString_NilError(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewObservationStringRepository(database.PostgresDB{DB: env.Postgres})
		err := repo.CreateObservationString(t.Context(), nil)
		assert.Error(t, err)
	})
}

func Test_CreateObservationString_CaseNotFound(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		newObs := &types.ObsString{
			ID:              4242,
			CaseID:          9876,
			PatientID:       utils.IntPtr(1),
			ObservationCode: "phenotype",
			Value:           "HP:00314159",
			TenantCode:      types.DefaultTenantCode,
		}

		repo := NewObservationStringRepository(database.PostgresDB{DB: env.Postgres})
		err := repo.CreateObservationString(t.Context(), newObs)
		assert.Error(t, err)

		result, err := repo.GetById(t.Context(), 4242)
		assert.NoError(t, err)
		assert.Nil(t, result)
	})
}

func Test_DeleteNonFetusObsStringByCaseID_OK(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		db := env.Postgres
		repo := NewObservationStringRepository(database.PostgresDB{DB: db})

		createTestCase(t, db, 100025)
		createTestCase(t, db, 100026)

		db.Exec(`INSERT INTO obs_string (id, case_id, patient_id, observation_code, value, tenant_code) VALUES (100027, 100025, 1, 'phenotype', 'HP:0000001', 'radiant')`)
		db.Exec(`INSERT INTO obs_string (id, case_id, patient_id, observation_code, value, tenant_code) VALUES (100028, 100026, 1, 'phenotype', 'HP:0000002', 'radiant')`)
		db.Exec(`INSERT INTO fetus (id, mother_id, life_status_code, sex_code, tenant_code) VALUES (100025, 1, 'alive', 'male', 'radiant')`)
		db.Exec(`INSERT INTO obs_string (id, case_id, fetus_id, observation_code, value, tenant_code) VALUES (100029, 100025, 100025, 'phenotype', 'HP:0000003', 'radiant')`)
		t.Cleanup(func() {
			db.Exec("DELETE FROM obs_string WHERE id IN (100027, 100028, 100029)")
			db.Exec("DELETE FROM fetus WHERE id = 100025")
		})

		err := repo.DeleteNonFetusObsStringByCaseID(t.Context(), 100025)
		assert.NoError(t, err)

		deleted, err := repo.GetById(t.Context(), 100027)
		assert.NoError(t, err)
		assert.Nil(t, deleted)

		untouched, err := repo.GetById(t.Context(), 100028)
		assert.NoError(t, err)
		assert.NotNil(t, untouched)

		// A fetus observation on the replaced case is not carried by the update payload, so it
		// must survive the replace.
		fetusObs, err := repo.GetById(t.Context(), 100029)
		assert.NoError(t, err)
		assert.NotNil(t, fetusObs)
	})
}

func Test_CreateObservationString_RejectsBothSubjectsSet(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewObservationStringRepository(database.PostgresDB{DB: env.Postgres})
		err := repo.CreateObservationString(t.Context(), &ObservationString{
			CaseID:          1,
			PatientID:       utils.IntPtr(1),
			FetusID:         utils.IntPtr(1),
			ObservationCode: "phenotype",
			Value:           "HP:0000001",
			TenantCode:      "radiant",
		})
		assert.ErrorIs(t, err, ErrInvalidSubject)
	})
}

func Test_CreateObservationString_RejectsNoSubjectSet(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewObservationStringRepository(database.PostgresDB{DB: env.Postgres})
		err := repo.CreateObservationString(t.Context(), &ObservationString{
			CaseID:          1,
			ObservationCode: "phenotype",
			Value:           "HP:0000001",
			TenantCode:      "radiant",
		})
		assert.ErrorIs(t, err, ErrInvalidSubject)
	})
}

func Test_CreateObservationString_PatientNotFound(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		newObs := &types.ObsString{
			ID:              4242,
			CaseID:          1,
			PatientID:       utils.IntPtr(9876),
			ObservationCode: "phenotype",
			Value:           "HP:00314159",
			TenantCode:      types.DefaultTenantCode,
		}

		repo := NewObservationStringRepository(database.PostgresDB{DB: env.Postgres})
		err := repo.CreateObservationString(t.Context(), newObs)
		assert.Error(t, err)

		result, err := repo.GetById(t.Context(), 4242)
		assert.NoError(t, err)
		assert.Nil(t, result)
	})
}
