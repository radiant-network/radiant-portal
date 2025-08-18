package types

import (
	"bytes"
	"encoding/json"
	"testing"

	"github.com/stretchr/testify/assert"
)

func Test_IGVTrack_ToJSON(t *testing.T) {
	t.Parallel()

	var igvInternal = IGVTrack{
		SequencingExperimentId: 0,
		SampleId:               "sample_123",
		PatientId:              123,
		FamilyRole:             "proband",
		SexCode:                "male",
		DataTypeCode:           "alignment",
		FormatCode:             "cram",
		URL:                    "s3://foo/bar/file.cram",
	}

	var expected = []byte(`{"sequencing_experiment_id":0,"sample_id":"sample_123","patient_id":123,"family_role":"proband","sexcode":"male","datatype_code":"alignment","format_code":"cram","url":"s3://foo/bar/file.cram"}`)
	jsonData, err := json.Marshal(igvInternal)
	assert.Nil(t, err, "Failed to marshal IGVTrack to JSON")

	var is_equal = bytes.Equal(expected, jsonData)
	assert.True(t, is_equal, "IGVTrack not matching expected JSON output")
}

func Test_IGVTrack_FromJSON(t *testing.T) {
	t.Parallel()

	var jsonData = []byte(`{"sequencing_experiment_id":0,"sample_id":"sample_123","patient_id":123,"family_role":"proband","sexcode":"male","datatype_code":"alignment","format_code":"cram","url":"s3://foo/bar/file.cram"}`)
	var expected = IGVTrack{
		SequencingExperimentId: 0,
		SampleId:               "sample_123",
		PatientId:              123,
		FamilyRole:             "proband",
		SexCode:                "male",
		DataTypeCode:           "alignment",
		FormatCode:             "cram",
		URL:                    "s3://foo/bar/file.cram",
	}

	var igv IGVTrack
	err := json.Unmarshal(jsonData, &igv)
	assert.Nil(t, err, "Failed to unmarshal JSON to IGVTrack")
	assert.Equal(t, expected, igv, "Objects should be equal after unmarshalling from JSON")
}

func Test_IGVTrackEnriched_ToJSON(t *testing.T) {
	t.Parallel()

	var igvTrack = IGVTrackEnriched{
		PatientId:        123,
		FamilyRole:       "proband",
		Sex:              "male",
		Type:             "alignment",
		Format:           "cram",
		URL:              "s3://foo/bar/file.cram",
		URLExpireAt:      1000,
		IndexURL:         "s3://foo/bar/file.cram.crai",
		IndexURLExpireAt: 2000,
		Name:             "Sample Track",
	}

	var expected = []byte(`{"patient_id":123,"family_role":"proband","sex":"male","type":"alignment","format":"cram","url":"s3://foo/bar/file.cram","urlExpireAt":1000,"indexURL":"s3://foo/bar/file.cram.crai","indexURLExpireAt":2000,"name":"Sample Track"}`)
	jsonData, err := json.Marshal(igvTrack)
	assert.Nil(t, err, "Failed to marshal IGVTrackEnriched to JSON")

	var is_equal = bytes.Equal(expected, jsonData)
	assert.True(t, is_equal, "IGVTrackEnriched not matching expected JSON output")
}

func Test_IGVTrackEnriched_FromJSON(t *testing.T) {
	t.Parallel()

	var jsonData = []byte(`{"patient_id":123,"family_role":"proband","sex":"male","type":"alignment","format":"cram","url":"s3://foo/bar/file.cram","urlExpireAt":1000,"indexURL":"s3://foo/bar/file.cram.crai","indexURLExpireAt":2000,"name":"Sample Track"}`)
	var expected = IGVTrackEnriched{
		PatientId:        123,
		FamilyRole:       "proband",
		Sex:              "male",
		Type:             "alignment",
		Format:           "cram",
		URL:              "s3://foo/bar/file.cram",
		URLExpireAt:      1000,
		IndexURL:         "s3://foo/bar/file.cram.crai",
		IndexURLExpireAt: 2000,
		Name:             "Sample Track",
	}

	var igv IGVTrackEnriched
	err := json.Unmarshal(jsonData, &igv)
	assert.Nil(t, err, "Failed to unmarshal JSON to IGVTrackEnriched")
	assert.Equal(t, expected, igv, "Objects should be equal after unmarshalling from JSON")
}

func Test_IGVTracks_ToJSON(t *testing.T) {
	t.Parallel()

	var igvTracks = IGVTracks{
		Alignment: []IGVTrackEnriched{
			{
				PatientId:        123,
				FamilyRole:       "proband",
				Sex:              "male",
				Type:             "alignment",
				Format:           "cram",
				URL:              "s3://foo/bar/file.cram",
				URLExpireAt:      1000,
				IndexURL:         "s3://foo/bar/file.cram.crai",
				IndexURLExpireAt: 2000,
				Name:             "Sample Track",
			},
		},
	}

	var expected = []byte(`{"alignment":[{"patient_id":123,"family_role":"proband","sex":"male","type":"alignment","format":"cram","url":"s3://foo/bar/file.cram","urlExpireAt":1000,"indexURL":"s3://foo/bar/file.cram.crai","indexURLExpireAt":2000,"name":"Sample Track"}]}`)
	jsonData, err := json.Marshal(igvTracks)
	assert.Nil(t, err, "Failed to marshal IGVTracks to JSON")

	var is_equal = bytes.Equal(expected, jsonData)
	assert.True(t, is_equal, "IGVTracks not matching expected JSON output")
}

func Test_IGVTracks_FromJSON(t *testing.T) {
	t.Parallel()

	var jsonData = []byte(`{"alignment":[{"patient_id":123,"family_role":"proband","sex":"male","type":"alignment","format":"cram","url":"s3://foo/bar/file.cram","urlExpireAt":1000,"indexURL":"s3://foo/bar/file.cram.crai","indexURLExpireAt":2000,"name":"Sample Track"}]}`)
	var expected = IGVTracks{
		Alignment: []IGVTrackEnriched{
			{
				PatientId:        123,
				FamilyRole:       "proband",
				Sex:              "male",
				Type:             "alignment",
				Format:           "cram",
				URL:              "s3://foo/bar/file.cram",
				URLExpireAt:      1000,
				IndexURL:         "s3://foo/bar/file.cram.crai",
				IndexURLExpireAt: 2000,
				Name:             "Sample Track",
			},
		},
	}

	var igv IGVTracks
	err := json.Unmarshal(jsonData, &igv)
	assert.Nil(t, err, "Failed to unmarshal JSON to IGVTracks")
	assert.Equal(t, expected, igv, "Objects should be equal after unmarshalling from JSON")
}
