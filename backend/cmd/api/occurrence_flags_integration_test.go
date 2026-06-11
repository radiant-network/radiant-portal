package main

import (
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/radiant-network/radiant-api/internal/repository"
	"github.com/radiant-network/radiant-api/internal/server"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
)

func assertUpsertOccurrenceFlag(
	t *testing.T,
	repo *repository.OccurrenceFlagsRepository,
	caseID, seqID, taskID, occurrenceID, flagType string,
	expectedStatus int,
) {
	t.Helper()
	router := tenantRouter()
	router.POST("/:tenant/occurrences/flags/:case_id/:seq_id/:task_id/:occurrence_id", server.UpsertOccurrenceFlagHandler(repo))

	url := fmt.Sprintf("/radiant/occurrences/flags/%s/%s/%s/%s", caseID, seqID, taskID, occurrenceID)
	if flagType != "" {
		url += "?flag_type=" + flagType
	}
	req, _ := http.NewRequest("POST", url, nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, expectedStatus, w.Code)
}

func assertDeleteOccurrenceFlag(
	t *testing.T,
	repo *repository.OccurrenceFlagsRepository,
	caseID, seqID, taskID, occurrenceID string,
	expectedStatus int,
) {
	t.Helper()
	router := tenantRouter()
	router.DELETE("/:tenant/occurrences/flags/:case_id/:seq_id/:task_id/:occurrence_id", server.DeleteOccurrenceFlagHandler(repo))

	url := fmt.Sprintf("/radiant/occurrences/flags/%s/%s/%s/%s", caseID, seqID, taskID, occurrenceID)
	req, _ := http.NewRequest("DELETE", url, nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, expectedStatus, w.Code)
}

func Test_UpsertOccurrenceFlag_Integration(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := repository.NewOccurrenceFlagsRepository(env.Postgres)

		assertUpsertOccurrenceFlag(t, repo, "1", "1", "1", "90100", "flag", http.StatusNoContent)

		var stored types.OccurrenceFlag
		err := env.Postgres.
			Where("case_id = ? AND seq_id = ? AND task_id = ? AND occurrence_id = ?", 1, 1, 1, "90100").
			First(&stored).Error
		assert.NoError(t, err)
		assert.Equal(t, "flag", stored.FlagType)
	})
}

func Test_UpsertOccurrenceFlag_Integration_FlagTypePin(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := repository.NewOccurrenceFlagsRepository(env.Postgres)

		assertUpsertOccurrenceFlag(t, repo, "1", "1", "1", "90110", "pin", http.StatusNoContent)

		var stored types.OccurrenceFlag
		err := env.Postgres.
			Where("case_id = ? AND seq_id = ? AND task_id = ? AND occurrence_id = ?", 1, 1, 1, "90110").
			First(&stored).Error
		assert.NoError(t, err)
		assert.Equal(t, "pin", stored.FlagType)
	})
}

func Test_UpsertOccurrenceFlag_Integration_FlagTypeStar(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := repository.NewOccurrenceFlagsRepository(env.Postgres)

		assertUpsertOccurrenceFlag(t, repo, "1", "1", "1", "90111", "star", http.StatusNoContent)

		var stored types.OccurrenceFlag
		err := env.Postgres.
			Where("case_id = ? AND seq_id = ? AND task_id = ? AND occurrence_id = ?", 1, 1, 1, "90111").
			First(&stored).Error
		assert.NoError(t, err)
		assert.Equal(t, "star", stored.FlagType)
	})
}

func Test_UpsertOccurrenceFlag_Integration_UpdatesFlagType(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := repository.NewOccurrenceFlagsRepository(env.Postgres)

		assertUpsertOccurrenceFlag(t, repo, "1", "1", "1", "90101", "flag", http.StatusNoContent)
		assertUpsertOccurrenceFlag(t, repo, "1", "1", "1", "90101", "pin", http.StatusNoContent)

		var stored types.OccurrenceFlag
		err := env.Postgres.
			Where("case_id = ? AND seq_id = ? AND task_id = ? AND occurrence_id = ?", 1, 1, 1, "90101").
			First(&stored).Error
		assert.NoError(t, err)
		assert.Equal(t, "pin", stored.FlagType)
	})
}

func Test_UpsertOccurrenceFlag_Integration_InvalidFlagType(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := repository.NewOccurrenceFlagsRepository(env.Postgres)

		assertUpsertOccurrenceFlag(t, repo, "1", "1", "1", "90102", "bogus", http.StatusBadRequest)
	})
}

func Test_UpsertOccurrenceFlag_Integration_MissingFlagType(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := repository.NewOccurrenceFlagsRepository(env.Postgres)

		assertUpsertOccurrenceFlag(t, repo, "1", "1", "1", "90103", "", http.StatusBadRequest)
	})
}

func Test_UpsertOccurrenceFlag_Integration_InvalidCaseID(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := repository.NewOccurrenceFlagsRepository(env.Postgres)

		assertUpsertOccurrenceFlag(t, repo, "not-a-number", "1", "1", "90104", "flag", http.StatusNotFound)
	})
}

func Test_UpsertOccurrenceFlag_Integration_NonExistentCaseID(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := repository.NewOccurrenceFlagsRepository(env.Postgres)

		assertUpsertOccurrenceFlag(t, repo, "99999", "1", "1", "90105", "flag", http.StatusInternalServerError)
	})
}

func Test_UpsertOccurrenceFlag_Integration_NonExistentSeqID(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := repository.NewOccurrenceFlagsRepository(env.Postgres)

		assertUpsertOccurrenceFlag(t, repo, "1", "99999", "1", "90106", "flag", http.StatusInternalServerError)
	})
}

func Test_UpsertOccurrenceFlag_Integration_NonExistentTaskID(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := repository.NewOccurrenceFlagsRepository(env.Postgres)

		assertUpsertOccurrenceFlag(t, repo, "1", "1", "99999", "90107", "flag", http.StatusInternalServerError)
	})
}

func Test_DeleteOccurrenceFlag_Integration(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := repository.NewOccurrenceFlagsRepository(env.Postgres)

		assertUpsertOccurrenceFlag(t, repo, "1", "1", "1", "90120", "flag", http.StatusNoContent)
		assertDeleteOccurrenceFlag(t, repo, "1", "1", "1", "90120", http.StatusNoContent)

		var count int64
		env.Postgres.Model(&types.OccurrenceFlag{}).
			Where("case_id = ? AND seq_id = ? AND task_id = ? AND occurrence_id = ?", 1, 1, 1, "90120").
			Count(&count)
		assert.Equal(t, int64(0), count)
	})
}

func Test_DeleteOccurrenceFlag_Integration_NotFound(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := repository.NewOccurrenceFlagsRepository(env.Postgres)

		assertDeleteOccurrenceFlag(t, repo, "1", "1", "1", "90121", http.StatusNotFound)
	})
}

func Test_DeleteOccurrenceFlag_Integration_InvalidCaseID(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := repository.NewOccurrenceFlagsRepository(env.Postgres)

		assertDeleteOccurrenceFlag(t, repo, "not-a-number", "1", "1", "90122", http.StatusNotFound)
	})
}

func Test_DeleteOccurrenceFlag_Integration_InvalidSeqID(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := repository.NewOccurrenceFlagsRepository(env.Postgres)

		assertDeleteOccurrenceFlag(t, repo, "1", "not-a-number", "1", "90123", http.StatusNotFound)
	})
}

func Test_DeleteOccurrenceFlag_Integration_InvalidTaskID(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := repository.NewOccurrenceFlagsRepository(env.Postgres)

		assertDeleteOccurrenceFlag(t, repo, "1", "1", "not-a-number", "90124", http.StatusNotFound)
	})
}
