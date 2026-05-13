package repository

import (
	"testing"

	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
)

const (
	testUserID   = "11111111-1111-1111-1111-111111111111"
	testUserName = "John Doe"
)

func Test_UpsertVariantFlag_Insert(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewVariantFlagsRepository(env.Postgres)
		flag := types.VariantFlag{
			CaseID:       1,
			OccurrenceID: "upsert-insert-occ",
			FlagType:     "flag",
			UserID:       testUserID,
			UserName:     testUserName,
		}

		saved, err := repo.Upsert(flag)

		assert.NoError(t, err)
		if assert.NotNil(t, saved) {
			assert.Equal(t, 1, saved.CaseID)
			assert.Equal(t, "upsert-insert-occ", saved.OccurrenceID)
			assert.Equal(t, "flag", saved.FlagType)
			assert.Equal(t, testUserID, saved.UserID)
			assert.Equal(t, testUserName, saved.UserName)
			assert.NotZero(t, saved.CreatedAt)
			assert.NotZero(t, saved.UpdatedAt)
		}
	})
}

func Test_UpsertVariantFlag_Update(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewVariantFlagsRepository(env.Postgres)
		occurrenceID := "upsert-update-occ"

		first, err := repo.Upsert(types.VariantFlag{
			CaseID: 1, OccurrenceID: occurrenceID, FlagType: "flag",
			UserID: testUserID, UserName: testUserName,
		})
		assert.NoError(t, err)

		// A different user changes the flag type. Same (case_id, occurrence_id) → must update, not insert.
		updated, err := repo.Upsert(types.VariantFlag{
			CaseID: 1, OccurrenceID: occurrenceID, FlagType: "star",
			UserID: "22222222-2222-2222-2222-222222222222", UserName: "Jane Roe",
		})

		assert.NoError(t, err)
		if assert.NotNil(t, updated) {
			assert.Equal(t, "star", updated.FlagType)
			assert.Equal(t, "22222222-2222-2222-2222-222222222222", updated.UserID)
			assert.Equal(t, "Jane Roe", updated.UserName)
			assert.True(t, !updated.UpdatedAt.Before(first.UpdatedAt))
		}

		// Confirm exactly one row exists for this (case_id, occurrence_id).
		all, err := repo.GetByCase(1)
		assert.NoError(t, err)
		matches := 0
		for _, f := range all {
			if f.OccurrenceID == occurrenceID {
				matches++
			}
		}
		assert.Equal(t, 1, matches)
	})
}

func Test_GetVariantFlagByCaseOccurrence(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewVariantFlagsRepository(env.Postgres)
		occurrenceID := "get-by-case-occurrence"

		_, err := repo.Upsert(types.VariantFlag{
			CaseID: 1, OccurrenceID: occurrenceID, FlagType: "pin",
			UserID: testUserID, UserName: testUserName,
		})
		assert.NoError(t, err)

		found, err := repo.GetByCaseOccurrence(1, occurrenceID)

		assert.NoError(t, err)
		if assert.NotNil(t, found) {
			assert.Equal(t, 1, found.CaseID)
			assert.Equal(t, occurrenceID, found.OccurrenceID)
			assert.Equal(t, "pin", found.FlagType)
		}
	})
}

func Test_GetVariantFlagByCaseOccurrence_NotFound(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewVariantFlagsRepository(env.Postgres)

		found, err := repo.GetByCaseOccurrence(1, "does-not-exist-occ")

		assert.NoError(t, err)
		assert.Nil(t, found)
	})
}

func Test_GetVariantFlagsByCase(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewVariantFlagsRepository(env.Postgres)
		occA := "by-case-occ-a"
		occB := "by-case-occ-b"

		_, err := repo.Upsert(types.VariantFlag{
			CaseID: 1, OccurrenceID: occA, FlagType: "flag",
			UserID: testUserID, UserName: testUserName,
		})
		assert.NoError(t, err)
		_, err = repo.Upsert(types.VariantFlag{
			CaseID: 1, OccurrenceID: occB, FlagType: "star",
			UserID: testUserID, UserName: testUserName,
		})
		assert.NoError(t, err)

		flags, err := repo.GetByCase(1)
		assert.NoError(t, err)

		// Filter to this test's occurrences so we don't see other parallel tests' rows.
		seen := map[string]string{}
		for _, f := range flags {
			if f.OccurrenceID == occA || f.OccurrenceID == occB {
				seen[f.OccurrenceID] = f.FlagType
			}
		}
		assert.Equal(t, "flag", seen[occA])
		assert.Equal(t, "star", seen[occB])
	})
}

func Test_DeleteVariantFlag(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewVariantFlagsRepository(env.Postgres)
		occurrenceID := "delete-occ"

		_, err := repo.Upsert(types.VariantFlag{
			CaseID: 1, OccurrenceID: occurrenceID, FlagType: "flag",
			UserID: testUserID, UserName: testUserName,
		})
		assert.NoError(t, err)

		err = repo.Delete(1, occurrenceID)
		assert.NoError(t, err)

		found, err := repo.GetByCaseOccurrence(1, occurrenceID)
		assert.NoError(t, err)
		assert.Nil(t, found)
	})
}

func Test_DeleteVariantFlag_Idempotent(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewVariantFlagsRepository(env.Postgres)

		err := repo.Delete(1, "delete-idempotent-occ")
		assert.NoError(t, err)
	})
}
