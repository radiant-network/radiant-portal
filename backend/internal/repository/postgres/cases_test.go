package postgres

import (
	"fmt"
	"slices"
	"testing"
	"time"

	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"gorm.io/gorm"
)

func Test_CreateCases(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewCasesRepository(database.PostgresDB{DB: env.Postgres})
		orgCode := "CHOP"
		labCode := "CQGC"
		newCase := &types.Case{
			ID:                       999,
			ProbandID:                3,
			ProjectID:                1,
			StatusCode:               "in_progress",
			PrimaryCondition:         "MONDO:0000001",
			DiagnosisLabCode:         &labCode,
			Note:                     "This is a test",
			AnalysisCatalogID:        1,
			AnalysisCatalog:          types.AnalysisCatalog{},
			PriorityCode:             "routine",
			CaseTypeCode:             "germline",
			CaseCategoryCode:         "postnatal",
			ConditionCodeSystem:      "MONDO",
			OrderingPhysician:        "Dr. Test",
			OrderingOrganizationCode: &orgCode,
			TenantCode:               types.DefaultTenantCode,
		}
		err := repo.CreateCase(t.Context(), newCase)
		assert.NoError(t, err)

		var c types.Case
		err = repo.db.Raw(`SELECT * FROM cases WHERE id = 999;`).First(&c).Error
		assert.NoError(t, err)
		assert.Equal(t, 999, c.ID)
		assert.Equal(t, 3, c.ProbandID)
		assert.Equal(t, "Dr. Test", c.OrderingPhysician)

		env.Postgres.Exec("DELETE FROM cases WHERE id = 999")
	})
}

func Test_UpdateCase_OK(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		db := env.Postgres
		repo := NewCasesRepository(database.PostgresDB{DB: db})

		diagLab := "CQGC"
		orgCode := "CQGC"
		original := &types.Case{
			ID:                       100010,
			ProbandID:                1,
			ProjectID:                1,
			StatusCode:               "in_progress",
			PrimaryCondition:         "MONDO:0000001",
			DiagnosisLabCode:         &diagLab,
			Note:                     "original note",
			AnalysisCatalogID:        1,
			PriorityCode:             "routine",
			CaseTypeCode:             "germline",
			CaseCategoryCode:         "postnatal",
			ConditionCodeSystem:      "MONDO",
			OrderingPhysician:        "Dr. Original",
			OrderingOrganizationCode: &orgCode,
			TenantCode:               types.DefaultTenantCode,
		}
		require.NoError(t, repo.CreateCase(t.Context(), original))
		t.Cleanup(func() { db.Exec("DELETE FROM cases WHERE id = 100010") })

		newDiagLab := "CHUSJ"
		newOrgCode := "CHUSJ"
		update := &types.Case{
			CaseTypeCode:             "somatic",
			StatusCode:               "completed",
			DiagnosisLabCode:         &newDiagLab,
			ConditionCodeSystem:      "OMIM",
			PrimaryCondition:         "OMIM:0000002",
			PriorityCode:             "urgent",
			CaseCategoryCode:         "prenatal",
			AnalysisCatalogID:        1,
			Note:                     "updated note",
			OrderingOrganizationCode: &newOrgCode,
			OrderingPhysician:        "Dr. Updated",
		}
		err := repo.UpdateCase(t.Context(), 100010, update)
		assert.NoError(t, err)

		var result types.Case
		err = db.Table("cases").Where("id = ?", 100010).First(&result).Error
		assert.NoError(t, err)
		assert.Equal(t, "somatic", result.CaseTypeCode)
		assert.Equal(t, "completed", result.StatusCode)
		assert.Equal(t, "CHUSJ", *result.DiagnosisLabCode)
		assert.Equal(t, "OMIM", result.ConditionCodeSystem)
		assert.Equal(t, "OMIM:0000002", result.PrimaryCondition)
		assert.Equal(t, "urgent", result.PriorityCode)
		assert.Equal(t, "prenatal", result.CaseCategoryCode)
		assert.Equal(t, "updated note", result.Note)
		assert.Equal(t, "CHUSJ", *result.OrderingOrganizationCode)
		assert.Equal(t, "Dr. Updated", result.OrderingPhysician)

		// Immutable identity fields untouched.
		assert.Equal(t, 1, result.ProbandID)
		assert.Equal(t, 1, result.ProjectID)
		assert.Equal(t, types.DefaultTenantCode, result.TenantCode)
	})
}

func Test_GetCaseAnalysisCatalogIdByCode(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewCasesRepository(database.PostgresDB{DB: env.Postgres})
		analysisCatalog, err := repo.GetCaseAnalysisCatalogIdByCode(t.Context(), "WGA")
		assert.NoError(t, err)
		assert.Equal(t, 1, analysisCatalog.ID)
		assert.Equal(t, "WGA", analysisCatalog.Code)
	})
}

func Test_GetCaseAnalysisCatalogIdByCode_NotFound(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewCasesRepository(database.PostgresDB{DB: env.Postgres})
		analysisCatalog, err := repo.GetCaseAnalysisCatalogIdByCode(t.Context(), "NON_EXISTENT_CODE")
		assert.NoError(t, err)
		assert.Nil(t, analysisCatalog)
	})
}

func Test_CreateDuplicateSubmitterCaseId_Error(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewCasesRepository(database.PostgresDB{DB: env.Postgres})

		diagLab := "CQGC"
		orgCode := "CQGC"
		newCase := &types.Case{
			ID:                       1000,
			ProbandID:                3,
			ProjectID:                1,
			StatusCode:               "in_progress",
			PrimaryCondition:         "MONDO:0000001",
			DiagnosisLabCode:         &diagLab,
			Note:                     "This is a test",
			AnalysisCatalogID:        1,
			PriorityCode:             "routine",
			CaseTypeCode:             "germline",
			CaseCategoryCode:         "postnatal",
			ConditionCodeSystem:      "MONDO",
			OrderingPhysician:        "Dr. Test",
			OrderingOrganizationCode: &orgCode,
			TenantCode:               types.DefaultTenantCode,
			SubmitterCaseID:          "1:1", // Duplicate submitter_case_id
		}
		err := repo.CreateCase(t.Context(), newCase)
		assert.Error(t, err)
		assert.Equal(t, "ERROR: duplicate key value violates unique constraint \"uc_cases_submitter_case_id_filtered\" (SQLSTATE 23505)", err.Error())

		if err != nil {
			// Cleanup in case the record was created
			env.Postgres.Exec("DELETE FROM cases WHERE id = 1000 AND submitter_case_id='1:1';")
		}
	})
}

func Test_CreateEmptySubmitterCaseId_Ok(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewCasesRepository(database.PostgresDB{DB: env.Postgres})

		diagLab := "CQGC"
		orgCode := "CQGC"
		newCase := &types.Case{
			ID:                       1000,
			ProbandID:                3,
			ProjectID:                1,
			StatusCode:               "in_progress",
			PrimaryCondition:         "MONDO:0000001",
			DiagnosisLabCode:         &diagLab,
			Note:                     "This is a test",
			AnalysisCatalogID:        1,
			PriorityCode:             "routine",
			CaseTypeCode:             "germline",
			CaseCategoryCode:         "postnatal",
			ConditionCodeSystem:      "MONDO",
			OrderingPhysician:        "Dr. Test",
			OrderingOrganizationCode: &orgCode,
			TenantCode:               types.DefaultTenantCode,
			SubmitterCaseID:          "",
		}
		err := repo.CreateCase(t.Context(), newCase)
		assert.NoError(t, err)
		env.Postgres.Exec("DELETE FROM cases WHERE id = 1000 AND submitter_case_id='';")
	})
}

func seedCaseForStatus(t *testing.T, repo *CasesRepository, db *gorm.DB, caseID int, status string) int {
	t.Helper()
	diagLab := "CQGC"
	orgCode := "CHUSJ"
	require.NoError(t, repo.CreateCase(t.Context(), &types.Case{
		ID:                       caseID,
		ProbandID:                1,
		ProjectID:                1,
		StatusCode:               status,
		DiagnosisLabCode:         &diagLab,
		OrderingOrganizationCode: &orgCode,
		AnalysisCatalogID:        1,
		PriorityCode:             "routine",
		CaseTypeCode:             "germline",
		CaseCategoryCode:         "postnatal",
		SubmitterCaseID:          fmt.Sprintf("status-switcher-%d", caseID),
		TenantCode:               types.DefaultTenantCode,
	}))
	t.Cleanup(func() { db.Exec("DELETE FROM cases WHERE id = ?", caseID) })
	return caseID
}

func statusOfCase(t *testing.T, db *gorm.DB, caseID int) string {
	t.Helper()
	var status string
	require.NoError(t, db.Table("cases").Select("status_code").Where("id = ?", caseID).Scan(&status).Error)
	return status
}

func Test_UpdateCaseStatus_PersistsTheNewStatus(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewCasesRepository(database.PostgresDB{DB: env.Postgres})
		caseID := seedCaseForStatus(t, repo, env.Postgres, 100020, types.CaseStatusInProgress)

		var before time.Time
		require.NoError(t, env.Postgres.Table("cases").Select("updated_on").Where("id = ?", caseID).Scan(&before).Error)

		found, err := repo.UpdateCaseStatus(t.Context(), caseID, types.CaseStatusInReview)
		assert.NoError(t, err)
		assert.True(t, found)
		assert.Equal(t, types.CaseStatusInReview, statusOfCase(t, env.Postgres, caseID))

		var after time.Time
		require.NoError(t, env.Postgres.Table("cases").Select("updated_on").Where("id = ?", caseID).Scan(&after).Error)
		assert.True(t, after.After(before), "updated_on did not advance: before %s, after %s", before, after)
	})
}

func Test_UpdateCaseStatus_AppliesStatusesInAnyOrder(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewCasesRepository(database.PostgresDB{DB: env.Postgres})
		caseID := seedCaseForStatus(t, repo, env.Postgres, 100021, types.CaseStatusInProgress)

		for _, status := range []string{types.CaseStatusCompleted, types.CaseStatusReopened, types.CaseStatusInProgress, types.CaseStatusRevoked} {
			found, err := repo.UpdateCaseStatus(t.Context(), caseID, status)
			assert.NoError(t, err)
			assert.Truef(t, found, "UpdateCaseStatus(%q) reported the case missing", status)
			assert.Equal(t, status, statusOfCase(t, env.Postgres, caseID))
		}
	})
}

func Test_UpdateCaseStatus_ReapplyingTheSameStatusIsFound(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewCasesRepository(database.PostgresDB{DB: env.Postgres})
		caseID := seedCaseForStatus(t, repo, env.Postgres, 100022, types.CaseStatusInReview)

		found, err := repo.UpdateCaseStatus(t.Context(), caseID, types.CaseStatusInReview)
		assert.NoError(t, err)
		assert.True(t, found)
	})
}

func Test_UpdateCaseStatus_UnknownCaseIsNotFound(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewCasesRepository(database.PostgresDB{DB: env.Postgres})

		found, err := repo.UpdateCaseStatus(t.Context(), 999999, types.CaseStatusInReview)
		assert.NoError(t, err)
		assert.False(t, found)
	})
}

func Test_UpdateCaseStatus_CrossTenantCaseIsNotFoundAndUnchanged(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewCasesRepository(database.PostgresDB{DB: env.Postgres})
		caseID := seedCaseForStatus(t, repo, env.Postgres, 100023, types.CaseStatusInProgress)

		ctx := types.ContextWithTenant(t.Context(), "tenant_b")
		found, err := repo.UpdateCaseStatus(ctx, caseID, types.CaseStatusRevoked)
		assert.NoError(t, err)
		assert.False(t, found, "radiant's case must not be writable from tenant_b")
		assert.Equal(t, types.CaseStatusInProgress, statusOfCase(t, env.Postgres, caseID), "the status must be left untouched")
	})
}

func Test_UpdateCaseStatus_OwnTenantCaseIsWritable(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewCasesRepository(database.PostgresDB{DB: env.Postgres})
		caseID := seedCaseForStatus(t, repo, env.Postgres, 100024, types.CaseStatusInProgress)

		ctx := types.ContextWithTenant(t.Context(), types.DefaultTenantCode)
		found, err := repo.UpdateCaseStatus(ctx, caseID, types.CaseStatusResolved)
		assert.NoError(t, err)
		assert.True(t, found)
		assert.Equal(t, types.CaseStatusResolved, statusOfCase(t, env.Postgres, caseID))
	})
}

func Test_CaseStatusDictionary_MatchesStatusTable(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewValueSetsRepository(database.PostgresDB{DB: env.Postgres})

		codes, err := repo.GetCodes(t.Context(), ValueSetStatus)
		assert.NoError(t, err)

		declared := append(append([]string{}, types.UserAppliedCaseStatuses...), types.SystemAppliedCaseStatuses...)
		slices.Sort(codes)
		slices.Sort(declared)
		assert.Equal(t, declared, codes, "internal/types case status codes have drifted from the `status` table")
	})
}
