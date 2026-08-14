package postgres

import (
	"testing"

	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

// The write tests below run ExclusivePostgres: every row they create lands above the id 1000
// watermark that cleanUp wipes, so a parallel test's cleanup would delete them mid-test. They
// attach to the seeded cases (ids below the watermark) rather than creating their own.
func sequencingServiceID(t *testing.T, repo *CasesRepository, code string) int {
	t.Helper()
	service, err := repo.GetServiceByCodeAndType(t.Context(), code, types.ServiceTypeSequencing)
	require.NoError(t, err)
	require.NotNil(t, service)
	return service.ID
}

func Test_UpsertSequencingRequest_Create(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewSequencingRequestRepository(database.PostgresDB{DB: env.Postgres})
		casesRepo := NewCasesRepository(database.PostgresDB{DB: env.Postgres})

		request := &types.SequencingRequest{
			ServiceID:                    sequencingServiceID(t, casesRepo, "75022"),
			CaseID:                       2,
			PatientID:                    5,
			StatusCode:                   "submitted",
			SubmitterSequencingRequestID: "SR-CREATE-001",
			TenantCode:                   types.DefaultTenantCode,
		}
		require.NoError(t, repo.UpsertSequencingRequest(t.Context(), request))
		t.Cleanup(func() { env.Postgres.Exec("DELETE FROM sequencing_request WHERE id = ?", request.ID) })
		assert.Greater(t, request.ID, 0, "id must come back from RETURNING so an experiment can be linked")

		stored, err := repo.GetSequencingRequestByCaseIdAndSubmitterId(t.Context(), 2, "SR-CREATE-001")
		assert.NoError(t, err)
		require.NotNil(t, stored)
		assert.Equal(t, request.ID, stored.ID)
		assert.Equal(t, 5, stored.PatientID)
		assert.Equal(t, "submitted", stored.StatusCode)
	})
}

// The same batch is posted repeatedly (update_case resends everything), so the natural key must
// update the row instead of duplicating it.
func Test_UpsertSequencingRequest_SameNaturalKeyUpdates(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewSequencingRequestRepository(database.PostgresDB{DB: env.Postgres})
		casesRepo := NewCasesRepository(database.PostgresDB{DB: env.Postgres})

		genome := sequencingServiceID(t, casesRepo, "75022")
		exome := sequencingServiceID(t, casesRepo, "75020")

		first := &types.SequencingRequest{
			ServiceID:                    genome,
			CaseID:                       2,
			PatientID:                    5,
			StatusCode:                   "draft",
			SubmitterSequencingRequestID: "SR-UPSERT-001",
			TenantCode:                   types.DefaultTenantCode,
		}
		require.NoError(t, repo.UpsertSequencingRequest(t.Context(), first))
		t.Cleanup(func() { env.Postgres.Exec("DELETE FROM sequencing_request WHERE id = ?", first.ID) })

		second := &types.SequencingRequest{
			ServiceID:                    exome,
			CaseID:                       2,
			PatientID:                    6,
			StatusCode:                   "completed",
			SubmitterSequencingRequestID: "SR-UPSERT-001",
			TenantCode:                   types.DefaultTenantCode,
		}
		require.NoError(t, repo.UpsertSequencingRequest(t.Context(), second))
		assert.Equal(t, first.ID, second.ID, "the upsert must land on the same row")

		stored, err := repo.GetSequencingRequestByCaseIdAndSubmitterId(t.Context(), 2, "SR-UPSERT-001")
		assert.NoError(t, err)
		require.NotNil(t, stored)
		assert.Equal(t, exome, stored.ServiceID)
		assert.Equal(t, 6, stored.PatientID)
		assert.Equal(t, "completed", stored.StatusCode)
	})
}

// The natural key is scoped by case, so two cases may carry the same submitter id — two QLIN
// sites reusing an id must not collide.
func Test_UpsertSequencingRequest_SameSubmitterIdInAnotherCase(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewSequencingRequestRepository(database.PostgresDB{DB: env.Postgres})
		casesRepo := NewCasesRepository(database.PostgresDB{DB: env.Postgres})
		serviceID := sequencingServiceID(t, casesRepo, "75022")

		for _, spec := range []struct {
			caseID    int
			patientID int
		}{{2, 5}, {3, 7}} {
			request := &types.SequencingRequest{
				ServiceID:                    serviceID,
				CaseID:                       spec.caseID,
				PatientID:                    spec.patientID,
				StatusCode:                   "submitted",
				SubmitterSequencingRequestID: "SR-SHARED-001",
				TenantCode:                   types.DefaultTenantCode,
			}
			require.NoError(t, repo.UpsertSequencingRequest(t.Context(), request))
			t.Cleanup(func() { env.Postgres.Exec("DELETE FROM sequencing_request WHERE id = ?", request.ID) })
		}

		first, err := repo.GetSequencingRequestByCaseIdAndSubmitterId(t.Context(), 2, "SR-SHARED-001")
		assert.NoError(t, err)
		require.NotNil(t, first)
		second, err := repo.GetSequencingRequestByCaseIdAndSubmitterId(t.Context(), 3, "SR-SHARED-001")
		assert.NoError(t, err)
		require.NotNil(t, second)
		assert.NotEqual(t, first.ID, second.ID)
	})
}

func Test_GetSequencingRequestByCaseIdAndSubmitterId_NotFound(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewSequencingRequestRepository(database.PostgresDB{DB: env.Postgres})
		request, err := repo.GetSequencingRequestByCaseIdAndSubmitterId(t.Context(), 1, "SR-DOES-NOT-EXIST")
		assert.NoError(t, err)
		assert.Nil(t, request)
	})
}

func Test_GetSequencingRequestsByCaseId_Seeded(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewSequencingRequestRepository(database.PostgresDB{DB: env.Postgres})
		requests, err := repo.GetSequencingRequestsByCaseId(t.Context(), 1)
		assert.NoError(t, err)
		require.Len(t, requests, 3)
		assert.Equal(t, "SR-1-PROBAND", requests[0].SubmitterSequencingRequestID)
		assert.Equal(t, 3, requests[0].PatientID)
	})
}

func Test_SetSequencingExperimentRequestID(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		seqReqRepo := NewSequencingRequestRepository(database.PostgresDB{DB: env.Postgres})
		seqExpRepo := NewSequencingExperimentRepository(database.PostgresDB{DB: env.Postgres})
		casesRepo := NewCasesRepository(database.PostgresDB{DB: env.Postgres})

		request := &types.SequencingRequest{
			ServiceID:                    sequencingServiceID(t, casesRepo, "75022"),
			CaseID:                       2,
			PatientID:                    5,
			StatusCode:                   "submitted",
			SubmitterSequencingRequestID: "SR-LINK-001",
			TenantCode:                   types.DefaultTenantCode,
		}
		require.NoError(t, seqReqRepo.UpsertSequencingRequest(t.Context(), request))

		seqExp := &types.SequencingExperiment{
			SampleID:                     1,
			StatusCode:                   "completed",
			Aliquot:                      "ALQ-LINK-001",
			SequencingLabCode:            "CQGC",
			TenantCode:                   types.DefaultTenantCode,
			ExperimentalStrategyCode:     "wgs",
			SequencingReadTechnologyCode: "short_read",
			PlatformCode:                 "illumina",
		}
		require.NoError(t, seqExpRepo.CreateSequencingExperiment(t.Context(), seqExp))
		t.Cleanup(func() {
			env.Postgres.Exec("DELETE FROM sequencing_experiment WHERE id = ?", seqExp.ID)
			env.Postgres.Exec("DELETE FROM sequencing_request WHERE id = ?", request.ID)
		})

		require.NoError(t, seqExpRepo.SetSequencingExperimentRequestID(t.Context(), seqExp.ID, request.ID))

		var stored types.SequencingExperiment
		require.NoError(t, env.Postgres.Table(types.SequencingExperimentTable.Name).
			Where("id = ?", seqExp.ID).
			First(&stored).Error)
		require.NotNil(t, stored.SequencingRequestID)
		assert.Equal(t, request.ID, *stored.SequencingRequestID)
	})
}
