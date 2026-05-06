package repository

import (
	"testing"

	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

func Test_GetClinvarRCV(t *testing.T) {
	testutils.ParallelTestWithStarrocks(t, "clinvar", func(t *testing.T, db *gorm.DB) {
		repo := NewClinvarRCVRepository(db)
		clinvarRcv, err := repo.GetVariantClinvarConditions(1000)
		assert.NoError(t, err)
		if assert.Len(t, clinvarRcv, 1) {
			assert.Equal(t, "123456", clinvarRcv[0].ClinvarId)
			assert.Equal(t, types.JsonArray[string]{"Pathogenic"}, clinvarRcv[0].ClinicalSignificance)
			assert.Equal(t, 1, clinvarRcv[0].SubmissionCount)
		}
	})
}

func Test_GetClinvarRCV_EmptyVariant(t *testing.T) {
	testutils.ParallelTestWithStarrocks(t, "clinvar", func(t *testing.T, db *gorm.DB) {
		repo := NewClinvarRCVRepository(db)
		clinvarRcv, err := repo.GetVariantClinvarConditions(42)
		assert.NoError(t, err)
		assert.Len(t, clinvarRcv, 0)
	})
}

func Test_GetClinvarRCV_EmptyClinvarRCV(t *testing.T) {
	testutils.ParallelTestWithStarrocks(t, "clinvar", func(t *testing.T, db *gorm.DB) {
		repo := NewClinvarRCVRepository(db)
		clinvarRcv, err := repo.GetVariantClinvarConditions(1003)
		assert.NoError(t, err)
		assert.Len(t, clinvarRcv, 0)
	})
}
