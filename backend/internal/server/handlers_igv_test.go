package server

import (
	"bytes"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/repository"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/internal/utils"
	"github.com/stretchr/testify/assert"
)

type MockS3PreSigner struct{}

func GetMockedPreSigner() *MockS3PreSigner {
	return &MockS3PreSigner{}
}

func (m *MockS3PreSigner) GenerateS3PreSignedURL(url string) (*utils.PreSignedURL, error) {
	return &utils.PreSignedURL{
		URL:         "presigned." + url,
		URLExpireAt: 1234567890,
	}, nil
}

func (r *MockRepository) GetIGV(seqId int) ([]types.IGVTrack, error) {
	return []types.IGVTrack{{
		SequencingExperimentId: 1,
		SampleId:               "sample_123",
		PatientId:              1,
		FamilyRole:             "proband",
		SexCode:                "male",
		DataTypeCode:           "alignment",
		FormatCode:             "cram",
		URL:                    "s3://example.com/file.cram",
	}, {
		SequencingExperimentId: 1,
		SampleId:               "sample_123",
		PatientId:              1,
		FamilyRole:             "proband",
		SexCode:                "male",
		DataTypeCode:           "alignment",
		FormatCode:             "crai",
		URL:                    "s3://example.com/file.crai",
	}}, nil
}

func Test_IGVGetHandler(t *testing.T) {
	repo := &MockRepository{}
	router := gin.Default()
	router.GET("/igv/:seq_id", GetIGVHandler(repo, &MockS3PreSigner{}))

	req, _ := http.NewRequest("GET", "/igv/1", bytes.NewBuffer([]byte("{}")))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `{"alignment":[{"patient_id":1,"family_role":"proband","sex":"male","type":"alignment","format":"cram","url":"presigned.s3://example.com/file.cram","urlExpireAt":1234567890,"indexURL":"presigned.s3://example.com/file.crai","indexURLExpireAt":1234567890,"name":"Reads: sample_123 proband"}]}`, w.Body.String())
}

func Test_IGV_prepareTracks_handlesEmptyInputTracks(t *testing.T) {
	var internalTracks []repository.IGVTrack

	result, err := prepareIgvTracks(internalTracks, &MockS3PreSigner{})

	assert.NoError(t, err)
	assert.NotNil(t, result)
	assert.Empty(t, result.Alignment)
}

func Test_IGV_prepareTracks_groupsTracksByDataTypeAndPatientId(t *testing.T) {
	internalTracks := []repository.IGVTrack{
		{PatientId: 1, SampleId: "S0001", FamilyRole: "proband", SexCode: "male", DataTypeCode: "alignment", FormatCode: "cram", URL: "s3://example.com/file1.cram"},
		{PatientId: 1, SampleId: "S0001", FamilyRole: "proband", SexCode: "male", DataTypeCode: "alignment", FormatCode: "crai", URL: "s3://example.com/file1.crai"},
		{PatientId: 2, SampleId: "S0002", FamilyRole: "mother", SexCode: "female", DataTypeCode: "alignment", FormatCode: "cram", URL: "s3://example.com/file2.cram"},
		{PatientId: 2, SampleId: "S0002", FamilyRole: "mother", SexCode: "female", DataTypeCode: "alignment", FormatCode: "crai", URL: "s3://example.com/file2.crai"},
	}
	result, err := prepareIgvTracks(internalTracks, &MockS3PreSigner{})

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

func Test_IGV_prepareTracks_enrichesTracksWithPreSignedURLs(t *testing.T) {
	internalTracks := []repository.IGVTrack{
		{PatientId: 1, DataTypeCode: "alignment", FormatCode: "cram", URL: "http://example.com/file1.cram"},
	}
	result, err := prepareIgvTracks(internalTracks, &MockS3PreSigner{})

	assert.NoError(t, err)
	assert.NotNil(t, result)
	assert.Equal(t, "presigned.http://example.com/file1.cram", result.Alignment[0].URL)
	assert.NotZero(t, result.Alignment[0].URLExpireAt)
}

func Test_IGV_prepareTracks_returnsErrorOnInvalidPreSignedURL(t *testing.T) {
	internalTracks := []repository.IGVTrack{
		{PatientId: 1, DataTypeCode: "alignment", FormatCode: "cram", URL: "invalid-url"},
	}
	result, err := prepareIgvTracks(internalTracks, &utils.DefaultS3PreSigner{})

	assert.Error(t, err)
	assert.Nil(t, result)

	internalTracks = []repository.IGVTrack{
		{PatientId: 1, DataTypeCode: "alignment", FormatCode: "cram", URL: "http://not-an-s3.url"},
	}
	result, err = prepareIgvTracks(internalTracks, &utils.DefaultS3PreSigner{})

	assert.Error(t, err)
	assert.Nil(t, result)
}
