package repository

import (
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
	"testing"
)

func Test_GetClinvarRCV(t *testing.T) {
	testutils.ParallelTestWithDb(t, "clinvar", func(t *testing.T, db *gorm.DB) {
		repo := NewClinvarRCVRepository(db)
		clinvarRcv, err := repo.GetVariantClinvarConditions(1000)
		assert.NoError(t, err)
		if assert.Len(t, clinvarRcv, 2) {
			assert.Equal(t, "123456", clinvarRcv[0].ClinvarId)
			assert.Equal(t, "123457", clinvarRcv[1].ClinvarId)
			assert.Equal(t, types.JsonArray[string]{"Pathogenic"}, clinvarRcv[0].ClinicalSignificance)
			assert.Equal(t, types.JsonArray[string]{"Likely Pathogenic"}, clinvarRcv[1].ClinicalSignificance)
			assert.Equal(t, 1, clinvarRcv[0].SubmissionCount)
			assert.Equal(t, 3, clinvarRcv[1].SubmissionCount)
		}
	})
}

func Test_GetClinvarRCV_Empty(t *testing.T) {
	testutils.ParallelTestWithDb(t, "clinvar", func(t *testing.T, db *gorm.DB) {
		repo := NewClinvarRCVRepository(db)
		clinvarRcv, err := repo.GetVariantClinvarConditions(42)
		assert.NoError(t, err)
		assert.Len(t, clinvarRcv, 0)
	})
}
