package postgres

import (
	"testing"

	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func Test_CreateCases(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewCasesRepository(database.PostgresDB{DB: env.Postgres})
		orgCode := "CHOP"
		labCode := "CQGC"
		newCase := &types.Case{
			ID:                        999,
			ProbandID:                 3,
			ProjectID:                 1,
			StatusCode:                "in_progress",
			PrimaryCondition:          "MONDO:0000001",
			DiagnosisLabCode:          &labCode,
			Note:                      "This is a test",
			ServiceID:                 1,
			Service:                   types.ServiceCatalog{},
			PriorityCode:              "routine",
			CaseTypeCode:              "germline",
			CaseCategoryCode:          "postnatal",
			ConditionCodeSystem:       "MONDO",
			ResolutionStatusCode:      "unsolved",
			Requester:                 "Dr. Test",
			RequesterOrganizationCode: &orgCode,
			TenantCode:                types.DefaultTenantCode,
		}
		err := repo.CreateCase(t.Context(), newCase)
		assert.NoError(t, err)

		var c types.Case
		err = repo.db.Raw(`SELECT * FROM cases WHERE id = 999;`).First(&c).Error
		assert.NoError(t, err)
		assert.Equal(t, 999, c.ID)
		assert.Equal(t, 3, c.ProbandID)
		assert.Equal(t, "Dr. Test", c.Requester)

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
			ID:                        100010,
			ProbandID:                 1,
			ProjectID:                 1,
			StatusCode:                "in_progress",
			PrimaryCondition:          "MONDO:0000001",
			DiagnosisLabCode:          &diagLab,
			Note:                      "original note",
			ServiceID:                 1,
			PriorityCode:              "routine",
			CaseTypeCode:              "germline",
			CaseCategoryCode:          "postnatal",
			ConditionCodeSystem:       "MONDO",
			ResolutionStatusCode:      "unsolved",
			Requester:                 "Dr. Original",
			RequesterOrganizationCode: &orgCode,
			TenantCode:                types.DefaultTenantCode,
		}
		require.NoError(t, repo.CreateCase(t.Context(), original))
		t.Cleanup(func() { db.Exec("DELETE FROM cases WHERE id = 100010") })

		newDiagLab := "CHUSJ"
		newOrgCode := "CHUSJ"
		update := &types.Case{
			CaseTypeCode:              "somatic",
			StatusCode:                "completed",
			DiagnosisLabCode:          &newDiagLab,
			ConditionCodeSystem:       "OMIM",
			PrimaryCondition:          "OMIM:0000002",
			PriorityCode:              "urgent",
			CaseCategoryCode:          "prenatal",
			ServiceID:                 1,
			ResolutionStatusCode:      "solved",
			Note:                      "updated note",
			RequesterOrganizationCode: &newOrgCode,
			Requester:                 "Dr. Updated",
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
		assert.Equal(t, "solved", result.ResolutionStatusCode)
		assert.Equal(t, "updated note", result.Note)
		assert.Equal(t, "CHUSJ", *result.RequesterOrganizationCode)
		assert.Equal(t, "Dr. Updated", result.Requester)

		// Immutable identity fields untouched.
		assert.Equal(t, 1, result.ProbandID)
		assert.Equal(t, 1, result.ProjectID)
		assert.Equal(t, types.DefaultTenantCode, result.TenantCode)
	})
}

func Test_GetServiceByCodeAndType_Case(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewCasesRepository(database.PostgresDB{DB: env.Postgres})
		service, err := repo.GetServiceByCodeAndType(t.Context(), "WGA", types.ServiceTypeCase)
		assert.NoError(t, err)
		assert.Equal(t, 1, service.ID)
		assert.Equal(t, "WGA", service.Code)
		assert.Equal(t, types.ServiceTypeCase, service.Type)
	})
}

func Test_GetServiceByCodeAndType_Sequencing(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewCasesRepository(database.PostgresDB{DB: env.Postgres})
		// Seeded by migration 000023 (MSSS sequencing-request-code 75022 = genome).
		service, err := repo.GetServiceByCodeAndType(t.Context(), "75022", types.ServiceTypeSequencing)
		assert.NoError(t, err)
		assert.Equal(t, "75022", service.Code)
		assert.Equal(t, types.ServiceTypeSequencing, service.Type)
		assert.Equal(t, "Normal Genome Sequencing", service.NameEn)
	})
}

// The type filter is what stops an analysis code resolving as a sequencing service.
func Test_GetServiceByCodeAndType_WrongType(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewCasesRepository(database.PostgresDB{DB: env.Postgres})
		service, err := repo.GetServiceByCodeAndType(t.Context(), "WGA", types.ServiceTypeSequencing)
		assert.NoError(t, err)
		assert.Nil(t, service)
	})
}

func Test_GetServiceByCodeAndType_NotFound(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewCasesRepository(database.PostgresDB{DB: env.Postgres})
		service, err := repo.GetServiceByCodeAndType(t.Context(), "NON_EXISTENT_CODE", types.ServiceTypeCase)
		assert.NoError(t, err)
		assert.Nil(t, service)
	})
}

func Test_CreateDuplicateSubmitterCaseId_Error(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewCasesRepository(database.PostgresDB{DB: env.Postgres})

		diagLab := "CQGC"
		orgCode := "CQGC"
		newCase := &types.Case{
			ID:                        1000,
			ProbandID:                 3,
			ProjectID:                 1,
			StatusCode:                "in_progress",
			PrimaryCondition:          "MONDO:0000001",
			DiagnosisLabCode:          &diagLab,
			Note:                      "This is a test",
			ServiceID:                 1,
			PriorityCode:              "routine",
			CaseTypeCode:              "germline",
			CaseCategoryCode:          "postnatal",
			ConditionCodeSystem:       "MONDO",
			ResolutionStatusCode:      "unsolved",
			Requester:                 "Dr. Test",
			RequesterOrganizationCode: &orgCode,
			TenantCode:                types.DefaultTenantCode,
			SubmitterCaseID:           "1:1", // Duplicate submitter_case_id
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
			ID:                        1000,
			ProbandID:                 3,
			ProjectID:                 1,
			StatusCode:                "in_progress",
			PrimaryCondition:          "MONDO:0000001",
			DiagnosisLabCode:          &diagLab,
			Note:                      "This is a test",
			ServiceID:                 1,
			PriorityCode:              "routine",
			CaseTypeCode:              "germline",
			CaseCategoryCode:          "postnatal",
			ConditionCodeSystem:       "MONDO",
			ResolutionStatusCode:      "unsolved",
			Requester:                 "Dr. Test",
			RequesterOrganizationCode: &orgCode,
			TenantCode:                types.DefaultTenantCode,
			SubmitterCaseID:           "",
		}
		err := repo.CreateCase(t.Context(), newCase)
		assert.NoError(t, err)
		env.Postgres.Exec("DELETE FROM cases WHERE id = 1000 AND submitter_case_id='';")
	})
}
