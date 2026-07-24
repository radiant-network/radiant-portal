package starrocks

import (
	"testing"

	_ "github.com/go-sql-driver/mysql"
	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

func Test_GetSequencingExperimentDetailById(t *testing.T) {
	testutils.ParallelTestWithStarrocks(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewSequencingExperimentRepository(database.StarrocksDB{DB: db})
		sequencingExperiment, err := repo.GetSequencingExperimentDetailById(t.Context(), 1)
		assert.NoError(t, err)
		assert.Equal(t, "completed", sequencingExperiment.StatusCode)
		assert.Equal(t, "2021-09-12 13:08:00 +0000 UTC", sequencingExperiment.CreatedOn.String())
		assert.Equal(t, "2021-09-12 13:08:00 +0000 UTC", sequencingExperiment.UpdatedOn.String())
		assert.Equal(t, "CQGC", sequencingExperiment.SequencingLabCode)
		assert.Equal(t, "Quebec Clinical Genomic Center", sequencingExperiment.SequencingLabName)
		assert.Equal(t, "NA12892", sequencingExperiment.Aliquot)
		assert.Equal(t, "1617", sequencingExperiment.RunName)
		assert.Equal(t, "A00516_0169", sequencingExperiment.RunAlias)
		assert.Equal(t, "2021-08-17 00:00:00 +0000 UTC", sequencingExperiment.RunDate.String())
		assert.Equal(t, 1, sequencingExperiment.SeqID)
		assert.Equal(t, "wgs", sequencingExperiment.ExperimentalStrategyCode)
		assert.Equal(t, "Whole Genome Sequencing", sequencingExperiment.ExperimentalStrategyName)
		assert.Equal(t, "illumina", sequencingExperiment.PlatformCode)
		assert.Equal(t, "SureSelect Custom DNA Target", sequencingExperiment.CaptureKit)
		assert.Equal(t, "short_read", sequencingExperiment.SequencingReadTechnologyCode)
		assert.Equal(t, "Short Read", sequencingExperiment.SequencingReadTechnologyName)
		assert.Equal(t, 1, sequencingExperiment.SampleID)
		assert.Equal(t, "dna", sequencingExperiment.SampleTypeCode)
		assert.Equal(t, "", sequencingExperiment.TissueSite)
		assert.Equal(t, "normal", sequencingExperiment.HistologyCode)
		assert.Equal(t, "S13224", sequencingExperiment.SubmitterSampleID)
		assert.Equal(t, 3, sequencingExperiment.PatientID)
	})
}
