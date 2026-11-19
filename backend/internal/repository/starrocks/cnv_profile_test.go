package starrocks

import (
	"testing"

	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/repository/postgres"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func Test_GetCNVProfileDocuments_ListsIgvFilesOfTheSequencing(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewCNVProfileRepository(database.StarrocksDB{DB: env.Starrocks})
		documents, err := repo.GetCNVProfileDocuments(t.Context(), 70, 71)
		require.NoError(t, err)
		// The family-level CNV annotation task also writes case70.roh.bed: it is left out.
		assert.Equal(t, []types.CNVProfileDocument{
			{TaskID: 71, DocumentName: "NA12892.HyperExomeV2_combined_targets.bed", FormatCode: "bed", URL: "s3://cqdg-prod-file-workspace/dragen/NA12892/NA12892.HyperExomeV2_combined_targets.bed"},
			{TaskID: 71, DocumentName: "NA12892.coverage.bw", FormatCode: "bw", URL: "s3://cqdg-prod-file-workspace/dragen/NA12892/NA12892.coverage.bw"},
			{TaskID: 71, DocumentName: "NA12892.hard-filtered.baf.bw", FormatCode: "bw", URL: "s3://cqdg-prod-file-workspace/dragen/NA12892/NA12892.hard-filtered.baf.bw"},
			{TaskID: 71, DocumentName: "NA12892.roh.bed", FormatCode: "bed", URL: "s3://cqdg-prod-file-workspace/dragen/NA12892/NA12892.roh.bed"},
			{TaskID: 71, DocumentName: "NA12892.seg.bw", FormatCode: "bw", URL: "s3://cqdg-prod-file-workspace/dragen/NA12892/NA12892.seg.bw"},
			{TaskID: 71, DocumentName: "NA12892.tn.bw", FormatCode: "bw", URL: "s3://cqdg-prod-file-workspace/dragen/NA12892/NA12892.tn.bw"},
		}, documents)
	})
}

func Test_GetCNVProfileDocuments_NoIgvFiles(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewCNVProfileRepository(database.StarrocksDB{DB: env.Starrocks})
		documents, err := repo.GetCNVProfileDocuments(t.Context(), 1, 1)
		require.NoError(t, err)
		assert.Empty(t, documents)
	})
}

func Test_GetCNVProfileDocuments_AnnotationTask_FilesOfTheCallingTaskOfItsInputs(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewCNVProfileRepository(database.StarrocksDB{DB: env.Starrocks})
		// Task 86 annotates the CNVs of task 71: it reads its NA12892.cnv.vcf.gz.
		documents, err := repo.GetCNVProfileDocuments(t.Context(), 70, 86)
		require.NoError(t, err)
		require.NotEmpty(t, documents)
		for _, d := range documents {
			assert.Equal(t, 71, d.TaskID)
		}
		assert.Contains(t, documents, types.CNVProfileDocument{TaskID: 71, DocumentName: "NA12892.tn.bw", FormatCode: "bw", URL: "s3://cqdg-prod-file-workspace/dragen/NA12892/NA12892.tn.bw"})
	})
}

func Test_GetCNVProfileDocuments_TaskWithoutLink_LatestCallingTaskOfTheSequencing(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewCNVProfileRepository(database.StarrocksDB{DB: env.Starrocks})
		// Task 70 calls the variants of another sequencing and reads nothing of sequencing 70.
		documents, err := repo.GetCNVProfileDocuments(t.Context(), 70, 70)
		require.NoError(t, err)
		require.NotEmpty(t, documents)
		for _, d := range documents {
			assert.Equal(t, 71, d.TaskID)
		}
	})
}

func Test_CNVProfileCallingTask_TheTaskItselfWhenItCallsTheVariants(t *testing.T) {
	documents := []types.CNVProfileDocument{{TaskID: 10}, {TaskID: 20}}
	got, ok := cnvProfileCallingTask(documents, 10, []int{20})
	assert.True(t, ok)
	assert.Equal(t, 10, got)
}

func Test_CNVProfileCallingTask_TheProducerOfItsInputsOverTheLatest(t *testing.T) {
	documents := []types.CNVProfileDocument{{TaskID: 10}, {TaskID: 20}}
	got, ok := cnvProfileCallingTask(documents, 30, []int{10, 99})
	assert.True(t, ok)
	assert.Equal(t, 10, got)
}

func Test_CNVProfileCallingTask_TheLatestWithoutProducer(t *testing.T) {
	documents := []types.CNVProfileDocument{{TaskID: 10}, {TaskID: 20}}
	got, ok := cnvProfileCallingTask(documents, 30, nil)
	assert.True(t, ok)
	assert.Equal(t, 20, got)
}

func Test_CNVProfileCallingTask_NoCallingTask(t *testing.T) {
	_, ok := cnvProfileCallingTask(nil, 30, []int{10})
	assert.False(t, ok)
}

func Test_GetExperimentalStrategy_OfTheSequencing(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewCNVProfileRepository(database.StarrocksDB{DB: env.Starrocks})
		strategy, err := repo.GetExperimentalStrategy(t.Context(), 1, 1, 1)
		require.NoError(t, err)
		assert.Equal(t, "wgs", strategy)
	})
}

func Test_GetExperimentalStrategy_NotFound(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewCNVProfileRepository(database.StarrocksDB{DB: env.Starrocks})
		for name, ids := range map[string][3]int{
			"unknown sequencing":                {1, 999_999, 1},
			"sequencing of another case":        {2, 1, 1},
			"task that did not analyse the seq": {1, 1, 2},
		} {
			strategy, err := repo.GetExperimentalStrategy(t.Context(), ids[0], ids[1], ids[2])
			require.NoError(t, err, name)
			assert.Empty(t, strategy, name)
		}
	})
}

func Test_SelectCNVProfileFiles_PicksEachTrack(t *testing.T) {
	documents := []types.CNVProfileDocument{
		{TaskID: 71, DocumentName: "S1.seg.bw", FormatCode: "bw"},
		{TaskID: 71, DocumentName: "S1.tn.bw", FormatCode: "bw"},
		{TaskID: 71, DocumentName: "S1.hard-filtered.baf.bw", FormatCode: "bw"},
		{TaskID: 71, DocumentName: "S1.ROH.bed", FormatCode: "bed"},
		{TaskID: 71, DocumentName: "S1_targets.bed", FormatCode: "bed"},
	}
	files := SelectCNVProfileFiles(documents)
	assert.Equal(t, &documents[1], files.CopyRatio)
	assert.Equal(t, &documents[2], files.BAF)
	assert.Equal(t, &documents[3], files.ROH)
}

func Test_SelectCNVProfileFiles_WrongFormatIsIgnored(t *testing.T) {
	files := SelectCNVProfileFiles([]types.CNVProfileDocument{{TaskID: 71, DocumentName: "S1.tn.bw", FormatCode: "bed"}})
	assert.Equal(t, CNVProfileFiles{}, files)
}

func Test_GetCNVProfileSegments_ListsCNVsOfTheTask(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewCNVProfileRepository(database.StarrocksDB{DB: env.Starrocks})
		segments, err := repo.GetCNVProfileSegments(t.Context(), 1, 1, 1)
		require.NoError(t, err)
		quality, cn, sm := float32(0.995), 2, float32(0.95)
		assert.Equal(t, []types.CNVProfileSegment{
			{CnvID: "1", Chromosome: "1", Start: 10000, End: 10500, Type: "DEL", Length: 500, Quality: &quality, Filter: "PASS", CN: &cn, SM: &sm},
		}, segments)
	})
}

func Test_GetCNVProfileSegments_OtherTask(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewCNVProfileRepository(database.StarrocksDB{DB: env.Starrocks})
		segments, err := repo.GetCNVProfileSegments(t.Context(), 1, 1, 2)
		require.NoError(t, err)
		assert.Empty(t, segments)
	})
}

func Test_GetCytobands(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewCNVProfileRepository(database.StarrocksDB{DB: env.Starrocks})
		cytobands, err := repo.GetCytobands(t.Context())
		require.NoError(t, err)
		assert.Equal(t, []types.Cytoband{
			{Chromosome: "1", Cytoband: "p1.1", Start: 10000, End: 10200, GieStain: "gneg"},
			{Chromosome: "1", Cytoband: "p1.2", Start: 10500, End: 10800, GieStain: "gpos25"},
		}, cytobands)
	})
}

func Test_GetCNVProfileSegments_CarriesTheNoteAndFlagOfEachCNV(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "multiple", Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewCNVProfileRepository(database.StarrocksDB{DB: env.Starrocks})
		notesRepo := postgres.NewOccurrenceNotesRepository(database.PostgresDB{DB: env.Postgres})
		flagsRepo := postgres.NewOccurrenceFlagsRepository(database.PostgresDB{DB: env.Postgres})
		_, err := notesRepo.Create(t.Context(), types.OccurrenceNote{
			CaseID: 2, SeqID: 1, TaskID: 1, OccurrenceID: "1",
			UserID: "11111111-1111-1111-1111-111111111111", UserName: "Test User", TenantCode: types.DefaultTenantCode, Content: "Test note",
		})
		require.NoError(t, err)
		_, err = flagsRepo.Upsert(t.Context(), types.OccurrenceFlag{
			CaseID: 2, SeqID: 1, TaskID: 1, OccurrenceID: "1", FlagType: types.OccurrenceFlagTypePin, TenantCode: types.DefaultTenantCode,
		})
		require.NoError(t, err)

		segments, err := repo.GetCNVProfileSegments(t.Context(), 2, 1, 1)
		require.NoError(t, err)
		require.Len(t, segments, 2)
		byID := map[string]types.CNVProfileSegment{}
		for _, segment := range segments {
			byID[segment.CnvID] = segment
		}
		assert.True(t, byID["1"].HasNote)
		assert.Equal(t, types.OccurrenceFlagTypePin, byID["1"].FlagType)
		assert.False(t, byID["2"].HasNote)
		assert.Empty(t, byID["2"].FlagType)
	})
}
