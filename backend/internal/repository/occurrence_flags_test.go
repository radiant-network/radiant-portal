package repository

import (
	"testing"

	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
)

func Test_UpsertOccurrenceFlag_Insert(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		db := env.Postgres
		repo := NewOccurrenceFlagsRepository(db)
		flag := types.OccurrenceFlag{
			CaseID:       2,
			OccurrenceID: "10000",
			SeqID:        1,
			TaskID:       1,
			FlagType:     "flag",
		}

		created, err := repo.Upsert(flag)

		assert.NoError(t, err)
		if assert.NotNil(t, created) {
			assert.Equal(t, 2, created.CaseID)
			assert.Equal(t, "10000", created.OccurrenceID)
			assert.Equal(t, 1, created.SeqID)
			assert.Equal(t, 1, created.TaskID)
			assert.Equal(t, "flag", created.FlagType)
		}

		var count int64
		db.Model(&types.OccurrenceFlag{}).
			Where("case_id = ? AND occurrence_id = ? AND seq_id = ? AND task_id = ?", 2, "10000", 1, 1).
			Count(&count)
		assert.Equal(t, int64(1), count)
	})
}

func Test_UpsertOccurrenceFlag_UpdatesExistingFlagType(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		db := env.Postgres
		repo := NewOccurrenceFlagsRepository(db)
		key := types.OccurrenceFlag{
			CaseID:       2,
			OccurrenceID: "10000",
			SeqID:        1,
			TaskID:       1,
		}

		first := key
		first.FlagType = "flag"
		_, err := repo.Upsert(first)
		assert.NoError(t, err)

		second := key
		second.FlagType = "pin"
		updated, err := repo.Upsert(second)

		assert.NoError(t, err)
		if assert.NotNil(t, updated) {
			assert.Equal(t, "pin", updated.FlagType)
		}

		var count int64
		db.Model(&types.OccurrenceFlag{}).
			Where("case_id = ? AND occurrence_id = ? AND seq_id = ? AND task_id = ?", 2, "10000", 1, 1).
			Count(&count)
		assert.Equal(t, int64(1), count, "upsert must not create a duplicate row on conflict")
	})
}

func Test_UpsertOccurrenceFlag_DifferentOccurrenceCreatesSeparateRow(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		db := env.Postgres
		repo := NewOccurrenceFlagsRepository(db)

		_, err := repo.Upsert(types.OccurrenceFlag{CaseID: 2, OccurrenceID: "10000", SeqID: 1, TaskID: 1, FlagType: "flag"})
		assert.NoError(t, err)

		_, err = repo.Upsert(types.OccurrenceFlag{CaseID: 2, OccurrenceID: "20000", SeqID: 1, TaskID: 1, FlagType: "star"})
		assert.NoError(t, err)

		var count int64
		db.Model(&types.OccurrenceFlag{}).Where("case_id = ?", 2).Count(&count)
		assert.Equal(t, int64(2), count)
	})
}

func Test_UpsertOccurrenceFlag_RejectsNonExistentCaseID(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewOccurrenceFlagsRepository(env.Postgres)

		_, err := repo.Upsert(types.OccurrenceFlag{
			CaseID:       99999,
			OccurrenceID: "10000",
			SeqID:        1,
			TaskID:       1,
			FlagType:     "flag",
		})

		assert.Error(t, err, "FK to cases(id) should reject non-existent case_id")
	})
}

func Test_UpsertOccurrenceFlag_RejectsNonExistentSeqID(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewOccurrenceFlagsRepository(env.Postgres)

		_, err := repo.Upsert(types.OccurrenceFlag{
			CaseID:       2,
			OccurrenceID: "10000",
			SeqID:        99999,
			TaskID:       1,
			FlagType:     "flag",
		})

		assert.Error(t, err, "FK to sequencing_experiment(id) should reject non-existent seq_id")
	})
}

func Test_UpsertOccurrenceFlag_RejectsNonExistentTaskID(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewOccurrenceFlagsRepository(env.Postgres)

		_, err := repo.Upsert(types.OccurrenceFlag{
			CaseID:       2,
			OccurrenceID: "10000",
			SeqID:        1,
			TaskID:       99999,
			FlagType:     "flag",
		})

		assert.Error(t, err, "FK to task(id) should reject non-existent task_id")
	})
}

func Test_UpsertOccurrenceFlag_RejectsInvalidFlagType(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		db := env.Postgres
		repo := NewOccurrenceFlagsRepository(db)

		_, err := repo.Upsert(types.OccurrenceFlag{
			CaseID:       2,
			OccurrenceID: "10000",
			SeqID:        1,
			TaskID:       1,
			FlagType:     "bogus",
		})

		assert.Error(t, err, "DB CHECK constraint should reject flag_type outside (flag, pin, star)")
	})
}
