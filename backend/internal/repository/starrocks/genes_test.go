package starrocks

import (
	"testing"

	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

func Test_GetGeneAutoComplete(t *testing.T) {
	testutils.ParallelTestWithStarrocks(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewGenesRepository(database.StarrocksDB{DB: db})
		genes, err := repo.GetGeneAutoComplete(t.Context(), "F", 10)
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
	testutils.ParallelTestWithStarrocks(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewGenesRepository(database.StarrocksDB{DB: db})
		genes, err := repo.GetGeneAutoComplete(t.Context(), "ENSG000000004", 10)
		assert.NoError(t, err)
		assert.Equal(t, 3, len(*genes))
		assert.Equal(t, "ENSG00000000419", (*genes)[0].Source.ID)
		assert.Equal(t, "ENSG00000000460", (*genes)[1].Source.ID)
		assert.Equal(t, "ENSG00000000457", (*genes)[2].Source.ID)
	})
}

func Test_GetGeneAutoComplete_FindOnNameFirst(t *testing.T) {
	testutils.ParallelTestWithStarrocks(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewGenesRepository(database.StarrocksDB{DB: db})
		genes, err := repo.GetGeneAutoComplete(t.Context(), "ENS", 10)
		assert.NoError(t, err)
		assert.Equal(t, 10, len(*genes))
		assert.Equal(t, "ENSA", (*genes)[0].Source.Name)
		assert.Equal(t, "BRAF", (*genes)[1].Source.Name)
		assert.Equal(t, "ENSG00000157764", (*genes)[1].Source.ID)
	})
}

func Test_GetGeneAutoComplete_FindOnAlias(t *testing.T) {
	testutils.ParallelTestWithStarrocks(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewGenesRepository(database.StarrocksDB{DB: db})
		genes, err := repo.GetGeneAutoComplete(t.Context(), "HF", 10)
		assert.NoError(t, err)
		assert.Equal(t, 1, len(*genes))
		assert.Equal(t, "CFH", (*genes)[0].Source.Name)
	})
}

func Test_GetGeneAutoComplete_FindOnAliasNotFirst(t *testing.T) {
	testutils.ParallelTestWithStarrocks(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewGenesRepository(database.StarrocksDB{DB: db})
		// "ARMS1" is not the first element of CFH's alias array (["ARMD4","ARMS1",...]),
		// so this exercises the ||-delimiter boundary of the collapsed-string match.
		genes, err := repo.GetGeneAutoComplete(t.Context(), "ARMS1", 10)
		assert.NoError(t, err)
		assert.Equal(t, 1, len(*genes))
		assert.Equal(t, "CFH", (*genes)[0].Source.Name)
	})
}

func Test_GetGeneAutoComplete_WithLimit(t *testing.T) {
	testutils.ParallelTestWithStarrocks(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewGenesRepository(database.StarrocksDB{DB: db})
		genes, err := repo.GetGeneAutoComplete(t.Context(), "F", 1)
		assert.NoError(t, err)
		assert.Equal(t, 1, len(*genes))
		assert.Equal(t, "ENSG00000000938", (*genes)[0].Source.ID)
		assert.Equal(t, "FGR", (*genes)[0].Source.Name)
		assert.Equal(t, "ENSG00000000938", (*genes)[0].HighLight.ID)
		assert.Equal(t, "<strong>F</strong>GR", (*genes)[0].HighLight.Name)
	})
}

func Test_GetGeneAutoComplete_NoResult(t *testing.T) {
	testutils.ParallelTestWithStarrocks(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewGenesRepository(database.StarrocksDB{DB: db})
		genes, err := repo.GetGeneAutoComplete(t.Context(), "not_here", 20)
		assert.NoError(t, err)
		assert.Equal(t, 0, len(*genes))
	})
}

func Test_SearchGenes(t *testing.T) {
	testutils.ParallelTestWithStarrocks(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewGenesRepository(database.StarrocksDB{DB: db})
		genes, err := repo.SearchGenes(t.Context(), []string{"ENSG00000000003", "TNMD", "ensg00000157764", "ensa", "ENSG000000011671111", "BAD_SYMBOL"})
		assert.NoError(t, err)
		assert.Equal(t, 4, len(*genes))
		assert.Equal(t, "BRAF", (*genes)[0].Name)
		assert.Equal(t, "ENSA", (*genes)[1].Name)
		assert.Equal(t, "TNMD", (*genes)[2].Name)
		assert.Equal(t, "TSPAN6", (*genes)[3].Name)
	})
}

func Test_SearchGenes_NoResult(t *testing.T) {
	testutils.ParallelTestWithStarrocks(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewGenesRepository(database.StarrocksDB{DB: db})
		genes, err := repo.SearchGenes(t.Context(), []string{"ENSG000000011671111", "BAD_SYMBOL"})
		assert.NoError(t, err)
		assert.Equal(t, 0, len(*genes))
	})
}

func Test_SearchGenes_NoInput(t *testing.T) {
	testutils.ParallelTestWithStarrocks(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewGenesRepository(database.StarrocksDB{DB: db})
		genes, err := repo.SearchGenes(t.Context(), []string{})
		assert.NoError(t, err)
		assert.Equal(t, 0, len(*genes))
	})
}
