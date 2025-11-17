package repository

import (
	"testing"

	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

func Test_GetAssayBySeqId(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewAssaysRepository(db)
		assay, err := repo.GetAssayBySeqId(1)
		assert.NoError(t, err)
		assert.Equal(t, "completed", assay.StatusCode)
		assert.Equal(t, "2021-09-12 13:08:00 +0000 UTC", assay.CreatedOn.String())
		assert.Equal(t, "2021-09-12 13:08:00 +0000 UTC", assay.UpdatedOn.String())
		assert.Equal(t, "CQGC", assay.SequencingLabCode)
		assert.Equal(t, "Quebec Clinical Genomic Center", assay.SequencingLabName)
		assert.Equal(t, "NA12892", assay.Aliquot)
		assert.Equal(t, "1617", assay.RunName)
		assert.Equal(t, "A00516_0169", assay.RunAlias)
		assert.Equal(t, "2021-08-17 00:00:00 +0000 UTC", assay.RunDate.String())
		assert.Equal(t, 1, assay.SeqID)
		assert.Equal(t, "wgs", assay.ExperimentalStrategyCode)
		assert.Equal(t, "Whole Genome Sequencing", assay.ExperimentalStrategyName)
		assert.Equal(t, "illumina", assay.PlatformCode)
		assert.Equal(t, "SureSelect Custom DNA Target", assay.CaptureKit)
		assert.Equal(t, "short_read", assay.SequencingReadTechnologyCode)
		assert.Equal(t, "Short Read", assay.SequencingReadTechnologyName)
		assert.Equal(t, 1, assay.SampleID)
		assert.Equal(t, "dna", assay.SampleTypeCode)
		assert.Equal(t, "", assay.TissueSite)
		assert.Equal(t, "normal", assay.HistologyCode)
		assert.Equal(t, "S13224", assay.SubmitterSampleID)
	})
}
