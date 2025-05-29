package repository

import (
	"testing"

	"github.com/Ferlab-Ste-Justine/radiant-api/internal/types"
	"github.com/Ferlab-Ste-Justine/radiant-api/test/testutils"
	_ "github.com/go-sql-driver/mysql"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

func Test_GetTermAutoComplete(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewTermsRepository(db)
		terms, err := repo.GetTermAutoComplete(types.MondoTable.Name, "blood", 20)
		assert.NoError(t, err)
		assert.Equal(t, 2, len(terms))
		assert.Equal(t, "MONDO:0000001", terms[0].Source.ID)
		assert.Equal(t, "blood group incompatibility", terms[0].Source.Name)
		assert.Equal(t, "MONDO:0000001", terms[0].HighLight.ID)
		assert.Equal(t, "<strong>blood</strong> group incompatibility", terms[0].HighLight.Name)
		assert.Equal(t, "MONDO:0000002", terms[1].Source.ID)
	})
}

func Test_GetTermAutoCompleteWithLimit(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewTermsRepository(db)
		terms, err := repo.GetTermAutoComplete(types.MondoTable.Name, "blood", 1)
		assert.NoError(t, err)
		assert.Equal(t, 1, len(terms))
		assert.Equal(t, "MONDO:0000001", terms[0].Source.ID)
		assert.Equal(t, "blood group incompatibility", terms[0].Source.Name)
		assert.Equal(t, "MONDO:0000001", terms[0].HighLight.ID)
		assert.Equal(t, "<strong>blood</strong> group incompatibility", terms[0].HighLight.Name)
	})
}

func Test_GetTermAutoCompleteNoResult(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewTermsRepository(db)
		terms, err := repo.GetTermAutoComplete(types.MondoTable.Name, "not_here", 20)
		assert.NoError(t, err)
		assert.Equal(t, 0, len(terms))
	})
}
