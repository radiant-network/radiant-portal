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
		TaskId:                 5,
		SampleId:               "sample_123",
		HistologyCode:          "normal",
		PatientId:              123,
		FamilyRole:             "proband",
		SexCode:                "male",
		DataTypeCode:           "alignment",
		FormatCode:             "cram",
		DocumentName:           "file.cram",
		URL:                    "s3://foo/bar/file.cram",
	}

	var expected = []byte(`{"sequencing_experiment_id":0,"task_id":5,"sample_id":"sample_123","histology_code":"normal","patient_id":123,"family_role":"proband","sexcode":"male","datatype_code":"alignment","format_code":"cram","document_name":"file.cram","url":"s3://foo/bar/file.cram"}`)
	jsonData, err := json.Marshal(igvInternal)
	assert.Nil(t, err, "Failed to marshal IGVTrack to JSON")

	var is_equal = bytes.Equal(expected, jsonData)
	assert.True(t, is_equal, "IGVTrack not matching expected JSON output")
}

func Test_IGVTrack_FromJSON(t *testing.T) {
	t.Parallel()

	var jsonData = []byte(`{"sequencing_experiment_id":0,"task_id":5,"sample_id":"sample_123","histology_code":"normal","patient_id":123,"family_role":"proband","sexcode":"male","datatype_code":"alignment","format_code":"cram","document_name":"file.cram","url":"s3://foo/bar/file.cram"}`)
	var expected = IGVTrack{
		SequencingExperimentId: 0,
		TaskId:                 5,
		SampleId:               "sample_123",
		HistologyCode:          "normal",
		PatientId:              123,
		FamilyRole:             "proband",
		SexCode:                "male",
		DataTypeCode:           "alignment",
		FormatCode:             "cram",
		DocumentName:           "file.cram",
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
		SequencingExperimentId: 7,
		PatientId:              123,
		FamilyRole:             "proband",
		Sex:                    "male",
		Type:                   "alignment",
		Format:                 "cram",
		URL:                    "s3://foo/bar/file.cram",
		URLExpireAt:            1000,
		IndexURL:               "s3://foo/bar/file.cram.crai",
		IndexURLExpireAt:       2000,
		Name:                   "Sample Track",
	}

	var expected = []byte(`{"sequencing_experiment_id":7,"patient_id":123,"family_role":"proband","sex":"male","type":"alignment","format":"cram","url":"s3://foo/bar/file.cram","urlExpireAt":1000,"indexURL":"s3://foo/bar/file.cram.crai","indexURLExpireAt":2000,"name":"Sample Track"}`)
	jsonData, err := json.Marshal(igvTrack)
	assert.Nil(t, err, "Failed to marshal IGVTrackEnriched to JSON")

	var is_equal = bytes.Equal(expected, jsonData)
	assert.True(t, is_equal, "IGVTrackEnriched not matching expected JSON output")
}

func Test_IGVTrackEnriched_FromJSON(t *testing.T) {
	t.Parallel()

	var jsonData = []byte(`{"sequencing_experiment_id":7,"patient_id":123,"family_role":"proband","sex":"male","type":"alignment","format":"cram","url":"s3://foo/bar/file.cram","urlExpireAt":1000,"indexURL":"s3://foo/bar/file.cram.crai","indexURLExpireAt":2000,"name":"Sample Track"}`)
	var expected = IGVTrackEnriched{
		SequencingExperimentId: 7,
		PatientId:              123,
		FamilyRole:             "proband",
		Sex:                    "male",
		Type:                   "alignment",
		Format:                 "cram",
		URL:                    "s3://foo/bar/file.cram",
		URLExpireAt:            1000,
		IndexURL:               "s3://foo/bar/file.cram.crai",
		IndexURLExpireAt:       2000,
		Name:                   "Sample Track",
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
				SequencingExperimentId: 7,
				PatientId:              123,
				FamilyRole:             "proband",
				Sex:                    "male",
				Type:                   "alignment",
				Format:                 "cram",
				URL:                    "s3://foo/bar/file.cram",
				URLExpireAt:            1000,
				IndexURL:               "s3://foo/bar/file.cram.crai",
				IndexURLExpireAt:       2000,
				Name:                   "Sample Track",
			},
		},
		PublicTracks: map[string]IGVPublicTrack{
			"clinvar": {URL: "s3://foo/igv/clinvar.vcf.gz", URLExpireAt: 1000, IndexURL: "s3://foo/igv/clinvar.vcf.gz.tbi", IndexURLExpireAt: 2000},
		},
	}

	var expected = []byte(`{"alignment":[{"sequencing_experiment_id":7,"patient_id":123,"family_role":"proband","sex":"male","type":"alignment","format":"cram","url":"s3://foo/bar/file.cram","urlExpireAt":1000,"indexURL":"s3://foo/bar/file.cram.crai","indexURLExpireAt":2000,"name":"Sample Track"}],"public_tracks":{"clinvar":{"url":"s3://foo/igv/clinvar.vcf.gz","urlExpireAt":1000,"indexURL":"s3://foo/igv/clinvar.vcf.gz.tbi","indexURLExpireAt":2000}}}`)
	jsonData, err := json.Marshal(igvTracks)
	assert.Nil(t, err, "Failed to marshal IGVTracks to JSON")

	var is_equal = bytes.Equal(expected, jsonData)
	assert.True(t, is_equal, "IGVTracks not matching expected JSON output")
}

func Test_IGVTracks_FromJSON(t *testing.T) {
	t.Parallel()

	var jsonData = []byte(`{"alignment":[{"sequencing_experiment_id":7,"patient_id":123,"family_role":"proband","sex":"male","type":"alignment","format":"cram","url":"s3://foo/bar/file.cram","urlExpireAt":1000,"indexURL":"s3://foo/bar/file.cram.crai","indexURLExpireAt":2000,"name":"Sample Track"}],"public_tracks":{"clinvar":{"url":"s3://foo/igv/clinvar.vcf.gz","urlExpireAt":1000,"indexURL":"s3://foo/igv/clinvar.vcf.gz.tbi","indexURLExpireAt":2000}}}`)
	var expected = IGVTracks{
		Alignment: []IGVTrackEnriched{
			{
				SequencingExperimentId: 7,
				PatientId:              123,
				FamilyRole:             "proband",
				Sex:                    "male",
				Type:                   "alignment",
				Format:                 "cram",
				URL:                    "s3://foo/bar/file.cram",
				URLExpireAt:            1000,
				IndexURL:               "s3://foo/bar/file.cram.crai",
				IndexURLExpireAt:       2000,
				Name:                   "Sample Track",
			},
		},
		PublicTracks: map[string]IGVPublicTrack{
			"clinvar": {URL: "s3://foo/igv/clinvar.vcf.gz", URLExpireAt: 1000, IndexURL: "s3://foo/igv/clinvar.vcf.gz.tbi", IndexURLExpireAt: 2000},
		},
	}

	var igv IGVTracks
	err := json.Unmarshal(jsonData, &igv)
	assert.Nil(t, err, "Failed to unmarshal JSON to IGVTracks")
	assert.Equal(t, expected, igv, "Objects should be equal after unmarshalling from JSON")
}

func Test_IGVTracks_ToJSON_EmptyCaseTracksAreOmittedAndPublicTracksKept(t *testing.T) {
	t.Parallel()

	igvTracks := IGVTracks{
		Alignment:    []IGVTrackEnriched{},
		PublicTracks: map[string]IGVPublicTrack{},
	}

	jsonData, err := json.Marshal(igvTracks)
	assert.NoError(t, err)
	assert.JSONEq(t, `{"public_tracks":{}}`, string(jsonData))
}

func Test_IGVTracks_ToJSON_NewCaseTrackArrays(t *testing.T) {
	t.Parallel()

	track := IGVTrackEnriched{SequencingExperimentId: 7, PatientId: 1, Type: "igv", Format: "bw", URL: "u", Name: "n"}
	igvTracks := IGVTracks{
		CNV:            []IGVTrackEnriched{track},
		Seg:            []IGVTrackEnriched{track},
		BAF:            []IGVTrackEnriched{track},
		ROH:            []IGVTrackEnriched{track},
		CaptureTargets: []IGVTrackEnriched{track},
		PublicTracks:   map[string]IGVPublicTrack{},
	}

	item := `{"sequencing_experiment_id":7,"patient_id":1,"family_role":"","sex":"","type":"igv","format":"bw","url":"u","urlExpireAt":0,"indexURL":"","indexURLExpireAt":0,"name":"n"}`
	jsonData, err := json.Marshal(igvTracks)
	assert.NoError(t, err)
	assert.JSONEq(t, `{"cnv":[`+item+`],"seg":[`+item+`],"baf":[`+item+`],"roh":[`+item+`],"capture_targets":[`+item+`],"public_tracks":{}}`, string(jsonData))
}
