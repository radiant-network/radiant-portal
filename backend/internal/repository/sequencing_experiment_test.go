package repository

import (
	"testing"

	_ "github.com/go-sql-driver/mysql"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"gorm.io/gorm"
)

func Test_GetSequencingExperimentDetailById(t *testing.T) {
	testutils.ParallelTestWithStarrocks(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewSequencingExperimentRepository(db)
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

func Test_GetSequencingExperimentBySampleID(t *testing.T) {
	testutils.ParallelTestWithPostgres(t, func(t *testing.T, db *gorm.DB) {
		repo := NewSequencingExperimentRepository(db)
		seqExps, err := repo.GetSequencingExperimentBySampleID(t.Context(), 1)
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
		sequencing, err := repo.GetSequencingExperimentBySampleID(t.Context(), -42)
		assert.NoError(t, err)
		assert.Empty(t, sequencing)
	})
}

func Test_GetSequencingExperimentByAliquot(t *testing.T) {
	testutils.ParallelTestWithPostgres(t, func(t *testing.T, db *gorm.DB) {
		repo := NewSequencingExperimentRepository(db)
		seqExps, err := repo.GetSequencingExperimentByAliquot(t.Context(), "NA12892")
		assert.NoError(t, err)
		assert.Len(t, seqExps, 2)
		assert.Equal(t, 1, seqExps[0].ID)
		assert.Equal(t, 70, seqExps[1].ID)
	})
}

func Test_GetSequencingExperimentByAliquotNotFound(t *testing.T) {
	testutils.ParallelTestWithPostgres(t, func(t *testing.T, db *gorm.DB) {
		repo := NewSequencingExperimentRepository(db)
		sequencing, err := repo.GetSequencingExperimentByAliquot(t.Context(), "FOOBAR")
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
			SequencingLabCode:            "CQGC",
			TenantCode:                   types.DefaultTenantCode,
			RunName:                      "1617",
			RunAlias:                     "A00516_0169",
		}

		seqExp, err := repo.GetSequencingExperimentByAliquotAndSubmitterSample(t.Context(), aliquot, submitterSampleId, organizationCode)
		assert.NoError(t, err)
		assert.Equal(t, seqExp.ID, expected.ID)
		assert.Equal(t, seqExp.Aliquot, expected.Aliquot)
		assert.Equal(t, seqExp.PlatformCode, expected.PlatformCode)
		assert.Equal(t, seqExp.StatusCode, expected.StatusCode)
		assert.Equal(t, seqExp.ExperimentalStrategyCode, expected.ExperimentalStrategyCode)
		assert.Equal(t, seqExp.SequencingReadTechnologyCode, expected.SequencingReadTechnologyCode)
		assert.Equal(t, seqExp.CaptureKit, expected.CaptureKit)
		assert.Equal(t, seqExp.SequencingLabCode, expected.SequencingLabCode)
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

		seqExp, err := repo.GetSequencingExperimentByAliquotAndSubmitterSample(t.Context(), aliquot, submitterSampleId, organizationCode)
		assert.NoError(t, err)
		assert.Nil(t, seqExp)
	})
}

func Test_UpdateSequencingExperiment_ExistingRow(t *testing.T) {
	// ExclusivePostgres: inserts directly into "sample"/"sequencing_experiment" (id >= 1000),
	// tables other parallel WritePostgres tests may bulk-clean concurrently — see
	// setup_postgres.go cleanUp.
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		db := env.Postgres
		repo := NewSequencingExperimentRepository(db)

		require.NoError(t, db.Exec(`
			INSERT INTO sample (id, type_code, tissue_site, histology_code, submitter_sample_id, patient_id, organization_code, tenant_code)
			VALUES (1001, 'blood', NULL, 'normal', 'S-SEQ-UPDATE-1', 1, 'CQGC', 'radiant')
		`).Error)
		require.NoError(t, db.Exec(`
			INSERT INTO sequencing_experiment (id, sample_id, status_code, aliquot, sequencing_lab_code, tenant_code, experimental_strategy_code, sequencing_read_technology_code, platform_code, created_on, updated_on)
			VALUES (1001, 1001, 'submitted', 'ALIQUOT-UPDATE-1', 'CQGC', 'radiant', 'wgs', 'short_read', 'illumina', now(), now())
		`).Error)

		updated := &SequencingExperiment{
			SampleID:                     1001,
			Aliquot:                      "ALIQUOT-UPDATE-1",
			StatusCode:                   "completed",
			SequencingLabCode:            "CHUSJ",
			ExperimentalStrategyCode:     "wxs",
			SequencingReadTechnologyCode: "long_read",
			PlatformCode:                 "pacbio",
			RunName:                      "RUN-1",
			RunAlias:                     "RUN-ALIAS-1",
			CaptureKit:                   "CPT-1",
		}
		require.NoError(t, repo.UpdateSequencingExperiment(t.Context(), updated))

		seqExp, err := repo.GetSequencingExperimentByAliquotAndSubmitterSample(t.Context(), "ALIQUOT-UPDATE-1", "S-SEQ-UPDATE-1", "CQGC")
		require.NoError(t, err)
		require.NotNil(t, seqExp)
		assert.Equal(t, "completed", seqExp.StatusCode)
		assert.Equal(t, "CHUSJ", seqExp.SequencingLabCode)
		assert.Equal(t, "wxs", seqExp.ExperimentalStrategyCode)
		assert.Equal(t, "long_read", seqExp.SequencingReadTechnologyCode)
		assert.Equal(t, "pacbio", seqExp.PlatformCode)
		assert.Equal(t, "RUN-1", seqExp.RunName)
		assert.Equal(t, "RUN-ALIAS-1", seqExp.RunAlias)
		assert.Equal(t, "CPT-1", seqExp.CaptureKit)
	})
}

func Test_UpdateSequencingExperiment_NotFound(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewSequencingExperimentRepository(env.Postgres)

		err := repo.UpdateSequencingExperiment(t.Context(), &SequencingExperiment{
			SampleID: 999999,
			Aliquot:  "ALIQUOT-DOES-NOT-EXIST",
		})
		assert.NoError(t, err)
	})
}
