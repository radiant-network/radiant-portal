package repository

import (
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
	"testing"
)

func Test_GetVariantGenePanelConditions(t *testing.T) {
	testutils.ParallelTestWithDb(t, "gene_panels", func(t *testing.T, db *gorm.DB) {
		repo := NewGenePanelsRepository(db)
		genesPanels, err := repo.GetVariantGenePanelConditions(types.OmimGenePanelTable, 1000)
		assert.NoError(t, err)
		value, ok := (*genesPanels)["BRAF"]
		assert.True(t, ok)
		assert.Len(t, value, 2)
	})
}
