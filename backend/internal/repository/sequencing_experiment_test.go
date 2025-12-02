package repository

import (
	"testing"

	_ "github.com/go-sql-driver/mysql"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

func Test_GetSequencingExperiment(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewSequencingExperimentRepo(db)
		seqExps, err := repo.GetSequencingExperimentBySampleID(1)
		assert.NoError(t, err)
		assert.Len(t, seqExps, 2)
		assert.Equal(t, 1, seqExps[0].ID)
		assert.Equal(t, "NA12892", seqExps[0].Aliquot)
		assert.Equal(t, 70, seqExps[1].ID)
		assert.Equal(t, "NA12892", seqExps[1].Aliquot)
	})
}

func Test_GetSequencingExperimentNotFound(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewSequencingExperimentRepo(db)
		sequencing, err := repo.GetSequencingExperimentBySampleID(-42)
		assert.NoError(t, err)
		assert.Empty(t, sequencing)
	})
}
