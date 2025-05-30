package repository

import (
	"testing"

	"github.com/Ferlab-Ste-Justine/radiant-api/test/testutils"
	_ "github.com/go-sql-driver/mysql"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

func Test_GetVariantHeader(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewVariantsRepository(db)
		variantHeader, err := repo.GetVariantHeader(1000)
		assert.NoError(t, err)
		assert.Equal(t, "hgvsg1", variantHeader.Hgvsg)
		assert.Equal(t, "GRCh38", variantHeader.AssemblyVersion)
		assert.Equal(t, 1, len(variantHeader.Source))
	})
}

func Test_GetVariantOverview(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewVariantsRepository(db)
		variantOverview, err := repo.GetVariantOverview(1000)
		assert.NoError(t, err)
		assert.Equal(t, "locus1", variantOverview.Locus)
		assert.Equal(t, float32(0.1), variantOverview.SiftScore)
		assert.Equal(t, "T", variantOverview.SiftPred)
		assert.Equal(t, 2, len(variantOverview.OmimConditions))
	})
}

func Test_GetVariantConsequences(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewVariantsRepository(db)
		variantConsequences, err := repo.GetVariantConsequences(1000)
		assert.NoError(t, err)
		assert.Equal(t, 2, len(*variantConsequences))
		assert.Equal(t, true, (*variantConsequences)[0].IsPicked)
		assert.Equal(t, false, (*variantConsequences)[1].IsPicked)
	})
}
