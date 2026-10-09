package starrocks

import (
	"testing"

	_ "github.com/go-sql-driver/mysql"
	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func Test_IGVInternal_GetIGV(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewIGVRepository(database.StarrocksDB{DB: env.Starrocks})
		igvInternal, err := repo.GetIGV(t.Context(), 70)
		assert.NoError(t, err)
		// 6 alignment documents, 7 case file documents of the proband and 5 of the mother. The
		// family-level CNV annotation VCF (document 286) comes from no variant-calling task.
		assert.Len(t, igvInternal, 18)
		for _, track := range igvInternal {
			assert.NotEqual(t, "case70.annotated.cnv.vcf.gz", track.DocumentName)
		}
		assert.Equal(t, IGVTrack{
			SequencingExperimentId: 70,
			TaskId:                 71,
			SampleId:               "S13224",
			HistologyCode:          "normal",
			PatientId:              3,
			FamilyRole:             "proband",
			SexCode:                "male",
			DataTypeCode:           "alignment",
			FormatCode:             "crai",
			DocumentName:           "NA12892.recal.crai",
			URL:                    "s3://cqdg-prod-file-workspace/sarek/preprocessing/recalibrated/NA12892/NA12892.recal.crai",
		}, igvInternal[0])
		assert.Equal(t, IGVTrack{
			SequencingExperimentId: 70,
			TaskId:                 71,
			SampleId:               "S13224",
			HistologyCode:          "normal",
			PatientId:              3,
			FamilyRole:             "proband",
			SexCode:                "male",
			DataTypeCode:           "alignment",
			FormatCode:             "cram",
			DocumentName:           "NA12892.recal.cram",
			URL:                    "s3://cqdg-prod-file-workspace/sarek/preprocessing/recalibrated/NA12892/NA12892.recal.cram",
		}, igvInternal[1])
		assert.Equal(t, IGVTrack{
			SequencingExperimentId: 70,
			TaskId:                 71,
			SampleId:               "S13224",
			HistologyCode:          "normal",
			PatientId:              3,
			FamilyRole:             "proband",
			SexCode:                "male",
			DataTypeCode:           "gcnv",
			FormatCode:             "tbi",
			DocumentName:           "NA12892.cnv.vcf.gz.tbi",
			URL:                    "s3://cqdg-prod-file-workspace/dragen/NA12892/NA12892.cnv.vcf.gz.tbi",
		}, igvInternal[2])
	})
}

func Test_IGVInternal_GetIGV_FetusSample(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewIGVRepository(database.StarrocksDB{DB: env.Starrocks})
		igvInternal, err := repo.GetIGV(t.Context(), 72)
		assert.NoError(t, err)
		require.Len(t, igvInternal, 2)

		for _, track := range igvInternal {
			assert.Equal(t, 63, track.PatientId, "patient_id stays the mother — a sample is always physically drawn from her body")
			require.NotNil(t, track.FetusId, "fetus_id says whose genome the sample's sequencing represents")
			assert.Equal(t, 1, *track.FetusId)
			assert.Equal(t, "male", track.SexCode, "fetus 1's own sex, not the mother's")
			assert.Equal(t, "fetus", track.FamilyRole, "the sample's own family row, not the mother's proband row")
		}
	})
}

func Test_IGVInternal_GetIGV_SomaticCNVFromTumorOnlyTask(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewIGVRepository(database.StarrocksDB{DB: env.Starrocks})
		igvInternal, err := repo.GetIGV(t.Context(), 71)
		assert.NoError(t, err)

		var scnv []string
		for _, track := range igvInternal {
			if track.DataTypeCode == "scnv" {
				assert.Equal(t, 74, track.SequencingExperimentId)
				scnv = append(scnv, track.FormatCode)
			}
		}
		assert.Equal(t, []string{"tbi", "vcf"}, scnv)
	})
}

// Test_prepareIgvTracks_* exercise the shared prepareIgvTracks helper. They
// run through the germline entry point arbitrarily — the behaviour is
// identical for somatic since neither suffix nor isLeading is exercised by
// these corner cases.
func Test_prepareIgvTracks_handlesEmptyInputTracks(t *testing.T) {
	var internalTracks []IGVTrack

	result, err := PrepareGermlineIgvTracks(internalTracks, testutils.NewMockS3PreSigner())

	assert.NoError(t, err)
	assert.NotNil(t, result)
	assert.Empty(t, result.Alignment)
}

func Test_PrepareGermlineIgvTracks_mergesPairsAndOrdersProbandFirst(t *testing.T) {
	internalTracks := []IGVTrack{
		{PatientId: 1, SequencingExperimentId: 1, SampleId: "S0001", FamilyRole: "proband", SexCode: "male", DataTypeCode: "alignment", FormatCode: "cram", URL: "s3://example.com/file1.cram"},
		{PatientId: 1, SequencingExperimentId: 1, SampleId: "S0001", FamilyRole: "proband", SexCode: "male", DataTypeCode: "alignment", FormatCode: "crai", URL: "s3://example.com/file1.crai"},
		{PatientId: 2, SequencingExperimentId: 2, SampleId: "S0002", FamilyRole: "mother", SexCode: "female", DataTypeCode: "alignment", FormatCode: "cram", URL: "s3://example.com/file2.cram"},
		{PatientId: 2, SequencingExperimentId: 2, SampleId: "S0002", FamilyRole: "mother", SexCode: "female", DataTypeCode: "alignment", FormatCode: "crai", URL: "s3://example.com/file2.crai"},
		{PatientId: 3, SequencingExperimentId: 3, SampleId: "S0003", FamilyRole: "father", SexCode: "male", DataTypeCode: "alignment", FormatCode: "cram", URL: "s3://example.com/file3.cram"},
		{PatientId: 3, SequencingExperimentId: 3, SampleId: "S0003", FamilyRole: "father", SexCode: "male", DataTypeCode: "alignment", FormatCode: "crai", URL: "s3://example.com/file3.crai"},
	}
	result, err := PrepareGermlineIgvTracks(internalTracks, testutils.NewMockS3PreSigner())

	assert.NoError(t, err)
	assert.NotNil(t, result)
	assert.Len(t, result.Alignment, 3)
	assert.Equal(t, result.Alignment, []types.IGVTrackEnriched{
		{
			SequencingExperimentId: 1,
			PatientId:              1,
			FamilyRole:             "proband",
			Sex:                    "male",
			Type:                   "alignment",
			Format:                 "cram",
			URL:                    "presigned.s3://example.com/file1.cram",
			URLExpireAt:            1234567890,
			IndexURL:               "presigned.s3://example.com/file1.crai",
			IndexURLExpireAt:       1234567890,
			Name:                   "Reads: S0001 proband",
		},
		{
			SequencingExperimentId: 2,
			PatientId:              2,
			FamilyRole:             "mother",
			Sex:                    "female",
			Type:                   "alignment",
			Format:                 "cram",
			URL:                    "presigned.s3://example.com/file2.cram",
			URLExpireAt:            1234567890,
			IndexURL:               "presigned.s3://example.com/file2.crai",
			IndexURLExpireAt:       1234567890,
			Name:                   "Reads: S0002 mother",
		},
		{
			SequencingExperimentId: 3,
			PatientId:              3,
			FamilyRole:             "father",
			Sex:                    "male",
			Type:                   "alignment",
			Format:                 "cram",
			URL:                    "presigned.s3://example.com/file3.cram",
			URLExpireAt:            1234567890,
			IndexURL:               "presigned.s3://example.com/file3.crai",
			IndexURLExpireAt:       1234567890,
			Name:                   "Reads: S0003 father",
		},
	})
}

func Test_PrepareSomaticIgvTracks_mergesPairsAndOrdersTumorFirst(t *testing.T) {
	internalTracks := []IGVTrack{
		{PatientId: 1, SequencingExperimentId: 1, SampleId: "S0001", HistologyCode: "normal", SexCode: "male", DataTypeCode: "alignment", FormatCode: "cram", URL: "s3://example.com/normal.cram"},
		{PatientId: 1, SequencingExperimentId: 1, SampleId: "S0001", HistologyCode: "normal", SexCode: "male", DataTypeCode: "alignment", FormatCode: "crai", URL: "s3://example.com/normal.crai"},
		{PatientId: 1, SequencingExperimentId: 2, SampleId: "S0002", HistologyCode: "tumoral", SexCode: "male", DataTypeCode: "alignment", FormatCode: "cram", URL: "s3://example.com/tumor.cram"},
		{PatientId: 1, SequencingExperimentId: 2, SampleId: "S0002", HistologyCode: "tumoral", SexCode: "male", DataTypeCode: "alignment", FormatCode: "crai", URL: "s3://example.com/tumor.crai"},
	}
	result, err := PrepareSomaticIgvTracks(internalTracks, testutils.NewMockS3PreSigner())

	assert.NoError(t, err)
	assert.NotNil(t, result)
	assert.Len(t, result.Alignment, 2)
	assert.Equal(t, result.Alignment, []types.IGVTrackEnriched{
		{
			SequencingExperimentId: 2,
			PatientId:              1,
			Sex:                    "male",
			Type:                   "alignment",
			Format:                 "cram",
			URL:                    "presigned.s3://example.com/tumor.cram",
			URLExpireAt:            1234567890,
			IndexURL:               "presigned.s3://example.com/tumor.crai",
			IndexURLExpireAt:       1234567890,
			Name:                   "Reads: S0002 tumoral",
		},
		{
			SequencingExperimentId: 1,
			PatientId:              1,
			Sex:                    "male",
			Type:                   "alignment",
			Format:                 "cram",
			URL:                    "presigned.s3://example.com/normal.cram",
			URLExpireAt:            1234567890,
			IndexURL:               "presigned.s3://example.com/normal.crai",
			IndexURLExpireAt:       1234567890,
			Name:                   "Reads: S0001 normal",
		},
	})
}

func Test_prepareIgvTracks_enrichesTracksWithPreSignedURLs(t *testing.T) {
	internalTracks := []IGVTrack{
		{PatientId: 1, DataTypeCode: "alignment", FormatCode: "cram", URL: "s3://example.com/file1.cram"},
	}
	result, err := PrepareGermlineIgvTracks(internalTracks, testutils.NewMockS3PreSigner())

	assert.NoError(t, err)
	assert.NotNil(t, result)
	assert.Equal(t, "presigned.s3://example.com/file1.cram", result.Alignment[0].URL)
	assert.NotZero(t, result.Alignment[0].URLExpireAt)
}

func Test_prepareIgvTracks_threadsFetusId(t *testing.T) {
	fetusId := 1
	internalTracks := []IGVTrack{
		{PatientId: 63, FetusId: &fetusId, SequencingExperimentId: 1, SampleId: "S-PRENAT-72", FamilyRole: "fetus", SexCode: "male", DataTypeCode: "alignment", FormatCode: "cram", URL: "s3://example.com/fetus.cram"},
	}
	result, err := PrepareGermlineIgvTracks(internalTracks, testutils.NewMockS3PreSigner())

	assert.NoError(t, err)
	require.Len(t, result.Alignment, 1)
	assert.Equal(t, 63, result.Alignment[0].PatientId)
	require.NotNil(t, result.Alignment[0].FetusId)
	assert.Equal(t, fetusId, *result.Alignment[0].FetusId)
}

func Test_prepareIgvTracks_returnsErrorOnInvalidPreSignedURL(t *testing.T) {
	internalTracks := []IGVTrack{
		{PatientId: 1, DataTypeCode: "alignment", FormatCode: "cram", URL: "invalid-url"},
	}
	result, err := PrepareGermlineIgvTracks(internalTracks, testutils.NewMockS3PreSigner())

	assert.Error(t, err)
	assert.Nil(t, result)

	internalTracks = []IGVTrack{
		{PatientId: 1, DataTypeCode: "alignment", FormatCode: "cram", URL: "http://not-an-s3.url"},
	}
	result, err = PrepareGermlineIgvTracks(internalTracks, testutils.NewMockS3PreSigner())

	assert.Error(t, err)
	assert.Nil(t, result)
}

func Test_PrepareGermlineIgvTracks_caseFileTracksPerMember(t *testing.T) {
	proband := IGVTrack{PatientId: 1, SequencingExperimentId: 1, SampleId: "S0001", FamilyRole: "proband", SexCode: "male"}
	mother := IGVTrack{PatientId: 2, SequencingExperimentId: 2, SampleId: "S0002", FamilyRole: "mother", SexCode: "female"}
	doc := func(member IGVTrack, dataType, format, name string) IGVTrack {
		member.DataTypeCode, member.FormatCode, member.DocumentName, member.URL = dataType, format, name, "s3://example.com/"+name
		return member
	}
	internalTracks := []IGVTrack{
		doc(mother, "gcnv", "tbi", "S0002.cnv.vcf.gz.tbi"),
		doc(mother, "gcnv", "vcf", "S0002.cnv.vcf.gz"),
		doc(mother, "igv", "bw", "S0002.hard-filtered.baf.bw"),
		doc(mother, "igv", "bed", "S0002.roh.bed"),
		doc(mother, "igv", "bed", "S0002_targets.bed"),
		doc(proband, "gcnv", "vcf", "S0001.cnv.vcf.gz"),
		doc(proband, "gcnv", "tbi", "S0001.cnv.vcf.gz.tbi"),
		doc(proband, "igv", "bw", "S0001.seg.bw"),
		doc(proband, "igv", "bw", "S0001.baf.bw"),
		doc(proband, "igv", "bed", "S0001.roh.bed"),
		doc(proband, "igv", "bed", "S0001.HyperExomeV2_combined_targets.bed"),
	}

	result, err := PrepareGermlineIgvTracks(internalTracks, testutils.NewMockS3PreSigner())

	require.NoError(t, err)
	track := func(member IGVTrack, dataType, format, name, file, index string) types.IGVTrackEnriched {
		t := types.IGVTrackEnriched{
			SequencingExperimentId: member.SequencingExperimentId,
			PatientId:              member.PatientId,
			FamilyRole:             member.FamilyRole,
			Sex:                    member.SexCode,
			Type:                   dataType,
			Format:                 format,
			URL:                    "presigned.s3://example.com/" + file,
			URLExpireAt:            1234567890,
			Name:                   name,
		}
		if index != "" {
			t.IndexURL = "presigned.s3://example.com/" + index
			t.IndexURLExpireAt = 1234567890
		}
		return t
	}
	assert.Equal(t, &types.IGVTracks{
		CNV: []types.IGVTrackEnriched{
			track(proband, "gcnv", "vcf", "CNVs: S0001 proband", "S0001.cnv.vcf.gz", "S0001.cnv.vcf.gz.tbi"),
			track(mother, "gcnv", "vcf", "CNVs: S0002 mother", "S0002.cnv.vcf.gz", "S0002.cnv.vcf.gz.tbi"),
		},
		Seg: []types.IGVTrackEnriched{
			track(proband, "igv", "bw", "Seg: S0001 proband", "S0001.seg.bw", ""),
		},
		BAF: []types.IGVTrackEnriched{
			track(proband, "igv", "bw", "BAF: S0001 proband", "S0001.baf.bw", ""),
			track(mother, "igv", "bw", "BAF: S0002 mother", "S0002.hard-filtered.baf.bw", ""),
		},
		ROH: []types.IGVTrackEnriched{
			track(proband, "igv", "bed", "ROH: S0001 proband", "S0001.roh.bed", ""),
			track(mother, "igv", "bed", "ROH: S0002 mother", "S0002.roh.bed", ""),
		},
		CaptureTargets: []types.IGVTrackEnriched{
			track(proband, "igv", "bed", "Capture targets", "S0001.HyperExomeV2_combined_targets.bed", ""),
		},
	}, result)
}

func Test_PrepareSomaticIgvTracks_caseFileTracksTumorFirstAndTargetsFromTumor(t *testing.T) {
	internalTracks := []IGVTrack{
		{PatientId: 1, SequencingExperimentId: 1, SampleId: "S0001", HistologyCode: "normal", DataTypeCode: "igv", FormatCode: "bw", DocumentName: "S0001-N.seg.bw", URL: "s3://example.com/S0001-N.seg.bw"},
		{PatientId: 1, SequencingExperimentId: 1, SampleId: "S0001", HistologyCode: "normal", DataTypeCode: "igv", FormatCode: "bed", DocumentName: "S0001-N_targets.bed", URL: "s3://example.com/S0001-N_targets.bed"},
		{PatientId: 1, SequencingExperimentId: 2, SampleId: "S0002", HistologyCode: "tumoral", DataTypeCode: "scnv", FormatCode: "vcf", DocumentName: "S0002-T.cnv.vcf.gz", URL: "s3://example.com/S0002-T.cnv.vcf.gz"},
		{PatientId: 1, SequencingExperimentId: 2, SampleId: "S0002", HistologyCode: "tumoral", DataTypeCode: "igv", FormatCode: "bw", DocumentName: "S0002-T.seg.bw", URL: "s3://example.com/S0002-T.seg.bw"},
		{PatientId: 1, SequencingExperimentId: 2, SampleId: "S0002", HistologyCode: "tumoral", DataTypeCode: "igv", FormatCode: "bed", DocumentName: "S0002-T_targets.bed", URL: "s3://example.com/S0002-T_targets.bed"},
	}

	result, err := PrepareSomaticIgvTracks(internalTracks, testutils.NewMockS3PreSigner())

	require.NoError(t, err)
	require.Len(t, result.CNV, 1)
	assert.Equal(t, "CNVs: S0002 tumoral", result.CNV[0].Name)
	assert.Equal(t, "scnv", result.CNV[0].Type)
	require.Len(t, result.Seg, 2)
	assert.Equal(t, "Seg: S0002 tumoral", result.Seg[0].Name)
	assert.Equal(t, "Seg: S0001 normal", result.Seg[1].Name)
	require.Len(t, result.CaptureTargets, 1)
	assert.Equal(t, 2, result.CaptureTargets[0].SequencingExperimentId)
	assert.Equal(t, "presigned.s3://example.com/S0002-T_targets.bed", result.CaptureTargets[0].URL)
}

func Test_prepareIgvTracks_igvFileWithUnknownSuffixGivesNoTrack(t *testing.T) {
	internalTracks := []IGVTrack{
		{PatientId: 1, SequencingExperimentId: 1, SampleId: "S0001", FamilyRole: "proband", DataTypeCode: "igv", FormatCode: "bw", DocumentName: "S0001.coverage.bw", URL: "s3://example.com/S0001.coverage.bw"},
		{PatientId: 1, SequencingExperimentId: 1, SampleId: "S0001", FamilyRole: "proband", DataTypeCode: "igv", FormatCode: "bed", DocumentName: "S0001.regions.bed", URL: "s3://example.com/S0001.regions.bed"},
	}

	result, err := PrepareGermlineIgvTracks(internalTracks, testutils.NewMockS3PreSigner())

	require.NoError(t, err)
	assert.Equal(t, &types.IGVTracks{}, result)
}

func Test_prepareIgvTracks_igvSuffixWithWrongFormatGivesNoTrack(t *testing.T) {
	internalTracks := []IGVTrack{
		{PatientId: 1, SequencingExperimentId: 1, SampleId: "S0001", FamilyRole: "proband", DataTypeCode: "igv", FormatCode: "bed", DocumentName: "S0001.seg.bw", URL: "s3://example.com/S0001.seg.bw"},
		{PatientId: 1, SequencingExperimentId: 1, SampleId: "S0001", FamilyRole: "proband", DataTypeCode: "igv", FormatCode: "bw", DocumentName: "S0001.roh.bed", URL: "s3://example.com/S0001.roh.bed"},
	}

	result, err := PrepareGermlineIgvTracks(internalTracks, testutils.NewMockS3PreSigner())

	require.NoError(t, err)
	assert.Equal(t, &types.IGVTracks{}, result)
}

func Test_prepareIgvTracks_igvSuffixIsCaseInsensitive(t *testing.T) {
	internalTracks := []IGVTrack{
		{PatientId: 1, SequencingExperimentId: 1, SampleId: "S0001", FamilyRole: "proband", DataTypeCode: "igv", FormatCode: "bw", DocumentName: "S0001.SEG.BW", URL: "s3://example.com/S0001.SEG.BW"},
	}

	result, err := PrepareGermlineIgvTracks(internalTracks, testutils.NewMockS3PreSigner())

	require.NoError(t, err)
	require.Len(t, result.Seg, 1)
	assert.Equal(t, "Seg: S0001 proband", result.Seg[0].Name)
}

func Test_prepareIgvTracks_captureTargetsKeepsLowestProbandSequencing(t *testing.T) {
	internalTracks := []IGVTrack{
		{PatientId: 1, SequencingExperimentId: 9, SampleId: "S0009", FamilyRole: "proband", DataTypeCode: "igv", FormatCode: "bed", DocumentName: "S0009_targets.bed", URL: "s3://example.com/S0009_targets.bed"},
		{PatientId: 1, SequencingExperimentId: 4, SampleId: "S0004", FamilyRole: "proband", DataTypeCode: "igv", FormatCode: "bed", DocumentName: "S0004_targets.bed", URL: "s3://example.com/S0004_targets.bed"},
	}

	result, err := PrepareGermlineIgvTracks(internalTracks, testutils.NewMockS3PreSigner())

	require.NoError(t, err)
	require.Len(t, result.CaptureTargets, 1)
	assert.Equal(t, 4, result.CaptureTargets[0].SequencingExperimentId)
}

func Test_prepareIgvTracks_noCaptureTargetsWithoutProbandFile(t *testing.T) {
	internalTracks := []IGVTrack{
		{PatientId: 2, SequencingExperimentId: 2, SampleId: "S0002", FamilyRole: "mother", DataTypeCode: "igv", FormatCode: "bed", DocumentName: "S0002_targets.bed", URL: "s3://example.com/S0002_targets.bed"},
	}

	result, err := PrepareGermlineIgvTracks(internalTracks, testutils.NewMockS3PreSigner())

	require.NoError(t, err)
	assert.Empty(t, result.CaptureTargets)
}

func Test_HasIgvTracks_emptyIsFalse(t *testing.T) {
	assert.False(t, HasIgvTracks(nil))
}

func Test_HasIgvTracks_alignmentIsTrue(t *testing.T) {
	assert.True(t, HasIgvTracks([]IGVTrack{{DataTypeCode: "alignment", FormatCode: "crai"}}))
}

func Test_HasIgvTracks_cnvOnlyIsTrue(t *testing.T) {
	assert.True(t, HasIgvTracks([]IGVTrack{{DataTypeCode: "scnv", FormatCode: "vcf"}}))
}

func Test_HasIgvTracks_knownIgvSuffixIsTrue(t *testing.T) {
	assert.True(t, HasIgvTracks([]IGVTrack{{DataTypeCode: "igv", FormatCode: "bed", DocumentName: "S1.roh.bed"}}))
}

func Test_HasIgvTracks_unknownIgvSuffixIsFalse(t *testing.T) {
	assert.False(t, HasIgvTracks([]IGVTrack{{DataTypeCode: "igv", FormatCode: "bw", DocumentName: "S1.coverage.bw"}}))
}

func Test_HasIgvTracks_captureTargetsAloneIsFalse(t *testing.T) {
	assert.False(t, HasIgvTracks([]IGVTrack{{DataTypeCode: "igv", FormatCode: "bed", DocumentName: "S1_targets.bed"}}))
}

func Test_prepareIgvTracks_rerunPairsDataAndIndexOfLatestTask(t *testing.T) {
	proband := IGVTrack{PatientId: 1, SequencingExperimentId: 1, SampleId: "S0001", FamilyRole: "proband"}
	doc := func(taskId int, dataType, format, file string) IGVTrack {
		r := proband
		r.TaskId, r.DataTypeCode, r.FormatCode, r.DocumentName, r.URL = taskId, dataType, format, file, "s3://example.com/"+file
		return r
	}
	internalTracks := []IGVTrack{
		doc(5, "alignment", "crai", "run1.cram.crai"),
		doc(9, "alignment", "crai", "run2.cram.crai"),
		doc(5, "alignment", "cram", "run1.cram"),
		doc(9, "alignment", "cram", "run2.cram"),
		doc(9, "gcnv", "tbi", "run2.cnv.vcf.gz.tbi"),
		doc(5, "gcnv", "tbi", "run1.cnv.vcf.gz.tbi"),
		doc(5, "gcnv", "vcf", "run1.cnv.vcf.gz"),
		doc(9, "gcnv", "vcf", "run2.cnv.vcf.gz"),
	}

	result, err := PrepareGermlineIgvTracks(internalTracks, testutils.NewMockS3PreSigner())

	require.NoError(t, err)
	require.Len(t, result.Alignment, 1)
	assert.Equal(t, "presigned.s3://example.com/run2.cram", result.Alignment[0].URL)
	assert.Equal(t, "presigned.s3://example.com/run2.cram.crai", result.Alignment[0].IndexURL)
	require.Len(t, result.CNV, 1)
	assert.Equal(t, "presigned.s3://example.com/run2.cnv.vcf.gz", result.CNV[0].URL)
	assert.Equal(t, "presigned.s3://example.com/run2.cnv.vcf.gz.tbi", result.CNV[0].IndexURL)
}

func Test_prepareIgvTracks_latestTaskIsPerTrackKind(t *testing.T) {
	internalTracks := []IGVTrack{
		{PatientId: 1, SequencingExperimentId: 1, TaskId: 5, SampleId: "S0001", FamilyRole: "proband", DataTypeCode: "alignment", FormatCode: "cram", URL: "s3://example.com/S0001.cram"},
		{PatientId: 1, SequencingExperimentId: 1, TaskId: 9, SampleId: "S0001", FamilyRole: "proband", DataTypeCode: "igv", FormatCode: "bw", DocumentName: "S0001.seg.bw", URL: "s3://example.com/S0001.seg.bw"},
	}

	result, err := PrepareGermlineIgvTracks(internalTracks, testutils.NewMockS3PreSigner())

	require.NoError(t, err)
	assert.Len(t, result.Alignment, 1)
	assert.Len(t, result.Seg, 1)
}

func Test_prepareIgvTracks_rerunWithoutIndexKeepsOlderCompletePair(t *testing.T) {
	proband := IGVTrack{PatientId: 1, SequencingExperimentId: 1, SampleId: "S0001", FamilyRole: "proband"}
	doc := func(taskId int, dataType, format, file string) IGVTrack {
		r := proband
		r.TaskId, r.DataTypeCode, r.FormatCode, r.DocumentName, r.URL = taskId, dataType, format, file, "s3://example.com/"+file
		return r
	}
	internalTracks := []IGVTrack{
		doc(5, "gcnv", "vcf", "run1.cnv.vcf.gz"),
		doc(5, "gcnv", "tbi", "run1.cnv.vcf.gz.tbi"),
		doc(9, "gcnv", "vcf", "run2.cnv.vcf.gz"),
		doc(5, "alignment", "cram", "run1.cram"),
		doc(5, "alignment", "crai", "run1.cram.crai"),
		doc(9, "alignment", "crai", "run2.cram.crai"),
	}

	result, err := PrepareGermlineIgvTracks(internalTracks, testutils.NewMockS3PreSigner())

	require.NoError(t, err)
	require.Len(t, result.CNV, 1)
	assert.Equal(t, "presigned.s3://example.com/run1.cnv.vcf.gz", result.CNV[0].URL)
	assert.Equal(t, "presigned.s3://example.com/run1.cnv.vcf.gz.tbi", result.CNV[0].IndexURL)
	require.Len(t, result.Alignment, 1)
	assert.Equal(t, "presigned.s3://example.com/run1.cram", result.Alignment[0].URL)
	assert.Equal(t, "presigned.s3://example.com/run1.cram.crai", result.Alignment[0].IndexURL)
}

func Test_prepareIgvTracks_noCompleteTaskKeepsLatest(t *testing.T) {
	internalTracks := []IGVTrack{
		{PatientId: 1, SequencingExperimentId: 1, TaskId: 5, SampleId: "S0001", FamilyRole: "proband", DataTypeCode: "gcnv", FormatCode: "vcf", URL: "s3://example.com/run1.cnv.vcf.gz"},
		{PatientId: 1, SequencingExperimentId: 1, TaskId: 9, SampleId: "S0001", FamilyRole: "proband", DataTypeCode: "gcnv", FormatCode: "vcf", URL: "s3://example.com/run2.cnv.vcf.gz"},
	}

	result, err := PrepareGermlineIgvTracks(internalTracks, testutils.NewMockS3PreSigner())

	require.NoError(t, err)
	require.Len(t, result.CNV, 1)
	assert.Equal(t, "presigned.s3://example.com/run2.cnv.vcf.gz", result.CNV[0].URL)
	assert.Empty(t, result.CNV[0].IndexURL)
}

func Test_prepareIgvTracks_unindexedKindsNeedOnlyTheDataFile(t *testing.T) {
	internalTracks := []IGVTrack{
		{PatientId: 1, SequencingExperimentId: 1, TaskId: 5, SampleId: "S0001", FamilyRole: "proband", DataTypeCode: "igv", FormatCode: "bw", DocumentName: "run1.seg.bw", URL: "s3://example.com/run1.seg.bw"},
		{PatientId: 1, SequencingExperimentId: 1, TaskId: 9, SampleId: "S0001", FamilyRole: "proband", DataTypeCode: "igv", FormatCode: "bw", DocumentName: "run2.seg.bw", URL: "s3://example.com/run2.seg.bw"},
	}

	result, err := PrepareGermlineIgvTracks(internalTracks, testutils.NewMockS3PreSigner())

	require.NoError(t, err)
	require.Len(t, result.Seg, 1)
	assert.Equal(t, "presigned.s3://example.com/run2.seg.bw", result.Seg[0].URL)
}
