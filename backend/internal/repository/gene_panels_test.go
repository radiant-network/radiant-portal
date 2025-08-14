package repository

import (
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
	"testing"
)

func Test_GetVariantGenePanelConditions_Omim(t *testing.T) {
	testutils.ParallelTestWithDb(t, "gene_panels", func(t *testing.T, db *gorm.DB) {
		repo := NewGenePanelsRepository(db)
		result, err := repo.GetVariantGenePanelConditions("omim", 1000, "")
		assert.NoError(t, err)
		value, ok := ((*result).Conditions)["BRAF"]
		assert.True(t, ok)
		assert.Len(t, value, 2)
		assert.Equal(t, int64(2), result.CountOmim)
		assert.Equal(t, int64(2), result.CountOrphanet)
		assert.Equal(t, int64(3), result.CountHpo)
	})
}

func Test_GetVariantGenePanelConditions_Omim_WithFilter(t *testing.T) {
	testutils.ParallelTestWithDb(t, "gene_panels", func(t *testing.T, db *gorm.DB) {
		repo := NewGenePanelsRepository(db)
		result, err := repo.GetVariantGenePanelConditions("omim", 1000, "2")
		assert.NoError(t, err)
		value, ok := ((*result).Conditions)["BRAF"]
		assert.True(t, ok)
		assert.Len(t, value, 1)
		assert.Equal(t, int64(1), result.CountOmim)
		assert.Equal(t, int64(1), result.CountOrphanet)
		assert.Equal(t, int64(0), result.CountHpo)
	})
}

func Test_GetVariantGenePanelConditions_Hpo(t *testing.T) {
	testutils.ParallelTestWithDb(t, "gene_panels", func(t *testing.T, db *gorm.DB) {
		repo := NewGenePanelsRepository(db)
		result, err := repo.GetVariantGenePanelConditions("hpo", 1000, "")
		assert.NoError(t, err)
		value, ok := ((*result).Conditions)["BRAF"]
		assert.True(t, ok)
		assert.Len(t, value, 3)
		assert.Equal(t, int64(2), result.CountOmim)
		assert.Equal(t, int64(2), result.CountOrphanet)
		assert.Equal(t, int64(3), result.CountHpo)
	})
}

func Test_GetVariantGenePanelConditions_Hpo_WithFilter(t *testing.T) {
	testutils.ParallelTestWithDb(t, "gene_panels", func(t *testing.T, db *gorm.DB) {
		repo := NewGenePanelsRepository(db)
		result, err := repo.GetVariantGenePanelConditions("hpo", 1000, "Canthus")
		assert.NoError(t, err)
		value, ok := ((*result).Conditions)["BRAF"]
		assert.True(t, ok)
		assert.Len(t, value, 1)
		assert.Equal(t, int64(0), result.CountOmim)
		assert.Equal(t, int64(0), result.CountOrphanet)
		assert.Equal(t, int64(1), result.CountHpo)
	})
}

func Test_GetVariantGenePanelConditions_Orphanet(t *testing.T) {
	testutils.ParallelTestWithDb(t, "gene_panels", func(t *testing.T, db *gorm.DB) {
		repo := NewGenePanelsRepository(db)
		result, err := repo.GetVariantGenePanelConditions("orphanet", 1000, "")
		assert.NoError(t, err)
		value, ok := ((*result).Conditions)["BRAF"]
		assert.True(t, ok)
		assert.Len(t, value, 2)
		assert.Equal(t, int64(2), result.CountOmim)
		assert.Equal(t, int64(2), result.CountOrphanet)
		assert.Equal(t, int64(3), result.CountHpo)
	})
}

func Test_GetVariantGenePanelConditions_Orphanet_WithFilter(t *testing.T) {
	testutils.ParallelTestWithDb(t, "gene_panels", func(t *testing.T, db *gorm.DB) {
		repo := NewGenePanelsRepository(db)
		result, err := repo.GetVariantGenePanelConditions("orphanet", 1000, "1")
		assert.NoError(t, err)
		value, ok := ((*result).Conditions)["BRAF"]
		assert.True(t, ok)
		assert.Len(t, value, 1)
		assert.Equal(t, int64(1), result.CountOmim)
		assert.Equal(t, int64(1), result.CountOrphanet)
		assert.Equal(t, int64(0), result.CountHpo)
	})
}

func Test_GetVariantGenePanelConditions_InvalidTable(t *testing.T) {
	testutils.ParallelTestWithDb(t, "gene_panels", func(t *testing.T, db *gorm.DB) {
		repo := NewGenePanelsRepository(db)
		result, err := repo.GetVariantGenePanelConditions("invalid_table", 1000, "")
		assert.Error(t, err)
		assert.Nil(t, result)
	})
}
