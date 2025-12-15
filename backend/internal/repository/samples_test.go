package repository

import (
	"testing"

	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

func Test_GetSampleBySubmitterSampleId_Found(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
		repo := NewSamplesRepository(db)

		sample, err := repo.GetSampleBySubmitterSampleId(6, "S13224")

		assert.NoError(t, err)
		assert.NotNil(t, sample)
		assert.Equal(t, "S13224", sample.SubmitterSampleId)
		assert.Equal(t, 6, sample.OrganizationId)
	})
}

func Test_GetSampleBySubmitterSampleId_NotFound_InvalidSampleId(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
		repo := NewSamplesRepository(db)

		sample, err := repo.GetSampleBySubmitterSampleId(6, "SAMPLE-UNKNOWN")

		assert.NoError(t, err)
		assert.Nil(t, sample)
	})
}

func Test_GetSampleBySubmitterSampleId_NotFound_InvalidOrgId(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
		repo := NewSamplesRepository(db)

		sample, err := repo.GetSampleBySubmitterSampleId(999999, "S13224")

		assert.NoError(t, err)
		assert.Nil(t, sample)
	})
}

func Test_GetSampleBySubmitterSampleId_NotFound_BothInvalid(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
		repo := NewSamplesRepository(db)

		sample, err := repo.GetSampleBySubmitterSampleId(999999, "SAMPLE-UNKNOWN")

		assert.NoError(t, err)
		assert.Nil(t, sample)
	})
}

func Test_GetTypeCodes(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
		repo := NewSamplesRepository(db)

		typeCodes, err := repo.GetTypeCodes()

		assert.NoError(t, err)
		assert.NotNil(t, typeCodes)
		assert.Greater(t, len(typeCodes), 0)
	})
}
