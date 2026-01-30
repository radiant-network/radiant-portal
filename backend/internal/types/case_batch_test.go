package types

import (
	"bytes"
	"encoding/json"
	"testing"

	"github.com/stretchr/testify/assert"
)

func Test_CaseBatch_ToJSON(t *testing.T) {
	size := int64(1024)
	var caseBatch = CaseBatch{
		SubmitterCaseId:            "CASE-001",
		Type:                       "germline",
		StatusCode:                 "active",
		ProjectCode:                "PROJ-001",
		DiagnosticLabCode:          "LAB-001",
		PrimaryConditionCodeSystem: "ICD-10",
		PrimaryConditionValue:      "E11.9",
		PriorityCode:               "high",
		CategoryCode:               "prenatal",
		AnalysisCode:               "WGS",
		ResolutionStatusCode:       "pending",
		Note:                       "Test note",
		OrderingPhysician:          "Johnny Bravo",
		OrderingOrganizationCode:   "ORG-001",
		Patients: []*CasePatientBatch{
			{
				AffectedStatusCode:      "affected",
				SubmitterPatientId:      "PAT-001",
				PatientOrganizationCode: "ORG-001",
				RelationToProbandCode:   "self",
			},
		},
		SequencingExperiments: []*CaseSequencingExperimentBatch{
			{
				Aliquot:                "ALQ-001",
				SampleOrganizationCode: "ORG-001",
				SubmitterSampleId:      "SAMPLE-001",
			},
		},
		Tasks: []*CaseTaskBatch{
			{
				Aliquots:        []string{"ALQ-001"},
				TypeCode:        "analysis",
				PipelineVersion: "v1.0.0",
				OutputDocuments: []*OutputDocumentBatch{
					{
						DataCategoryCode: "variant",
						DataTypeCode:     "vcf",
						FormatCode:       "vcf",
						Name:             "output.vcf",
						Size:             &size,
						Url:              "https://example.com/output.vcf",
					},
				},
			},
		},
	}

	var expected = []byte(`{"submitter_case_id":"CASE-001","type":"germline","status_code":"active","project_code":"PROJ-001","diagnostic_lab_code":"LAB-001","primary_condition_code_system":"ICD-10","primary_condition_value":"E11.9","priority_code":"high","category_code":"prenatal","analysis_code":"WGS","resolution_status_code":"pending","note":"Test note","ordering_physician":"Johnny Bravo","ordering_organization_code":"ORG-001","patients":[{"affected_status_code":"affected","submitter_patient_id":"PAT-001","patient_organization_code":"ORG-001","relation_to_proband_code":"self"}],"sequencing_experiments":[{"aliquot":"ALQ-001","sample_organization_code":"ORG-001","submitter_sample_id":"SAMPLE-001"}],"tasks":[{"type_code":"analysis","aliquots":["ALQ-001"],"output_documents":[{"data_category_code":"variant","data_type_code":"vcf","format_code":"vcf","name":"output.vcf","size":1024,"url":"https://example.com/output.vcf"}],"pipeline_version":"v1.0.0"}]}`)
	jsonData, err := json.Marshal(caseBatch)
	assert.Nil(t, err, "Failed to marshal Case Batch to JSON")

	var isEqual = bytes.Equal(expected, jsonData)
	assert.True(t, isEqual, "Objects should be equal after marshalling to JSON")
}

func Test_CaseBatch_FromJSON(t *testing.T) {
	var jsonData = []byte(`{"submitter_case_id":"CASE-001","type":"germline","status_code":"active","project_code":"PROJ-001","diagnostic_lab_code":"LAB-001","primary_condition_code_system":"ICD-10","primary_condition_value":"E11.9","priority_code":"high","category_code":"prenatal","analysis_code":"WGS","resolution_status_code":"pending","note":"Test note","ordering_physician":"Dr. Smith","ordering_organization_code":"ORG-001","patients":[{"affected_status_code":"affected","submitter_patient_id":"PAT-001","patient_organization_code":"ORG-001","relation_to_proband_code":"self"}],"sequencing_experiments":[{"aliquot":"ALQ-001","sample_organization_code":"ORG-001","submitter_sample_id":"SAMPLE-001"}],"tasks":[{"aliquots":["ALQ-001"],"type_code":"analysis","pipeline_version":"v1.0.0","output_documents":[{"data_category_code":"variant","data_type_code":"vcf","format_code":"vcf","name":"output.vcf","size":1024,"url":"https://example.com/output.vcf"}]}]}`)
	size := int64(1024)
	expected := CaseBatch{
		SubmitterCaseId:            "CASE-001",
		Type:                       "germline",
		StatusCode:                 "active",
		ProjectCode:                "PROJ-001",
		DiagnosticLabCode:          "LAB-001",
		PrimaryConditionCodeSystem: "ICD-10",
		PrimaryConditionValue:      "E11.9",
		PriorityCode:               "high",
		CategoryCode:               "prenatal",
		AnalysisCode:               "WGS",
		ResolutionStatusCode:       "pending",
		Note:                       "Test note",
		OrderingPhysician:          "Dr. Smith",
		OrderingOrganizationCode:   "ORG-001",
		Patients: []*CasePatientBatch{
			{
				AffectedStatusCode:      "affected",
				SubmitterPatientId:      "PAT-001",
				PatientOrganizationCode: "ORG-001",
				RelationToProbandCode:   "self",
			},
		},
		SequencingExperiments: []*CaseSequencingExperimentBatch{
			{
				Aliquot:                "ALQ-001",
				SampleOrganizationCode: "ORG-001",
				SubmitterSampleId:      "SAMPLE-001",
			},
		},
		Tasks: []*CaseTaskBatch{
			{
				Aliquots:        []string{"ALQ-001"},
				TypeCode:        "analysis",
				PipelineVersion: "v1.0.0",
				OutputDocuments: []*OutputDocumentBatch{
					{
						DataCategoryCode: "variant",
						DataTypeCode:     "vcf",
						FormatCode:       "vcf",
						Name:             "output.vcf",
						Size:             &size,
						Url:              "https://example.com/output.vcf",
					},
				},
			},
		},
	}

	var caseBatch CaseBatch
	err := json.Unmarshal(jsonData, &caseBatch)
	assert.Nil(t, err, "Failed to unmarshal JSON to Case Batch")
	assert.Equal(t, expected, caseBatch, "Objects should be equal after unmarshalling from JSON")
}
