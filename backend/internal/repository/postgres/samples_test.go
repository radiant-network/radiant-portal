package postgres

import (
	"fmt"
	"testing"

	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"gorm.io/gorm"
)

func Test_GetSampleBySubmitterSampleId_Found(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewSamplesRepository(database.PostgresDB{DB: env.Postgres})

		sample, err := repo.GetSampleByOrgCodeAndSubmitterSampleId(t.Context(), "CQGC", "S13224", types.DefaultTenantCode)

		assert.NoError(t, err)
		assert.NotNil(t, sample)
		assert.Equal(t, "S13224", sample.SubmitterSampleId)
		assert.Equal(t, "CQGC", sample.OrganizationCode)
	})
}

func Test_GetSampleBySubmitterSampleId_NotFound_InvalidSampleId(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewSamplesRepository(database.PostgresDB{DB: env.Postgres})

		sample, err := repo.GetSampleByOrgCodeAndSubmitterSampleId(t.Context(), "CQGC", "SAMPLE-UNKNOWN", types.DefaultTenantCode)

		assert.NoError(t, err)
		assert.Nil(t, sample)
	})
}

func Test_GetSampleBySubmitterSampleId_NotFound_InvalidOrgId(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewSamplesRepository(database.PostgresDB{DB: env.Postgres})

		sample, err := repo.GetSampleByOrgCodeAndSubmitterSampleId(t.Context(), "UNKNOWN-ORG", "S13224", types.DefaultTenantCode)

		assert.NoError(t, err)
		assert.Nil(t, sample)
	})
}

func Test_GetSampleBySubmitterSampleId_NotFound_BothInvalid(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewSamplesRepository(database.PostgresDB{DB: env.Postgres})

		sample, err := repo.GetSampleByOrgCodeAndSubmitterSampleId(t.Context(), "UNKNOWN-ORG", "SAMPLE-UNKNOWN", types.DefaultTenantCode)

		assert.NoError(t, err)
		assert.Nil(t, sample)
	})
}

func Test_GetTypeCodes(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewSamplesRepository(database.PostgresDB{DB: env.Postgres})

		typeCodes, err := repo.GetTypeCodes(t.Context())

		assert.NoError(t, err)
		assert.NotNil(t, typeCodes)
		assert.Greater(t, len(typeCodes), 0)
	})
}

func Test_GetSampleByOrgCodeAndSubmitterSampleId_Found(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewSamplesRepository(database.PostgresDB{DB: env.Postgres})

		sample, err := repo.GetSampleByOrgCodeAndSubmitterSampleId(t.Context(), "CQGC", "S13224", types.DefaultTenantCode)

		assert.NoError(t, err)
		assert.NotNil(t, sample)
		assert.Equal(t, "S13224", sample.SubmitterSampleId)
		assert.Equal(t, "CQGC", sample.OrganizationCode)
	})
}

func Test_GetSampleByOrgCodeAndSubmitterSampleId_NotFound_InvalidSampleId(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewSamplesRepository(database.PostgresDB{DB: env.Postgres})

		sample, err := repo.GetSampleByOrgCodeAndSubmitterSampleId(t.Context(), "CQGC", "SAMPLE-UNKNOWN", types.DefaultTenantCode)

		assert.NoError(t, err)
		assert.Nil(t, sample)
	})
}

func Test_GetSampleByOrgCodeAndSubmitterSampleId_NotFound_InvalidOrgCode(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewSamplesRepository(database.PostgresDB{DB: env.Postgres})

		sample, err := repo.GetSampleByOrgCodeAndSubmitterSampleId(t.Context(), "INVALID-ORG", "S13224", types.DefaultTenantCode)

		assert.NoError(t, err)
		assert.Nil(t, sample)
	})
}

func Test_GetSampleByOrgCodeAndSubmitterSampleId_NotFound_BothInvalid(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewSamplesRepository(database.PostgresDB{DB: env.Postgres})

		sample, err := repo.GetSampleByOrgCodeAndSubmitterSampleId(t.Context(), "INVALID-ORG", "SAMPLE-UNKNOWN", types.DefaultTenantCode)

		assert.NoError(t, err)
		assert.Nil(t, sample)
	})
}

func Test_UpdateSample_ExistingRow(t *testing.T) {
	// ExclusivePostgres: inserts directly into "sample" (id >= 1000), a table other parallel
	// WritePostgres tests may bulk-clean concurrently — see setup_postgres.go cleanUp.
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		db := env.Postgres
		repo := NewSamplesRepository(database.PostgresDB{DB: db})

		err := db.Exec(`
			INSERT INTO sample (id, type_code, tissue_site, histology_code, submitter_sample_id, patient_id, organization_code, tenant_code)
			VALUES (1001, 'blood', NULL, 'normal', 'S-UPDATE-1', 1, 'CQGC', 'radiant')
		`).Error
		require.NoError(t, err)

		updated := &types.Sample{
			SubmitterSampleId: "S-UPDATE-1",
			OrganizationCode:  "CQGC",
			TenantCode:        types.DefaultTenantCode,
			TypeCode:          "dna",
			TissueSite:        "Blood",
			HistologyCode:     "tumoral",
			PatientID:         2, // must be ignored — the owning patient is immutable
		}
		err = repo.UpdateSample(t.Context(), updated)
		require.NoError(t, err)

		sample, err := repo.GetSampleByOrgCodeAndSubmitterSampleId(t.Context(), "CQGC", "S-UPDATE-1", types.DefaultTenantCode)
		require.NoError(t, err)
		require.NotNil(t, sample)
		assert.Equal(t, "dna", sample.TypeCode)
		assert.Equal(t, "Blood", sample.TissueSite)
		assert.Equal(t, "tumoral", sample.HistologyCode)
		assert.Equal(t, 1, sample.PatientID, "patient_id must not change on update — the sample's owning patient is immutable")
	})
}

func Test_UpdateSample_ExistingRow_SetsFetusId(t *testing.T) {
	// ExclusivePostgres: inserts directly into "sample" (id >= 1000), a table other parallel
	// WritePostgres tests may bulk-clean concurrently — see setup_postgres.go cleanUp.
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		db := env.Postgres
		repo := NewSamplesRepository(database.PostgresDB{DB: db})

		err := db.Exec(`
			INSERT INTO sample (id, type_code, tissue_site, histology_code, submitter_sample_id, patient_id, organization_code, tenant_code)
			VALUES (1002, 'blood', NULL, 'normal', 'S-UPDATE-FETUS-1', 63, 'CHUSJ', 'radiant')
		`).Error
		require.NoError(t, err)

		fetusId := 1
		updated := &types.Sample{
			SubmitterSampleId: "S-UPDATE-FETUS-1",
			OrganizationCode:  "CHUSJ",
			TenantCode:        types.DefaultTenantCode,
			TypeCode:          "dna",
			TissueSite:        "Blood",
			HistologyCode:     "tumoral",
			FetusID:           &fetusId,
		}
		err = repo.UpdateSample(t.Context(), updated)
		require.NoError(t, err)

		sample, err := repo.GetSampleByOrgCodeAndSubmitterSampleId(t.Context(), "CHUSJ", "S-UPDATE-FETUS-1", types.DefaultTenantCode)
		require.NoError(t, err)
		require.NotNil(t, sample)
		require.NotNil(t, sample.FetusID)
		assert.Equal(t, fetusId, *sample.FetusID)
	})
}

func Test_UpdateSample_NotFound(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewSamplesRepository(database.PostgresDB{DB: env.Postgres})

		err := repo.UpdateSample(t.Context(), &types.Sample{
			SubmitterSampleId: "S-DOES-NOT-EXIST",
			OrganizationCode:  "CQGC",
			TenantCode:        types.DefaultTenantCode,
		})
		assert.NoError(t, err)

		sample, err := repo.GetSampleByOrgCodeAndSubmitterSampleId(t.Context(), "CQGC", "S-DOES-NOT-EXIST", types.DefaultTenantCode)
		assert.NoError(t, err)
		assert.Nil(t, sample)
	})
}

// seedTenantBSample inserts a sample under tenant_b whose natural key
// (organization_code, submitter_sample_id) is deliberately the same as a radiant fixture row, and
// returns its id. Both tenants holding that key is exactly the situation the tenant predicate has
// to survive: sample has no unique constraint on it.
func seedTenantBSample(t *testing.T, db *gorm.DB, sampleID int, submitterSampleId string) {
	t.Helper()
	patientID := sampleID + 900
	require.NoError(t, db.Exec(`
		INSERT INTO patient (id, organization_code, tenant_code, sex_code, life_status_code, submitter_patient_id, submitter_patient_id_type)
		VALUES (?, 'TENANT_B_ORG', 'tenant_b', 'male', 'alive', ?, 'MR')
	`, patientID, fmt.Sprintf("P-TENANT-B-%d", patientID)).Error)
	require.NoError(t, db.Exec(`
		INSERT INTO sample (id, type_code, tissue_site, histology_code, submitter_sample_id, patient_id, organization_code, tenant_code)
		VALUES (?, 'blood', NULL, 'normal', ?, ?, 'TENANT_B_ORG', 'tenant_b')
	`, sampleID, submitterSampleId, patientID).Error)
}

func Test_GetSampleByOrgCodeAndSubmitterSampleId_OtherTenantRow_NotReturned(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		db := env.Postgres
		repo := NewSamplesRepository(database.PostgresDB{DB: db})
		seedTenantBSample(t, db, 1010, "S-TENANT-ISO")

		sample, err := repo.GetSampleByOrgCodeAndSubmitterSampleId(t.Context(), "TENANT_B_ORG", "S-TENANT-ISO", types.DefaultTenantCode)
		assert.NoError(t, err)
		assert.Nil(t, sample, "a sample that exists only in tenant_b must not resolve for radiant")

		sample, err = repo.GetSampleByOrgCodeAndSubmitterSampleId(t.Context(), "TENANT_B_ORG", "S-TENANT-ISO", "tenant_b")
		assert.NoError(t, err)
		require.NotNil(t, sample)
		assert.Equal(t, 1010, sample.ID)
	})
}

func Test_UpdateSample_OtherTenantRow_NotModified(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		db := env.Postgres
		repo := NewSamplesRepository(database.PostgresDB{DB: db})
		seedTenantBSample(t, db, 1011, "S-TENANT-ISO-UPDATE")

		err := repo.UpdateSample(t.Context(), &types.Sample{
			SubmitterSampleId: "S-TENANT-ISO-UPDATE",
			OrganizationCode:  "TENANT_B_ORG",
			TenantCode:        types.DefaultTenantCode,
			TypeCode:          "dna",
			HistologyCode:     "tumoral",
		})
		require.NoError(t, err)

		var typeCode string
		require.NoError(t, db.Raw(`SELECT type_code FROM sample WHERE id = 1011`).Scan(&typeCode).Error)
		assert.Equal(t, "blood", typeCode, "a radiant batch must not update tenant_b's row")
	})
}
