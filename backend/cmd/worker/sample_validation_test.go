package main

import (
	"testing"

	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/stretchr/testify/assert"
)

type MockOrganizationRepository struct {
	GetOrganizationByCodeFunc func(code string) (*types.Organization, error)
}

func (m *MockOrganizationRepository) GetOrganizationByCode(code string) (*types.Organization, error) {
	if m.GetOrganizationByCodeFunc != nil {
		return m.GetOrganizationByCodeFunc(code)
	}
	return nil, nil
}

type MockPatientsRepository struct {
	GetPatientByOrgCodeAndOrgPatientIdFunc func(organizationCode string, organizationPatientId string) (*types.Patient, error)
}

func (m *MockPatientsRepository) GetPatientByOrgCodeAndOrgPatientId(organizationCode string, organizationPatientId string) (*types.Patient, error) {
	if m.GetPatientByOrgCodeAndOrgPatientIdFunc != nil {
		return m.GetPatientByOrgCodeAndOrgPatientIdFunc(organizationCode, organizationPatientId)
	}
	return nil, nil
}

func (m *MockPatientsRepository) GetPatientByOrganizationPatientId(organizationId int, organizationPatientId string) (*types.Patient, error) {
	return nil, nil
}

func (m *MockPatientsRepository) CreatePatient(newPatient *types.Patient) error { return nil }

type MockSamplesRepository struct {
	GetSampleBySubmitterSampleIdFunc func(organizationId int, submitterSampleId string) (*types.Sample, error)
	CreateSampleFunc                 func(newSample *types.Sample) error
}

func (m *MockSamplesRepository) GetSampleBySubmitterSampleId(organizationId int, submitterSampleId string) (*types.Sample, error) {
	if m.GetSampleBySubmitterSampleIdFunc != nil {
		return m.GetSampleBySubmitterSampleIdFunc(organizationId, submitterSampleId)
	}
	return nil, nil
}

func (m *MockSamplesRepository) CreateSample(newSample *types.Sample) error {
	if m.CreateSampleFunc != nil {
		return m.CreateSampleFunc(newSample)
	}
	return nil
}

func Test_SampleField_Too_Long(t *testing.T) {
	longString := randomString(120, letters)
	sample := types.SampleBatch{SampleOrganizationCode: "CHUSJ", SubmitterSampleId: "S1", TissueSite: longString}
	rec := SampleValidationRecord{Sample: sample}
	rec.validateFieldLength("tissue_site", rec.Sample.TissueSite)

	assert.Len(t, rec.Errors, 1)
	assert.Equal(t, SampleInvalidValueCode, rec.Errors[0].Code)
	assert.Contains(t, rec.Errors[0].Message, "field is too long")
	assert.Equal(t, "sample[0].tissue_site", rec.Errors[0].Path)
}

func Test_ValidatePatient_NotFound(t *testing.T) {
	sample := types.SampleBatch{PatientOrganizationCode: "CHUSJ", SubmitterPatientId: "P1", SubmitterSampleId: "S1"}
	rec := SampleValidationRecord{Sample: sample}
	rec.validatePatient(nil)
	assert.Len(t, rec.Errors, 1)
	assert.Equal(t, SamplePatientNotExistCode, rec.Errors[0].Code)
	assert.Equal(t, "sample[0].submitter_patient_id", rec.Errors[0].Path)
}

func Test_ValidateOrganization_NotFound(t *testing.T) {
	sample := types.SampleBatch{SampleOrganizationCode: "CHUSJ", SubmitterSampleId: "S1"}
	rec := SampleValidationRecord{Sample: sample}
	rec.validateOrganization(nil)
	assert.Len(t, rec.Errors, 1)
	assert.Equal(t, SampleOrgNotExistCode, rec.Errors[0].Code)
	assert.Equal(t, "sample[0].sample_organization_code", rec.Errors[0].Path)
}

func Test_ValidateExistingSampleInDb_DifferentValues(t *testing.T) {
	sample := types.SampleBatch{SampleOrganizationCode: "CHUSJ", SubmitterSampleId: "S1", TypeCode: "normal", TissueSite: "blood", HistologyCode: "9000/0"}
	existing := &types.Sample{TypeCode: "tumoral", TissueType: "dna", HistologyTypeCode: "8041/3"}
	rec := SampleValidationRecord{Sample: sample}
	rec.validateExistingSampleInDb(existing)

	assert.True(t, rec.Skipped)
	assert.Len(t, rec.Infos, 1)
	assert.Len(t, rec.Warnings, 3)
	for _, w := range rec.Warnings {
		assert.Equal(t, SampleExistingSampleDifferentFieldCode, w.Code)
	}
}

func Test_ValidateParentSample_DifferentPatient(t *testing.T) {
	sample := types.SampleBatch{SampleOrganizationCode: "CHUSJ", SubmitterSampleId: "S1", SubmitterParentSampleId: "P1"}
	rec := SampleValidationRecord{Sample: sample, PatientId: 1}
	parentSample := &types.Sample{PatientID: 2} // Different patient ID
	rec.validateExistingParentSampleInDb(parentSample)

	assert.Len(t, rec.Errors, 1)
	assert.Equal(t, SampleInvalidPatientForParentSampleCode, rec.Errors[0].Code)
}

func Test_ValidateSamplesBatch(t *testing.T) {
	org := &types.Organization{ID: 1, Code: "CHUSJ"}
	patient := &types.Patient{ID: 10, OrganizationPatientId: "P1"}
	existingSampleInDb := &types.Sample{SubmitterSampleId: "S2", TypeCode: "tumoral", PatientID: 10}
	parentInDb := &types.Sample{SubmitterSampleId: "P-DB", PatientID: 10}

	mockOrgRepo := &MockOrganizationRepository{
		GetOrganizationByCodeFunc: func(code string) (*types.Organization, error) {
			if code == "CHUSJ" {
				return org, nil
			}
			return nil, nil
		},
	}
	mockPatientRepo := &MockPatientsRepository{
		GetPatientByOrgCodeAndOrgPatientIdFunc: func(orgCode, patientId string) (*types.Patient, error) {
			if orgCode == "CHUSJ" && patientId == "P1" {
				return patient, nil
			}
			return nil, nil
		},
	}
	mockSampleRepo := &MockSamplesRepository{
		GetSampleBySubmitterSampleIdFunc: func(orgId int, sampleId string) (*types.Sample, error) {
			if orgId == org.ID {
				switch sampleId {
				case "S2":
					return existingSampleInDb, nil
				case "P-DB":
					return parentInDb, nil
				}
			}
			return nil, nil
		},
	}

	samples := []types.SampleBatch{
		{SubmitterSampleId: "S1", SampleOrganizationCode: "CHUSJ", PatientOrganizationCode: "CHUSJ", SubmitterPatientId: "P1", TypeCode: "normal"},                                     // 1. Valid new sample
		{SubmitterSampleId: "S2", SampleOrganizationCode: "CHUSJ", PatientOrganizationCode: "CHUSJ", SubmitterPatientId: "P1", TypeCode: "normal"},                                     // 2. Conflict with DB
		{SubmitterSampleId: "S3", SampleOrganizationCode: "CHUSJ", PatientOrganizationCode: "CHUSJ", SubmitterPatientId: "P1", TypeCode: "normal", SubmitterParentSampleId: "P-BATCH"}, // 3. Parent in batch
		{SubmitterSampleId: "S4", SampleOrganizationCode: "CHUSJ", PatientOrganizationCode: "CHUSJ", SubmitterPatientId: "P1", TypeCode: "normal", SubmitterParentSampleId: "P-DB"},    // 4. Parent in DB
		{SubmitterSampleId: "S5", SampleOrganizationCode: "CHUSJ", PatientOrganizationCode: "CHUSJ", SubmitterPatientId: "P1", TypeCode: "normal", SubmitterParentSampleId: "P-NONE"},  // 5. Parent not found
		{SubmitterSampleId: "P-BATCH", SampleOrganizationCode: "CHUSJ", PatientOrganizationCode: "CHUSJ", SubmitterPatientId: "P1", TypeCode: "normal"},                                // 6. The parent for S3
	}

	records, err := validateSamplesBatch(samples, mockOrgRepo, mockPatientRepo, mockSampleRepo)
	assert.NoError(t, err)
	assert.Len(t, records, 6)

	// 1. Valid (S1)
	assert.False(t, records[0].Skipped)
	assert.Empty(t, records[0].Errors)

	// 2. Conflict with DB (S2)
	assert.True(t, records[1].Skipped)
	assert.Len(t, records[1].Warnings, 1)
	assert.Equal(t, SampleExistingSampleDifferentFieldCode, records[1].Warnings[0].Code)

	// 3. Parent in batch (S3 with parent P-BATCH)
	assert.False(t, records[2].Skipped)
	assert.Empty(t, records[2].Errors)

	// 4. Parent in DB (S4 with parent P-DB)
	assert.False(t, records[3].Skipped)
	assert.Empty(t, records[3].Errors)

	// 5. Parent not found (S5 with parent P-NONE)
	assert.False(t, records[4].Skipped)
	assert.Len(t, records[4].Errors, 1)
	assert.Equal(t, SampleUnknownParentSubmitterSampleIdCode, records[4].Errors[0].Code)

	// 6. Parent sample itself (P-BATCH)
	assert.False(t, records[5].Skipped)
	assert.Empty(t, records[5].Errors)
}
