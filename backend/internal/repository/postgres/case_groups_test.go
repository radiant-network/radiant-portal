package postgres

import (
	"errors"
	"testing"

	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"gorm.io/gorm"
)

// Cases 1 and 2 are seeded fixtures that cleanUp preserves (ids >= 1000 are wiped by any parallel
// test's teardown). Group names are unique per test and each test deletes its own row (membership
// follows by cascade): a global cleanUp rule would run from a parallel test's teardown and wipe rows
// a still-running test is about to read.
func trackCaseGroup(t *testing.T, db *gorm.DB, tenantCode, name string) {
	t.Helper()
	t.Cleanup(func() { db.Exec("DELETE FROM case_group WHERE tenant_code = ? AND name = ?", tenantCode, name) })
}

func Test_UpsertCaseGroup_CreatesGroup(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewCaseGroupsRepository(database.PostgresDB{DB: env.Postgres})
		trackCaseGroup(t, env.Postgres, "radiant", "cg_create")

		group, ids, err := repo.UpsertCaseGroup(t.Context(), "radiant", "cg_create", []int{2, 1}, "user-sub")
		require.NoError(t, err)
		assert.NotZero(t, group.ID)
		assert.Equal(t, "radiant", group.TenantCode)
		assert.Equal(t, "cg_create", group.Name)
		assert.Equal(t, "user-sub", group.CreatedBy)
		assert.False(t, group.CreatedOn.IsZero())
		assert.Equal(t, []int{1, 2}, ids)
	})
}

func Test_UpsertCaseGroup_ReplacesMembership(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewCaseGroupsRepository(database.PostgresDB{DB: env.Postgres})
		trackCaseGroup(t, env.Postgres, "radiant", "cg_replace")

		first, _, err := repo.UpsertCaseGroup(t.Context(), "radiant", "cg_replace", []int{1, 2}, "first-sub")
		require.NoError(t, err)
		second, ids, err := repo.UpsertCaseGroup(t.Context(), "radiant", "cg_replace", []int{2}, "second-sub")
		require.NoError(t, err)

		assert.Equal(t, []int{2}, ids)
		// Same row: id, provenance and creation time survive the overwrite.
		assert.Equal(t, first.ID, second.ID)
		assert.Equal(t, "first-sub", second.CreatedBy)
		assert.Equal(t, first.CreatedOn, second.CreatedOn)
		var rows int64
		env.Postgres.Table("case_group_case").Where("case_group_id = ?", first.ID).Count(&rows)
		assert.EqualValues(t, 1, rows)
	})
}

func Test_UpsertCaseGroup_EmptyCaseIds(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewCaseGroupsRepository(database.PostgresDB{DB: env.Postgres})
		trackCaseGroup(t, env.Postgres, "radiant", "cg_empty")

		_, ids, err := repo.UpsertCaseGroup(t.Context(), "radiant", "cg_empty", []int{}, "user-sub")
		require.NoError(t, err)
		assert.Equal(t, []int{}, ids)
	})
}

func Test_UpsertCaseGroup_UnknownCaseId_Error(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewCaseGroupsRepository(database.PostgresDB{DB: env.Postgres})
		trackCaseGroup(t, env.Postgres, "radiant", "cg_unknown")

		group, ids, err := repo.UpsertCaseGroup(t.Context(), "radiant", "cg_unknown", []int{1, 999999, 999998}, "user-sub")
		assert.Nil(t, group)
		assert.Nil(t, ids)
		var unknown *types.UnknownCaseIDsError
		require.True(t, errors.As(err, &unknown))
		// Reported in request order, like the ids themselves.
		assert.Equal(t, []int{999999, 999998}, unknown.IDs)

		stored, _, err := repo.GetCaseGroupByName(t.Context(), "radiant", "cg_unknown")
		require.NoError(t, err)
		assert.Nil(t, stored, "nothing must be written when a case id is unknown")
	})
}

func Test_UpsertCaseGroup_CaseFromOtherTenant_Unknown(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewCaseGroupsRepository(database.PostgresDB{DB: env.Postgres})
		trackCaseGroup(t, env.Postgres, "tenant_b", "cg_other_tenant")

		_, _, err := repo.UpsertCaseGroup(t.Context(), "tenant_b", "cg_other_tenant", []int{1}, "user-sub")
		var unknown *types.UnknownCaseIDsError
		require.True(t, errors.As(err, &unknown))
		assert.Equal(t, []int{1}, unknown.IDs)
	})
}

func Test_UpsertCaseGroup_SameNameOtherTenant_Independent(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewCaseGroupsRepository(database.PostgresDB{DB: env.Postgres})
		trackCaseGroup(t, env.Postgres, "radiant", "cg_shared_name")
		trackCaseGroup(t, env.Postgres, "tenant_b", "cg_shared_name")

		radiantGroup, _, err := repo.UpsertCaseGroup(t.Context(), "radiant", "cg_shared_name", []int{1}, "user-sub")
		require.NoError(t, err)
		otherGroup, otherIDs, err := repo.UpsertCaseGroup(t.Context(), "tenant_b", "cg_shared_name", []int{}, "user-sub")
		require.NoError(t, err)
		assert.NotEqual(t, radiantGroup.ID, otherGroup.ID)
		assert.Equal(t, []int{}, otherIDs)

		_, radiantIDs, err := repo.GetCaseGroupByName(t.Context(), "radiant", "cg_shared_name")
		require.NoError(t, err)
		assert.Equal(t, []int{1}, radiantIDs)
	})
}

func Test_GetCaseGroupByName_NotFound_Nil(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewCaseGroupsRepository(database.PostgresDB{DB: env.Postgres})

		group, ids, err := repo.GetCaseGroupByName(t.Context(), "radiant", "cg_does_not_exist")
		require.NoError(t, err)
		assert.Nil(t, group)
		assert.Nil(t, ids)
	})
}

func Test_GetCaseGroupByName_OtherTenant_Nil(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewCaseGroupsRepository(database.PostgresDB{DB: env.Postgres})
		trackCaseGroup(t, env.Postgres, "radiant", "cg_tenant_scoped")
		_, _, err := repo.UpsertCaseGroup(t.Context(), "radiant", "cg_tenant_scoped", []int{}, "user-sub")
		require.NoError(t, err)

		group, _, err := repo.GetCaseGroupByName(t.Context(), "tenant_b", "cg_tenant_scoped")
		require.NoError(t, err)
		assert.Nil(t, group)
	})
}

func Test_DeleteCaseGroup_CascadesMembership(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewCaseGroupsRepository(database.PostgresDB{DB: env.Postgres})
		trackCaseGroup(t, env.Postgres, "radiant", "cg_cascade")
		group, _, err := repo.UpsertCaseGroup(t.Context(), "radiant", "cg_cascade", []int{1, 2}, "user-sub")
		require.NoError(t, err)

		require.NoError(t, env.Postgres.Exec("DELETE FROM case_group WHERE id = ?", group.ID).Error)

		var rows int64
		env.Postgres.Table("case_group_case").Where("case_group_id = ?", group.ID).Count(&rows)
		assert.Zero(t, rows)
	})
}

func Test_ListCases_ReturnsPriorityAnalysisAndLab(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewCaseGroupsRepository(database.PostgresDB{DB: env.Postgres})

		rows, err := repo.ListCases(t.Context(), "radiant", []int{2, 1})
		require.NoError(t, err)
		require.Len(t, rows, 2)
		assert.Equal(t, 1, rows[0].CaseID, "rows come back in case id order")
		assert.Equal(t, "routine", rows[0].PriorityCode)
		assert.NotEmpty(t, rows[0].AnalysisCatalogCode)
		assert.Equal(t, "CQGC", rows[0].DiagnosisLabCode)
		assert.Equal(t, "Quebec Clinical Genomic Center", rows[0].DiagnosisLabName)
	})
}

func Test_ListCases_OtherTenantOrUnknown_Empty(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewCaseGroupsRepository(database.PostgresDB{DB: env.Postgres})

		rows, err := repo.ListCases(t.Context(), "tenant_b", []int{1})
		require.NoError(t, err)
		assert.Empty(t, rows)

		rows, err = repo.ListCases(t.Context(), "radiant", []int{999999})
		require.NoError(t, err)
		assert.Empty(t, rows)

		rows, err = repo.ListCases(t.Context(), "radiant", nil)
		require.NoError(t, err)
		assert.Equal(t, []types.CaseGroupCaseRow{}, rows)
	})
}

func Test_ListDocuments_OutputDocumentsOfCase_IndexFilesIncluded(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewCaseGroupsRepository(database.PostgresDB{DB: env.Postgres})

		rows, err := repo.ListDocuments(t.Context(), "radiant", []int{1})
		require.NoError(t, err)
		require.NotEmpty(t, rows)

		formats := map[string]bool{}
		for _, row := range rows {
			assert.Equal(t, 1, row.CaseID)
			assert.Equal(t, "CQGC", row.DiagnosisLabCode)
			assert.NotEmpty(t, row.Name)
			assert.NotEmpty(t, row.SubmitterSampleID, "document %d must reach its sample", row.DocumentID)
			assert.NotZero(t, row.PatientID)
			formats[row.FormatCode] = true
		}
		assert.True(t, formats["crai"], "index files stay in the manifest, got formats %v", formats)
	})
}

func Test_ListDocuments_OnlyGivenCases_OtherTenantEmpty(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewCaseGroupsRepository(database.PostgresDB{DB: env.Postgres})

		rows, err := repo.ListDocuments(t.Context(), "radiant", []int{1, 2})
		require.NoError(t, err)
		for _, row := range rows {
			assert.Contains(t, []int{1, 2}, row.CaseID)
		}

		rows, err = repo.ListDocuments(t.Context(), "tenant_b", []int{1})
		require.NoError(t, err)
		assert.Empty(t, rows)

		rows, err = repo.ListDocuments(t.Context(), "radiant", nil)
		require.NoError(t, err)
		assert.Equal(t, []types.CaseGroupDocumentRow{}, rows)
	})
}
