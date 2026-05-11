package repository

import (
	"testing"

	_ "github.com/go-sql-driver/mysql"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

func Test_IGVInternal_GetIGV(t *testing.T) {
	testutils.ParallelTestWithStarrocks(t, "simple", func(t *testing.T, starrocks *gorm.DB) {
		repo := NewIGVRepository(starrocks)
		igvInternal, err := repo.GetIGV(70)
		assert.NoError(t, err)
		assert.Len(t, igvInternal, 6)
		assert.Equal(t, IGVTrack{
			SequencingExperimentId: 70,
			SampleId:               "S13224",
			HistologyCode:          "normal",
			PatientId:              3,
			FamilyRole:             "proband",
			SexCode:                "male",
			DataTypeCode:           "alignment",
			FormatCode:             "crai",
			URL:                    "s3://cqdg-prod-file-workspace/sarek/preprocessing/recalibrated/NA12892/NA12892.recal.crai",
			CaseTypeCode:		    "germline",
		}, igvInternal[0])
		assert.Equal(t, IGVTrack{
			SequencingExperimentId: 70,
			SampleId:               "S13224",
			HistologyCode:          "normal",
			PatientId:              3,
			FamilyRole:             "proband",
			SexCode:                "male",
			DataTypeCode:           "alignment",
			FormatCode:             "cram",
			URL:                    "s3://cqdg-prod-file-workspace/sarek/preprocessing/recalibrated/NA12892/NA12892.recal.cram",
			CaseTypeCode:		    "germline",
		}, igvInternal[1])
	})
}

func Test_IGV_PrepareTracks_handlesEmptyInputTracks(t *testing.T) {
	var internalTracks []IGVTrack

	result, err := PrepareIgvTracks(internalTracks, testutils.NewMockS3PreSigner())

	assert.NoError(t, err)
	assert.NotNil(t, result)
	assert.Empty(t, result.Alignment)
}

func Test_IGV_PrepareTracks_germlineMergesPairsAndOrdersProbandFirst(t *testing.T) {
	internalTracks := []IGVTrack{
		{PatientId: 1, SequencingExperimentId: 1,SampleId: "S0001", FamilyRole: "proband", SexCode: "male", DataTypeCode: "alignment", FormatCode: "cram", URL: "s3://example.com/file1.cram", CaseTypeCode: "germline"},
		{PatientId: 1, SequencingExperimentId: 1, SampleId: "S0001", FamilyRole: "proband", SexCode: "male", DataTypeCode: "alignment", FormatCode: "crai", URL: "s3://example.com/file1.crai", CaseTypeCode: "germline"},
		{PatientId: 2, SequencingExperimentId: 2, SampleId: "S0002", FamilyRole: "mother", SexCode: "female", DataTypeCode: "alignment", FormatCode: "cram", URL: "s3://example.com/file2.cram", CaseTypeCode: "germline"},
		{PatientId: 2, SequencingExperimentId: 2, SampleId: "S0002", FamilyRole: "mother", SexCode: "female", DataTypeCode: "alignment", FormatCode: "crai", URL: "s3://example.com/file2.crai", CaseTypeCode: "germline"},
	}
	result, err := PrepareIgvTracks(internalTracks, testutils.NewMockS3PreSigner())

	assert.NoError(t, err)
	assert.NotNil(t, result)
	assert.Len(t, result.Alignment, 2)
	assert.Equal(t, result.Alignment, []types.IGVTrackEnriched{
		{
			PatientId:        1,
			FamilyRole:       "proband",
			Sex:              "male",
			Type:             "alignment",
			Format:           "cram",
			URL:              "presigned.s3://example.com/file1.cram",
			URLExpireAt:      1234567890,
			IndexURL:         "presigned.s3://example.com/file1.crai",
			IndexURLExpireAt: 1234567890,
			Name:             "Reads: S0001 proband",
		},
		{
			PatientId:        2,
			FamilyRole:       "mother",
			Sex:              "female",
			Type:             "alignment",
			Format:           "cram",
			URL:              "presigned.s3://example.com/file2.cram",
			URLExpireAt:      1234567890,
			IndexURL:         "presigned.s3://example.com/file2.crai",
			IndexURLExpireAt: 1234567890,
			Name:             "Reads: S0002 mother",
		},
	})
}

func Test_IGV_PrepareTracks_somaticMergesPairsAndOrdersTumorFirst(t *testing.T) {
	internalTracks := []IGVTrack{
		{PatientId: 1, SequencingExperimentId: 1, SampleId: "S0001", HistologyCode: "normal", SexCode: "male", DataTypeCode: "alignment", FormatCode: "cram", URL: "s3://example.com/normal.cram", CaseTypeCode: "somatic"},
		{PatientId: 1, SequencingExperimentId: 1, SampleId: "S0001", HistologyCode: "normal", SexCode: "male", DataTypeCode: "alignment", FormatCode: "crai", URL: "s3://example.com/normal.crai", CaseTypeCode: "somatic"},
		{PatientId: 1, SequencingExperimentId: 2, SampleId: "S0002", HistologyCode: "tumoral", SexCode: "male", DataTypeCode: "alignment", FormatCode: "cram", URL: "s3://example.com/tumor.cram", CaseTypeCode: "somatic"},
		{PatientId: 1, SequencingExperimentId: 2, SampleId: "S0002", HistologyCode: "tumoral", SexCode: "male", DataTypeCode: "alignment", FormatCode: "crai", URL: "s3://example.com/tumor.crai", CaseTypeCode: "somatic"},
	}
	result, err := PrepareIgvTracks(internalTracks, testutils.NewMockS3PreSigner())

	assert.NoError(t, err)
	assert.NotNil(t, result)
	assert.Len(t, result.Alignment, 2)
	assert.Equal(t, result.Alignment, []types.IGVTrackEnriched{
		{
			PatientId:        1,
			Sex:              "male",
			Type:             "alignment",
			Format:           "cram",
			URL:              "presigned.s3://example.com/tumor.cram",
			URLExpireAt:      1234567890,
			IndexURL:         "presigned.s3://example.com/tumor.crai",
			IndexURLExpireAt: 1234567890,
			Name:             "Reads: S0002 Tumor",
		},
		{
			PatientId:        1,
			Sex:              "male",
			Type:             "alignment",
			Format:           "cram",
			URL:              "presigned.s3://example.com/normal.cram",
			URLExpireAt:      1234567890,
			IndexURL:         "presigned.s3://example.com/normal.crai",
			IndexURLExpireAt: 1234567890,
			Name:             "Reads: S0001 Normal",
		},
	})
}

func Test_IGV_PrepareTracks_enrichesTracksWithPreSignedURLs(t *testing.T) {
	internalTracks := []IGVTrack{
		{PatientId: 1, DataTypeCode: "alignment", FormatCode: "cram", URL: "s3://example.com/file1.cram", CaseTypeCode: "germline"},
	}
	result, err := PrepareIgvTracks(internalTracks, testutils.NewMockS3PreSigner())

	assert.NoError(t, err)
	assert.NotNil(t, result)
	assert.Equal(t, "presigned.s3://example.com/file1.cram", result.Alignment[0].URL)
	assert.NotZero(t, result.Alignment[0].URLExpireAt)
}

func Test_IGV_PrepareTracks_returnsErrorOnInvalidPreSignedURL(t *testing.T) {
	internalTracks := []IGVTrack{
		{PatientId: 1, DataTypeCode: "alignment", FormatCode: "cram", URL: "invalid-url", CaseTypeCode: "germline"},
	}
	result, err := PrepareIgvTracks(internalTracks, testutils.NewMockS3PreSigner())

	assert.Error(t, err)
	assert.Nil(t, result)

	internalTracks = []IGVTrack{
		{PatientId: 1, DataTypeCode: "alignment", FormatCode: "cram", URL: "http://not-an-s3.url"},
	}
	result, err = PrepareIgvTracks(internalTracks, testutils.NewMockS3PreSigner())

	assert.Error(t, err)
	assert.Nil(t, result)
}
