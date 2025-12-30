package repository

import (
	"testing"

	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

func Test_GetGeneAutoComplete(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewGenesRepository(db)
		genes, err := repo.GetGeneAutoComplete("F", 10)
		assert.NoError(t, err)
		assert.Equal(t, 4, len(*genes))
		assert.Equal(t, "ENSG00000000938", (*genes)[0].Source.ID)
		assert.Equal(t, "FGR", (*genes)[0].Source.Name)
		assert.Equal(t, "ENSG00000000938", (*genes)[0].HighLight.ID)
		assert.Equal(t, "<strong>F</strong>GR", (*genes)[0].HighLight.Name)
		assert.Equal(t, "ENSG00000000460", (*genes)[1].Source.ID)
		assert.Equal(t, "ENSG00000001036", (*genes)[2].Source.ID)
		assert.Equal(t, "ENSG00000000971", (*genes)[3].Source.ID)
	})
}

func Test_GetGeneAutoComplete_FindOnGeneId(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewGenesRepository(db)
		genes, err := repo.GetGeneAutoComplete("ENSG000000004", 10)
		assert.NoError(t, err)
		assert.Equal(t, 3, len(*genes))
		assert.Equal(t, "ENSG00000000419", (*genes)[0].Source.ID)
		assert.Equal(t, "ENSG00000000460", (*genes)[1].Source.ID)
		assert.Equal(t, "ENSG00000000457", (*genes)[2].Source.ID)
	})
}

func Test_GetGeneAutoComplete_FindOnNameFirst(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewGenesRepository(db)
		genes, err := repo.GetGeneAutoComplete("ENS", 10)
		assert.NoError(t, err)
		assert.Equal(t, 10, len(*genes))
		assert.Equal(t, "ENSA", (*genes)[0].Source.Name)
		assert.Equal(t, "BRAF", (*genes)[1].Source.Name)
		assert.Equal(t, "ENSG00000157764", (*genes)[1].Source.ID)
	})
}

func Test_GetGeneAutoComplete_FindOnAlias(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewGenesRepository(db)
		genes, err := repo.GetGeneAutoComplete("HF", 10)
		assert.NoError(t, err)
		assert.Equal(t, 1, len(*genes))
		assert.Equal(t, "CFH", (*genes)[0].Source.Name)
	})
}

func Test_GetGeneAutoComplete_WithLimit(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewGenesRepository(db)
		genes, err := repo.GetGeneAutoComplete("F", 1)
		assert.NoError(t, err)
		assert.Equal(t, 1, len(*genes))
		assert.Equal(t, "ENSG00000000938", (*genes)[0].Source.ID)
		assert.Equal(t, "FGR", (*genes)[0].Source.Name)
		assert.Equal(t, "ENSG00000000938", (*genes)[0].HighLight.ID)
		assert.Equal(t, "<strong>F</strong>GR", (*genes)[0].HighLight.Name)
	})
}

func Test_GetGeneAutoComplete_NoResult(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewGenesRepository(db)
		genes, err := repo.GetGeneAutoComplete("not_here", 20)
		assert.NoError(t, err)
		assert.Equal(t, 0, len(*genes))
	})
}
