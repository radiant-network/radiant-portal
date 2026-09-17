package postgres

import (
	"fmt"
	"testing"

	_ "github.com/go-sql-driver/mysql"
	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"gorm.io/gorm"
)

func Test_GetSequencingExperimentBySampleID(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewSequencingExperimentRepository(database.PostgresDB{DB: env.Postgres})
		seqExps, err := repo.GetSequencingExperimentBySampleID(t.Context(), 1)
		assert.NoError(t, err)
		assert.Len(t, seqExps, 2)
		assert.Equal(t, 1, seqExps[0].ID)
		assert.Equal(t, "NA12892", seqExps[0].Aliquot)
		assert.Equal(t, 70, seqExps[1].ID)
		assert.Equal(t, "NA12892", seqExps[1].Aliquot)
	})
}

func Test_GetSequencingExperimentBySampleIDtNotFound(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewSequencingExperimentRepository(database.PostgresDB{DB: env.Postgres})
		sequencing, err := repo.GetSequencingExperimentBySampleID(t.Context(), -42)
		assert.NoError(t, err)
		assert.Empty(t, sequencing)
	})
}

func Test_GetSequencingExperimentByAliquot(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewSequencingExperimentRepository(database.PostgresDB{DB: env.Postgres})
		seqExps, err := repo.GetSequencingExperimentByAliquot(t.Context(), "NA12892", types.DefaultTenantCode)
		assert.NoError(t, err)
		assert.Len(t, seqExps, 2)
		assert.Equal(t, 1, seqExps[0].ID)
		assert.Equal(t, 70, seqExps[1].ID)
	})
}

func Test_GetSequencingExperimentByAliquotNotFound(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewSequencingExperimentRepository(database.PostgresDB{DB: env.Postgres})
		sequencing, err := repo.GetSequencingExperimentByAliquot(t.Context(), "FOOBAR", types.DefaultTenantCode)
		assert.NoError(t, err)
		assert.Empty(t, sequencing)
	})
}

func Test_GetSequencingExperimentByAliquotAndSubmitterSample(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewSequencingExperimentRepository(database.PostgresDB{DB: env.Postgres})

		organizationCode := "CQGC"
		aliquot := "NA12892"
		submitterSampleId := "S13224"

		expected := SequencingExperiment{
			ID:                           1,
			SampleID:                     1,
			Aliquot:                      aliquot,
			PlatformCode:                 "illumina",
			StatusCode:                   "completed",
			ExperimentalStrategyCode:     "wgs",
			SequencingReadTechnologyCode: "short_read",
			CaptureKit:                   "SureSelect Custom DNA Target",
			SequencingLabCode:            "CQGC",
			TenantCode:                   types.DefaultTenantCode,
			RunName:                      "1617",
			RunAlias:                     "A00516_0169",
		}

		seqExp, err := repo.GetSequencingExperimentByAliquotAndSubmitterSample(t.Context(), aliquot, submitterSampleId, organizationCode, types.DefaultTenantCode)
		assert.NoError(t, err)
		assert.Equal(t, seqExp.ID, expected.ID)
		assert.Equal(t, seqExp.Aliquot, expected.Aliquot)
		assert.Equal(t, seqExp.PlatformCode, expected.PlatformCode)
		assert.Equal(t, seqExp.StatusCode, expected.StatusCode)
		assert.Equal(t, seqExp.ExperimentalStrategyCode, expected.ExperimentalStrategyCode)
		assert.Equal(t, seqExp.SequencingReadTechnologyCode, expected.SequencingReadTechnologyCode)
		assert.Equal(t, seqExp.CaptureKit, expected.CaptureKit)
		assert.Equal(t, seqExp.SequencingLabCode, expected.SequencingLabCode)
		assert.Equal(t, seqExp.RunName, expected.RunName)
		assert.Equal(t, seqExp.RunAlias, expected.RunAlias)
	})
}

func Test_GetSequencingExperimentByAliquotAndSubmitterSampleNotFound(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewSequencingExperimentRepository(database.PostgresDB{DB: env.Postgres})

		organizationCode := "CHUSJ"
		aliquot := "NA12892"
		submitterSampleId := "S13224"

		seqExp, err := repo.GetSequencingExperimentByAliquotAndSubmitterSample(t.Context(), aliquot, submitterSampleId, organizationCode, types.DefaultTenantCode)
		assert.NoError(t, err)
		assert.Nil(t, seqExp)
	})
}

func Test_UpdateSequencingExperiment_ExistingRow(t *testing.T) {
	// ExclusivePostgres: inserts directly into "sample"/"sequencing_experiment" (id >= 1000),
	// tables other parallel WritePostgres tests may bulk-clean concurrently — see
	// setup_postgres.go cleanUp.
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		db := env.Postgres
		repo := NewSequencingExperimentRepository(database.PostgresDB{DB: db})

		require.NoError(t, db.Exec(`
			INSERT INTO sample (id, type_code, tissue_site, histology_code, submitter_sample_id, patient_id, organization_code, tenant_code)
			VALUES (1001, 'blood', NULL, 'normal', 'S-SEQ-UPDATE-1', 1, 'CQGC', 'radiant')
		`).Error)
		require.NoError(t, db.Exec(`
			INSERT INTO sequencing_experiment (id, sample_id, status_code, aliquot, sequencing_lab_code, tenant_code, experimental_strategy_code, sequencing_read_technology_code, platform_code, created_on, updated_on)
			VALUES (1001, 1001, 'submitted', 'ALIQUOT-UPDATE-1', 'CQGC', 'radiant', 'wgs', 'short_read', 'illumina', now(), now())
		`).Error)

		updated := &SequencingExperiment{
			SampleID:                     1001,
			Aliquot:                      "ALIQUOT-UPDATE-1",
			TenantCode:                   types.DefaultTenantCode,
			StatusCode:                   "completed",
			SequencingLabCode:            "CHUSJ",
			ExperimentalStrategyCode:     "wxs",
			SequencingReadTechnologyCode: "long_read",
			PlatformCode:                 "pacbio",
			RunName:                      "RUN-1",
			RunAlias:                     "RUN-ALIAS-1",
			CaptureKit:                   "CPT-1",
		}
		require.NoError(t, repo.UpdateSequencingExperiment(t.Context(), updated))

		seqExp, err := repo.GetSequencingExperimentByAliquotAndSubmitterSample(t.Context(), "ALIQUOT-UPDATE-1", "S-SEQ-UPDATE-1", "CQGC", types.DefaultTenantCode)
		require.NoError(t, err)
		require.NotNil(t, seqExp)
		assert.Equal(t, "completed", seqExp.StatusCode)
		assert.Equal(t, "CHUSJ", seqExp.SequencingLabCode)
		assert.Equal(t, "wxs", seqExp.ExperimentalStrategyCode)
		assert.Equal(t, "long_read", seqExp.SequencingReadTechnologyCode)
		assert.Equal(t, "pacbio", seqExp.PlatformCode)
		assert.Equal(t, "RUN-1", seqExp.RunName)
		assert.Equal(t, "RUN-ALIAS-1", seqExp.RunAlias)
		assert.Equal(t, "CPT-1", seqExp.CaptureKit)
	})
}

func Test_UpdateSequencingExperiment_NotFound(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewSequencingExperimentRepository(database.PostgresDB{DB: env.Postgres})

		err := repo.UpdateSequencingExperiment(t.Context(), &SequencingExperiment{
			SampleID: 999999,
			Aliquot:  "ALIQUOT-DOES-NOT-EXIST",
		})
		assert.NoError(t, err)
	})
}

// seedTenantBSequencingExperiment inserts a sequencing experiment (and the sample/patient it hangs
// off) under tenant_b, reusing natural keys a radiant batch could carry.
func seedTenantBSequencingExperiment(t *testing.T, db *gorm.DB, seqExpID int, aliquot string, submitterSampleId string) {
	t.Helper()
	patientID, sampleID := seqExpID+800, seqExpID+900
	require.NoError(t, db.Exec(`
		INSERT INTO patient (id, organization_code, tenant_code, sex_code, life_status_code, submitter_patient_id, submitter_patient_id_type)
		VALUES (?, 'TENANT_B_ORG', 'tenant_b', 'male', 'alive', ?, 'MR')
	`, patientID, fmt.Sprintf("P-TENANT-B-%d", patientID)).Error)
	require.NoError(t, db.Exec(`
		INSERT INTO sample (id, type_code, tissue_site, histology_code, submitter_sample_id, patient_id, organization_code, tenant_code)
		VALUES (?, 'blood', NULL, 'normal', ?, ?, 'TENANT_B_ORG', 'tenant_b')
	`, sampleID, submitterSampleId, patientID).Error)
	require.NoError(t, db.Exec(`
		INSERT INTO sequencing_experiment (id, sample_id, status_code, aliquot, sequencing_lab_code, tenant_code, experimental_strategy_code, sequencing_read_technology_code, platform_code, created_on, updated_on)
		VALUES (?, ?, 'submitted', ?, 'TENANT_B_ORG', 'tenant_b', 'wgs', 'short_read', 'illumina', now(), now())
	`, seqExpID, sampleID, aliquot).Error)
}

func Test_GetSequencingExperimentByAliquot_OtherTenantRow_NotReturned(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		db := env.Postgres
		repo := NewSequencingExperimentRepository(database.PostgresDB{DB: db})
		seedTenantBSequencingExperiment(t, db, 1040, "ALIQUOT-TENANT-ISO", "S-SEQ-TENANT-ISO")

		seqExps, err := repo.GetSequencingExperimentByAliquot(t.Context(), "ALIQUOT-TENANT-ISO", types.DefaultTenantCode)
		assert.NoError(t, err)
		assert.Empty(t, seqExps, "an aliquot that exists only in tenant_b must not resolve for radiant")

		seqExps, err = repo.GetSequencingExperimentByAliquot(t.Context(), "ALIQUOT-TENANT-ISO", "tenant_b")
		assert.NoError(t, err)
		require.Len(t, seqExps, 1)
		assert.Equal(t, 1040, seqExps[0].ID)
	})
}

func Test_GetSequencingExperimentByAliquotAndSubmitterSample_OtherTenantRow_NotReturned(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		db := env.Postgres
		repo := NewSequencingExperimentRepository(database.PostgresDB{DB: db})
		seedTenantBSequencingExperiment(t, db, 1041, "ALIQUOT-TENANT-ISO-2", "S-SEQ-TENANT-ISO-2")

		seqExp, err := repo.GetSequencingExperimentByAliquotAndSubmitterSample(t.Context(), "ALIQUOT-TENANT-ISO-2", "S-SEQ-TENANT-ISO-2", "TENANT_B_ORG", types.DefaultTenantCode)
		assert.NoError(t, err)
		assert.Nil(t, seqExp, "a sequencing experiment that exists only in tenant_b must not resolve for radiant")

		seqExp, err = repo.GetSequencingExperimentByAliquotAndSubmitterSample(t.Context(), "ALIQUOT-TENANT-ISO-2", "S-SEQ-TENANT-ISO-2", "TENANT_B_ORG", "tenant_b")
		assert.NoError(t, err)
		require.NotNil(t, seqExp)
		assert.Equal(t, 1041, seqExp.ID)
	})
}

func Test_UpdateSequencingExperiment_OtherTenantRow_NotModified(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		db := env.Postgres
		repo := NewSequencingExperimentRepository(database.PostgresDB{DB: db})
		seedTenantBSequencingExperiment(t, db, 1042, "ALIQUOT-TENANT-ISO-3", "S-SEQ-TENANT-ISO-3")

		require.NoError(t, repo.UpdateSequencingExperiment(t.Context(), &SequencingExperiment{
			SampleID:                     1942,
			Aliquot:                      "ALIQUOT-TENANT-ISO-3",
			TenantCode:                   types.DefaultTenantCode,
			StatusCode:                   "completed",
			SequencingLabCode:            "CHUSJ",
			ExperimentalStrategyCode:     "wxs",
			SequencingReadTechnologyCode: "long_read",
			PlatformCode:                 "pacbio",
		}))

		var statusCode string
		require.NoError(t, db.Raw(`SELECT status_code FROM sequencing_experiment WHERE id = 1042`).Scan(&statusCode).Error)
		assert.Equal(t, "submitted", statusCode, "a radiant batch must not update tenant_b's row")
	})
}
