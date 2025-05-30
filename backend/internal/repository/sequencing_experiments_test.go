package repository

import (
	"testing"

	"github.com/Ferlab-Ste-Justine/radiant-api/test/testutils"
	_ "github.com/go-sql-driver/mysql"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

func Test_GetSequencing(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewSequencingExperimentsRepository(db)
		sequencing, err := repo.GetSequencing(1)
		assert.NoError(t, err)
		assert.Equal(t, 1, sequencing.SeqId)
		assert.Equal(t, "germline", sequencing.AnalysisType)
	})
}

func Test_GetSequencingNotFound(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewSequencingExperimentsRepository(db)
		sequencing, err := repo.GetSequencing(11)
		assert.NoError(t, err)
		assert.Nil(t, sequencing)
	})
}
