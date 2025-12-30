package repository

import (
	"testing"

	_ "github.com/go-sql-driver/mysql"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

func Test_GetSequencingExperimentDetailById(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewSequencingExperimentRepository(db)
		sequencingExperiment, err := repo.GetSequencingExperimentDetailById(1)
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

func Test_GetSequencingExperimentBySampleID(t *testing.T) {
	testutils.ParallelTestWithPostgres(t, func(t *testing.T, db *gorm.DB) {
		repo := NewSequencingExperimentRepository(db)
		seqExps, err := repo.GetSequencingExperimentBySampleID(1)
		assert.NoError(t, err)
		assert.Len(t, seqExps, 2)
		assert.Equal(t, 1, seqExps[0].ID)
		assert.Equal(t, "NA12892", seqExps[0].Aliquot)
		assert.Equal(t, 70, seqExps[1].ID)
		assert.Equal(t, "NA12892", seqExps[1].Aliquot)
	})
}

func Test_GetSequencingExperimentBySampleIDtNotFound(t *testing.T) {
	testutils.ParallelTestWithPostgres(t, func(t *testing.T, db *gorm.DB) {
		repo := NewSequencingExperimentRepository(db)
		sequencing, err := repo.GetSequencingExperimentBySampleID(-42)
		assert.NoError(t, err)
		assert.Empty(t, sequencing)
	})
}

func Test_GetSequencingExperimentByAliquot(t *testing.T) {
	testutils.ParallelTestWithPostgres(t, func(t *testing.T, db *gorm.DB) {
		repo := NewSequencingExperimentRepository(db)
		seqExps, err := repo.GetSequencingExperimentByAliquot("NA12892")
		assert.NoError(t, err)
		assert.Len(t, seqExps, 2)
		assert.Equal(t, 1, seqExps[0].ID)
		assert.Equal(t, 70, seqExps[1].ID)
	})
}

func Test_GetSequencingExperimentByAliquotNotFound(t *testing.T) {
	testutils.ParallelTestWithPostgres(t, func(t *testing.T, db *gorm.DB) {
		repo := NewSequencingExperimentRepository(db)
		sequencing, err := repo.GetSequencingExperimentByAliquot("FOOBAR")
		assert.NoError(t, err)
		assert.Empty(t, sequencing)
	})
}

func Test_GetSequencingExperimentByAliquotAndSubmitterSample(t *testing.T) {
	testutils.ParallelTestWithPostgres(t, func(t *testing.T, db *gorm.DB) {
		repo := NewSequencingExperimentRepository(db)

		organizationCode := "CQGC"
		aliquot := "NA12892"
		submitterSampleId := "S13224"

		expected := SequencingExperiment{
			ID:                           1,
			SampleID:                     1,
			Aliquot:                      aliquot,
			PlatformCode:                 "illumina",
			StatusCode:                   "completed",
			ExperimentalStrategyCode:     "wgs",
			SequencingReadTechnologyCode: "short_read",
			CaptureKit:                   "SureSelect Custom DNA Target",
			SequencingLabID:              6,
			RunName:                      "1617",
			RunAlias:                     "A00516_0169",
		}

		seqExp, err := repo.GetSequencingExperimentByAliquotAndSubmitterSample(aliquot, submitterSampleId, organizationCode)
		assert.NoError(t, err)
		assert.Equal(t, seqExp.ID, expected.ID)
		assert.Equal(t, seqExp.Aliquot, expected.Aliquot)
		assert.Equal(t, seqExp.PlatformCode, expected.PlatformCode)
		assert.Equal(t, seqExp.StatusCode, expected.StatusCode)
		assert.Equal(t, seqExp.ExperimentalStrategyCode, expected.ExperimentalStrategyCode)
		assert.Equal(t, seqExp.SequencingReadTechnologyCode, expected.SequencingReadTechnologyCode)
		assert.Equal(t, seqExp.CaptureKit, expected.CaptureKit)
		assert.Equal(t, seqExp.SequencingLabID, expected.SequencingLabID)
		assert.Equal(t, seqExp.RunName, expected.RunName)
		assert.Equal(t, seqExp.RunAlias, expected.RunAlias)
	})
}

func Test_GetSequencingExperimentByAliquotAndSubmitterSampleNotFound(t *testing.T) {
	testutils.ParallelTestWithPostgres(t, func(t *testing.T, db *gorm.DB) {
		repo := NewSequencingExperimentRepository(db)

		organizationCode := "CHUSJ"
		aliquot := "NA12892"
		submitterSampleId := "S13224"

		seqExp, err := repo.GetSequencingExperimentByAliquotAndSubmitterSample(aliquot, submitterSampleId, organizationCode)
		assert.NoError(t, err)
		assert.Nil(t, seqExp)
	})
}
