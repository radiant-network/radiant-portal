package repository

import (
	"testing"

	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"gorm.io/gorm"
)

func Test_GetSampleBySubmitterSampleId_Found(t *testing.T) {
	testutils.ParallelTestWithPostgres(t, func(t *testing.T, db *gorm.DB) {
		repo := NewSamplesRepository(db)

		sample, err := repo.GetSampleByOrgCodeAndSubmitterSampleId(t.Context(), "CQGC", "S13224")

		assert.NoError(t, err)
		assert.NotNil(t, sample)
		assert.Equal(t, "S13224", sample.SubmitterSampleId)
		assert.Equal(t, "CQGC", sample.OrganizationCode)
	})
}

func Test_GetSampleBySubmitterSampleId_NotFound_InvalidSampleId(t *testing.T) {
	testutils.ParallelTestWithPostgres(t, func(t *testing.T, db *gorm.DB) {
		repo := NewSamplesRepository(db)

		sample, err := repo.GetSampleByOrgCodeAndSubmitterSampleId(t.Context(), "CQGC", "SAMPLE-UNKNOWN")

		assert.NoError(t, err)
		assert.Nil(t, sample)
	})
}

func Test_GetSampleBySubmitterSampleId_NotFound_InvalidOrgId(t *testing.T) {
	testutils.ParallelTestWithPostgres(t, func(t *testing.T, db *gorm.DB) {
		repo := NewSamplesRepository(db)

		sample, err := repo.GetSampleByOrgCodeAndSubmitterSampleId(t.Context(), "UNKNOWN-ORG", "S13224")

		assert.NoError(t, err)
		assert.Nil(t, sample)
	})
}

func Test_GetSampleBySubmitterSampleId_NotFound_BothInvalid(t *testing.T) {
	testutils.ParallelTestWithPostgres(t, func(t *testing.T, db *gorm.DB) {
		repo := NewSamplesRepository(db)

		sample, err := repo.GetSampleByOrgCodeAndSubmitterSampleId(t.Context(), "UNKNOWN-ORG", "SAMPLE-UNKNOWN")

		assert.NoError(t, err)
		assert.Nil(t, sample)
	})
}

func Test_GetTypeCodes(t *testing.T) {
	testutils.ParallelTestWithPostgres(t, func(t *testing.T, db *gorm.DB) {
		repo := NewSamplesRepository(db)

		typeCodes, err := repo.GetTypeCodes(t.Context())

		assert.NoError(t, err)
		assert.NotNil(t, typeCodes)
		assert.Greater(t, len(typeCodes), 0)
	})
}

func Test_GetSampleByOrgCodeAndSubmitterSampleId_Found(t *testing.T) {
	testutils.ParallelTestWithPostgres(t, func(t *testing.T, db *gorm.DB) {
		repo := NewSamplesRepository(db)

		sample, err := repo.GetSampleByOrgCodeAndSubmitterSampleId(t.Context(), "CQGC", "S13224")

		assert.NoError(t, err)
		assert.NotNil(t, sample)
		assert.Equal(t, "S13224", sample.SubmitterSampleId)
		assert.Equal(t, "CQGC", sample.OrganizationCode)
	})
}

func Test_GetSampleByOrgCodeAndSubmitterSampleId_NotFound_InvalidSampleId(t *testing.T) {
	testutils.ParallelTestWithPostgres(t, func(t *testing.T, db *gorm.DB) {
		repo := NewSamplesRepository(db)

		sample, err := repo.GetSampleByOrgCodeAndSubmitterSampleId(t.Context(), "CQGC", "SAMPLE-UNKNOWN")

		assert.NoError(t, err)
		assert.Nil(t, sample)
	})
}

func Test_GetSampleByOrgCodeAndSubmitterSampleId_NotFound_InvalidOrgCode(t *testing.T) {
	testutils.ParallelTestWithPostgres(t, func(t *testing.T, db *gorm.DB) {
		repo := NewSamplesRepository(db)

		sample, err := repo.GetSampleByOrgCodeAndSubmitterSampleId(t.Context(), "INVALID-ORG", "S13224")

		assert.NoError(t, err)
		assert.Nil(t, sample)
	})
}

func Test_GetSampleByOrgCodeAndSubmitterSampleId_NotFound_BothInvalid(t *testing.T) {
	testutils.ParallelTestWithPostgres(t, func(t *testing.T, db *gorm.DB) {
		repo := NewSamplesRepository(db)

		sample, err := repo.GetSampleByOrgCodeAndSubmitterSampleId(t.Context(), "INVALID-ORG", "SAMPLE-UNKNOWN")

		assert.NoError(t, err)
		assert.Nil(t, sample)
	})
}

func Test_UpdateSample_ExistingRow(t *testing.T) {
	// ExclusivePostgres: inserts directly into "sample" (id >= 1000), a table other parallel
	// WritePostgres tests may bulk-clean concurrently — see setup_postgres.go cleanUp.
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		db := env.Postgres
		repo := NewSamplesRepository(db)

		err := db.Exec(`
			INSERT INTO sample (id, type_code, tissue_site, histology_code, submitter_sample_id, patient_id, organization_code, tenant_code)
			VALUES (1001, 'blood', NULL, 'normal', 'S-UPDATE-1', 1, 'CQGC', 'radiant')
		`).Error
		require.NoError(t, err)

		updated := &types.Sample{
			SubmitterSampleId: "S-UPDATE-1",
			OrganizationCode:  "CQGC",
			TypeCode:          "dna",
			TissueSite:        "Blood",
			HistologyCode:     "tumoral",
			PatientID:         2,
		}
		err = repo.UpdateSample(t.Context(), updated)
		require.NoError(t, err)

		sample, err := repo.GetSampleByOrgCodeAndSubmitterSampleId(t.Context(), "CQGC", "S-UPDATE-1")
		require.NoError(t, err)
		require.NotNil(t, sample)
		assert.Equal(t, "dna", sample.TypeCode)
		assert.Equal(t, "Blood", sample.TissueSite)
		assert.Equal(t, "tumoral", sample.HistologyCode)
		assert.Equal(t, 2, sample.PatientID)
	})
}

func Test_UpdateSample_NotFound(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewSamplesRepository(env.Postgres)

		err := repo.UpdateSample(t.Context(), &types.Sample{
			SubmitterSampleId: "S-DOES-NOT-EXIST",
			OrganizationCode:  "CQGC",
		})
		assert.NoError(t, err)

		sample, err := repo.GetSampleByOrgCodeAndSubmitterSampleId(t.Context(), "CQGC", "S-DOES-NOT-EXIST")
		assert.NoError(t, err)
		assert.Nil(t, sample)
	})
}
