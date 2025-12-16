package repository

import (
	"testing"

	_ "github.com/go-sql-driver/mysql"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

// func (m *MockS3PreSigner) GeneratePreSignedURL(url string) (*utils.PreSignedURL, error) {
// 	return &utils.PreSignedURL{
// 		URL:         "presigned." + url,
// 		URLExpireAt: 1234567890,
// 	}, nil
// }

func Test_IGVInternal_GetIGV(t *testing.T) {
	testutils.ParallelTestWithPostgresAndStarrocks(t, "simple", func(t *testing.T, starrocks *gorm.DB, postgres *gorm.DB) {
		repo := NewIGVRepository(starrocks)
		igvInternal, err := repo.GetIGV(70)
		assert.NoError(t, err)
		assert.Len(t, igvInternal, 6)
		assert.Equal(t, IGVTrack{
			SequencingExperimentId: 70,
			SampleId:               "S13224",
			PatientId:              3,
			FamilyRole:             "proband",
			SexCode:                "male",
			DataTypeCode:           "alignment",
			FormatCode:             "crai",
			URL:                    "s3://cqdg-prod-file-workspace/sarek/preprocessing/recalibrated/NA12892/NA12892.recal.crai",
		}, igvInternal[0])
		assert.Equal(t, IGVTrack{
			SequencingExperimentId: 70,
			SampleId:               "S13224",
			PatientId:              3,
			FamilyRole:             "proband",
			SexCode:                "male",
			DataTypeCode:           "alignment",
			FormatCode:             "cram",
			URL:                    "s3://cqdg-prod-file-workspace/sarek/preprocessing/recalibrated/NA12892/NA12892.recal.cram",
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

func Test_IGV_PrepareTracks_groupsTracksByDataTypeAndPatientId(t *testing.T) {
	internalTracks := []IGVTrack{
		{PatientId: 1, SampleId: "S0001", FamilyRole: "proband", SexCode: "male", DataTypeCode: "alignment", FormatCode: "cram", URL: "s3://example.com/file1.cram"},
		{PatientId: 1, SampleId: "S0001", FamilyRole: "proband", SexCode: "male", DataTypeCode: "alignment", FormatCode: "crai", URL: "s3://example.com/file1.crai"},
		{PatientId: 2, SampleId: "S0002", FamilyRole: "mother", SexCode: "female", DataTypeCode: "alignment", FormatCode: "cram", URL: "s3://example.com/file2.cram"},
		{PatientId: 2, SampleId: "S0002", FamilyRole: "mother", SexCode: "female", DataTypeCode: "alignment", FormatCode: "crai", URL: "s3://example.com/file2.crai"},
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

func Test_IGV_PrepareTracks_enrichesTracksWithPreSignedURLs(t *testing.T) {
	internalTracks := []IGVTrack{
		{PatientId: 1, DataTypeCode: "alignment", FormatCode: "cram", URL: "s3://example.com/file1.cram"},
	}
	result, err := PrepareIgvTracks(internalTracks, testutils.NewMockS3PreSigner())

	assert.NoError(t, err)
	assert.NotNil(t, result)
	assert.Equal(t, "presigned.s3://example.com/file1.cram", result.Alignment[0].URL)
	assert.NotZero(t, result.Alignment[0].URLExpireAt)
}

func Test_IGV_PrepareTracks_returnsErrorOnInvalidPreSignedURL(t *testing.T) {
	internalTracks := []IGVTrack{
		{PatientId: 1, DataTypeCode: "alignment", FormatCode: "cram", URL: "invalid-url"},
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
