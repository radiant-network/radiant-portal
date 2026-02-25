package main

import (
	"testing"

	"github.com/radiant-network/radiant-api/internal/batchval"
	"github.com/radiant-network/radiant-api/internal/repository"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/stretchr/testify/assert"
)

type MockOrganizationRepository struct {
	GetOrganizationByCodeFunc func(code string) (*types.Organization, error)
}

func (m *MockOrganizationRepository) GetOrganizationById(id int) (*types.Organization, error) {
	return nil, nil
}

func (m *MockOrganizationRepository) GetOrganizationByCode(code string) (*types.Organization, error) {
	if m.GetOrganizationByCodeFunc != nil {
		return m.GetOrganizationByCodeFunc(code)
	}
	return nil, nil
}

type MockPatientsRepository struct {
	GetPatientByOrgCodeAndSubmitterPatientIdFunc func(organizationCode string, submitterPatientId string) (*types.Patient, error)
}

func (m *MockPatientsRepository) GetPatientByOrgCodeAndSubmitterPatientId(organizationCode string, submitterPatientId string) (*types.Patient, error) {
	if m.GetPatientByOrgCodeAndSubmitterPatientIdFunc != nil {
		return m.GetPatientByOrgCodeAndSubmitterPatientIdFunc(organizationCode, submitterPatientId)
	}
	return nil, nil
}

func (m *MockPatientsRepository) GetPatientBySubmitterPatientId(organizationId int, submitterPatientId string) (*types.Patient, error) {
	return nil, nil
}

func (m *MockPatientsRepository) CreatePatient(newPatient *types.Patient) error { return nil }

type MockSamplesRepository struct {
	GetSampleBySubmitterSampleIdFunc func(organizationId int, submitterSampleId string) (*types.Sample, error)
	CreateSampleFunc                 func(newSample *types.Sample) (*types.Sample, error)
	GetTypeCodesFunc                 func() ([]string, error)
}

func (m *MockSamplesRepository) GetSampleById(id int) (*types.Sample, error) {
	return nil, nil
}

func (m *MockSamplesRepository) GetSampleBySubmitterSampleId(organizationId int, submitterSampleId string) (*types.Sample, error) {
	if m.GetSampleBySubmitterSampleIdFunc != nil {
		return m.GetSampleBySubmitterSampleIdFunc(organizationId, submitterSampleId)
	}
	return nil, nil
}

func (m *MockSamplesRepository) GetSampleByOrgCodeAndSubmitterSampleId(organizationCode string, submitterSampleId string) (*types.Sample, error) {
	return nil, nil
}

func (m *MockSamplesRepository) CreateSample(newSample *types.Sample) (*types.Sample, error) {
	if m.CreateSampleFunc != nil {
		return m.CreateSampleFunc(newSample)
	}
	return nil, nil
}

func (m *MockSamplesRepository) GetTypeCodes() ([]string, error) {
	if m.GetTypeCodesFunc != nil {
		return m.GetTypeCodesFunc()
	}
	return nil, nil
}

type MockValueSetRepository struct {
	GetCodesFunc func(vsType repository.ValueSetType) ([]string, error)
}

func (m *MockValueSetRepository) GetCodes(vsType repository.ValueSetType) ([]string, error) {
	if m.GetCodesFunc != nil {
		return m.GetCodesFunc(vsType)
	}
	switch vsType {
	case repository.ValueSetSampleType:
		return []string{"blood", "dna", "rna", "solid_tissue"}, nil
	case repository.ValueSetHistologyType:
		return []string{"tumoral", "normal"}, nil
	default:
		return []string{}, nil
	}
}

func Test_ValidateSubmitterPatientId_Valid(t *testing.T) {
	sample := types.SampleBatch{SampleOrganizationCode: "CHUSJ", SubmitterSampleId: "S1", SubmitterPatientId: "PAT-123"}
	rec := SampleValidationRecord{Sample: sample}
	rec.validateSubmitterPatientId()
	assert.Empty(t, rec.Errors)
}

func Test_ValidateSubmitterPatientId_Invalid(t *testing.T) {
	sample := types.SampleBatch{SampleOrganizationCode: "CHUSJ", SubmitterSampleId: "S1", SubmitterPatientId: "INVALID$ID"}
	rec := SampleValidationRecord{Sample: sample}
	rec.validateSubmitterPatientId()
	assert.Len(t, rec.Errors, 1)
	assert.Equal(t, SampleInvalidValueCode, rec.Errors[0].Code)
	assert.Contains(t, rec.Errors[0].Message, "does not match the regular expression")
}

func Test_ValidateSubmitterSampleId_Valid(t *testing.T) {
	sample := types.SampleBatch{SampleOrganizationCode: "CHUSJ", SubmitterSampleId: "SAMPLE-456"}
	rec := SampleValidationRecord{Sample: sample}
	rec.validateSubmitterSampleId()
	assert.Empty(t, rec.Errors)
}

func Test_ValidateSubmitterSampleId_Invalid(t *testing.T) {
	sample := types.SampleBatch{SampleOrganizationCode: "CHUSJ", SubmitterSampleId: "BAD@SAMPLE"}
	rec := SampleValidationRecord{Sample: sample}
	rec.validateSubmitterSampleId()
	assert.Len(t, rec.Errors, 1)
	assert.Equal(t, SampleInvalidValueCode, rec.Errors[0].Code)
}

func Test_ValidateSubmitterParentSampleId_Valid(t *testing.T) {
	sample := types.SampleBatch{SampleOrganizationCode: "CHUSJ", SubmitterSampleId: "S1", SubmitterParentSampleId: "PARENT-123"}
	rec := SampleValidationRecord{Sample: sample}
	rec.validateSubmitterParentSampleId()
	assert.Empty(t, rec.Errors)
}

func Test_ValidateSubmitterParentSampleId_Empty(t *testing.T) {
	sample := types.SampleBatch{SampleOrganizationCode: "CHUSJ", SubmitterSampleId: "S1", SubmitterParentSampleId: ""}
	rec := SampleValidationRecord{Sample: sample}
	rec.validateSubmitterParentSampleId()
	assert.Empty(t, rec.Errors)
}

func Test_ValidateSubmitterParentSampleId_Invalid(t *testing.T) {
	sample := types.SampleBatch{SampleOrganizationCode: "CHUSJ", SubmitterSampleId: "S1", SubmitterParentSampleId: "INVALID$PARENT"}
	rec := SampleValidationRecord{Sample: sample}
	rec.validateSubmitterParentSampleId()
	assert.Len(t, rec.Errors, 1)
	assert.Equal(t, SampleInvalidValueCode, rec.Errors[0].Code)
}

func Test_ValidateTissueSite_Valid(t *testing.T) {
	sample := types.SampleBatch{SampleOrganizationCode: "CHUSJ", SubmitterSampleId: "S1", TissueSite: "Blood-Derived"}
	rec := SampleValidationRecord{Sample: sample}
	rec.validateTissueSite()
	assert.Empty(t, rec.Errors)
}

func Test_ValidateTissueSite_Empty(t *testing.T) {
	sample := types.SampleBatch{SampleOrganizationCode: "CHUSJ", SubmitterSampleId: "S1", TissueSite: ""}
	rec := SampleValidationRecord{Sample: sample}
	rec.validateTissueSite()
	assert.Empty(t, rec.Errors)
}

func Test_ValidateTissueSite_Invalid(t *testing.T) {
	sample := types.SampleBatch{SampleOrganizationCode: "CHUSJ", SubmitterSampleId: "S1", TissueSite: "Blood123"}
	rec := SampleValidationRecord{Sample: sample}
	rec.validateTissueSite()
	assert.Len(t, rec.Errors, 1)
	assert.Equal(t, SampleInvalidValueCode, rec.Errors[0].Code)
	assert.Contains(t, rec.Errors[0].Message, "does not match the regular expression")
}

func Test_ValidateTypeCode_Valid(t *testing.T) {
	sample := types.SampleBatch{SampleOrganizationCode: "CHUSJ", SubmitterSampleId: "S1", TypeCode: "blood"}
	mockValueSetRepo := &MockValueSetRepository{
		GetCodesFunc: func(vsType repository.ValueSetType) ([]string, error) {
			return []string{"blood", "dna"}, nil
		},
	}
	rec := SampleValidationRecord{
		BaseValidationRecord: batchval.BaseValidationRecord{Context: &batchval.BatchValidationContext{ValueSetsRepo: mockValueSetRepo}},
		Sample:               sample,
	}
	err := rec.validateTypeCode()
	assert.NoError(t, err)
	assert.Empty(t, rec.Errors)
}

func Test_ValidateTypeCode_Invalid(t *testing.T) {
	sample := types.SampleBatch{SampleOrganizationCode: "CHUSJ", SubmitterSampleId: "S1", TypeCode: "invalid_type"}
	mockValueSetRepo := &MockValueSetRepository{
		GetCodesFunc: func(vsType repository.ValueSetType) ([]string, error) {
			return []string{"blood", "dna"}, nil
		},
	}
	rec := SampleValidationRecord{
		BaseValidationRecord: batchval.BaseValidationRecord{Context: &batchval.BatchValidationContext{ValueSetsRepo: mockValueSetRepo}},
		Sample:               sample,
	}
	err := rec.validateTypeCode()
	assert.NoError(t, err)
	assert.Len(t, rec.Errors, 1)
	assert.Equal(t, SampleInvalidValueCode, rec.Errors[0].Code)
	assert.Equal(t, rec.Errors[0].Message, "Invalid field type_code for sample (CHUSJ / S1). Reason: \"invalid_type\" is not a valid type code. Valid values [blood, dna].")
}

func Test_ValidateHistologyTypeCode_Valid(t *testing.T) {
	sample := types.SampleBatch{SampleOrganizationCode: "CHUSJ", SubmitterSampleId: "S1", TypeCode: "blood", HistologyCode: "normal"}
	rec := SampleValidationRecord{
		BaseValidationRecord: batchval.BaseValidationRecord{Context: &batchval.BatchValidationContext{ValueSetsRepo: &MockValueSetRepository{}}},
		Sample:               sample,
	}
	err := rec.validateHistologyCode()
	assert.NoError(t, err)
	assert.Empty(t, rec.Errors)
}

func Test_ValidateHistologyTypeCode_Invalid(t *testing.T) {
	sample := types.SampleBatch{SampleOrganizationCode: "CHUSJ", SubmitterSampleId: "S1", TypeCode: "blood", HistologyCode: "invalid_histology"}
	rec := SampleValidationRecord{
		BaseValidationRecord: batchval.BaseValidationRecord{Context: &batchval.BatchValidationContext{ValueSetsRepo: &MockValueSetRepository{}}},
		Sample:               sample,
	}
	err := rec.validateHistologyCode()
	expected := types.BatchMessage{
		Code:    SampleInvalidValueCode,
		Message: "Invalid field histology_code for sample (CHUSJ / S1). Reason: \"invalid_histology\" is not a valid histology code. Valid values [tumoral, normal].",
		Path:    "sample[0].histology_code",
	}
	assert.NoError(t, err)
	assert.Len(t, rec.Errors, 1)
	assert.Equal(t, expected, rec.Errors[0])
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
	sample := types.SampleBatch{SampleOrganizationCode: "CHUSJ", SubmitterSampleId: "S1", TypeCode: "blood", TissueSite: "blood", HistologyCode: "9000/0"}
	existing := &types.Sample{TypeCode: "dna", TissueSite: "dna", HistologyCode: "8041/3"}
	rec := SampleValidationRecord{Sample: sample}
	rec.validateExistingSampleInDb(existing)

	assert.True(t, rec.Skipped)
	assert.Len(t, rec.Infos, 0)
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
	patient := &types.Patient{ID: 10, SubmitterPatientId: "P1"}
	existingSampleInDb := &types.Sample{SubmitterSampleId: "S2", TypeCode: "blood", PatientID: 10, HistologyCode: "normal"}
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
		GetPatientByOrgCodeAndSubmitterPatientIdFunc: func(orgCode, submitterPatientId string) (*types.Patient, error) {
			if orgCode == "CHUSJ" && submitterPatientId == "P1" {
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
	mockContext := &batchval.BatchValidationContext{
		OrgRepo:       mockOrgRepo,
		PatientRepo:   mockPatientRepo,
		SampleRepo:    mockSampleRepo,
		ValueSetsRepo: &MockValueSetRepository{},
	}

	samples := []types.SampleBatch{
		{SubmitterSampleId: "S1", SampleOrganizationCode: "CHUSJ", PatientOrganizationCode: "CHUSJ", SubmitterPatientId: "P1", TypeCode: "dna", HistologyCode: "normal"},                                           // 1. Valid new sample
		{SubmitterSampleId: "S2", SampleOrganizationCode: "CHUSJ", PatientOrganizationCode: "CHUSJ", SubmitterPatientId: "P1", TypeCode: "dna", HistologyCode: "normal"},                                           // 2. Conflict with DB
		{SubmitterSampleId: "S3", SampleOrganizationCode: "CHUSJ", PatientOrganizationCode: "CHUSJ", SubmitterPatientId: "P1", TypeCode: "dna", SubmitterParentSampleId: "P-BATCH", HistologyCode: "normal"},       // 3. Parent in batch
		{SubmitterSampleId: "S4", SampleOrganizationCode: "CHUSJ", PatientOrganizationCode: "CHUSJ", SubmitterPatientId: "P1", TypeCode: "dna", SubmitterParentSampleId: "P-DB", HistologyCode: "normal"},          // 4. Parent in DB
		{SubmitterSampleId: "S5", SampleOrganizationCode: "CHUSJ", PatientOrganizationCode: "CHUSJ", SubmitterPatientId: "P1", TypeCode: "dna", SubmitterParentSampleId: "P-NONE", HistologyCode: "normal"},        // 5. Parent not found
		{SubmitterSampleId: "P-BATCH", SampleOrganizationCode: "CHUSJ", PatientOrganizationCode: "CHUSJ", SubmitterPatientId: "P1", TypeCode: "dna", SubmitterParentSampleId: "P-BATCH2", HistologyCode: "normal"}, // 6. The parent for S3
		{SubmitterSampleId: "P-BATCH2", SampleOrganizationCode: "CHUSJ", PatientOrganizationCode: "CHUSJ", SubmitterPatientId: "P1", TypeCode: "dna", HistologyCode: "normal"},                                     // 7. The grandparent for S3
	}

	records, err := validateSamplesBatch(mockContext, samples)
	assert.NoError(t, err)
	assert.Len(t, records, 7) // Updated from 6 to 7 to include P-BATCH2

	// Helper to find a record by SubmitterSampleId
	findRecord := func(id string) *SampleValidationRecord {
		for _, r := range records {
			if r.Sample.SubmitterSampleId.String() == id {
				return r
			}
		}
		return nil
	}

	// 1. Valid (S1)
	s1 := findRecord("S1")
	assert.NotNil(t, s1)
	assert.False(t, s1.Skipped)
	assert.Empty(t, s1.Errors)

	// 2. Conflict with DB (S2)
	s2 := findRecord("S2")
	assert.NotNil(t, s2)
	assert.True(t, s2.Skipped)
	assert.Len(t, s2.Warnings, 1)
	assert.Equal(t, SampleExistingSampleDifferentFieldCode, s2.Warnings[0].Code)

	// 3. Parent in batch (S3 with parent P-BATCH) - should come AFTER P-BATCH in the reordered list
	s3 := findRecord("S3")
	assert.NotNil(t, s3)
	assert.False(t, s3.Skipped)
	assert.Empty(t, s3.Errors)

	// 6. Parent sample (P-BATCH with parent P-BATCH2)
	pBatch := findRecord("P-BATCH")
	assert.NotNil(t, pBatch)
	assert.False(t, pBatch.Skipped)
	assert.Empty(t, pBatch.Errors)

	// 7. Grandparent sample (P-BATCH2)
	pBatch2 := findRecord("P-BATCH2")
	assert.NotNil(t, pBatch2)
	assert.False(t, pBatch2.Skipped)
	assert.Empty(t, pBatch2.Errors)

	// Verify the ordering
	var pBatch2Idx, pBatchIdx, s3Idx int
	for i, r := range records {
		switch r.Sample.SubmitterSampleId {
		case "P-BATCH2":
			pBatch2Idx = i
		case "P-BATCH":
			pBatchIdx = i
		case "S3":
			s3Idx = i
		}
	}
	assert.Less(t, pBatch2Idx, pBatchIdx, "Grandparent P-BATCH2 should appear before parent P-BATCH")
	assert.Less(t, pBatchIdx, s3Idx, "Parent P-BATCH should appear before child S3")

	// 4. Parent in DB (S4 with parent P-DB)
	s4 := findRecord("S4")
	assert.NotNil(t, s4)
	assert.False(t, s4.Skipped)
	assert.Empty(t, s4.Errors)

	// 5. Parent not found (S5 with parent P-NONE)
	s5 := findRecord("S5")
	assert.NotNil(t, s5)
	assert.False(t, s5.Skipped)
	assert.Len(t, s5.Errors, 1)
	assert.Equal(t, SampleUnknownParentSubmitterSampleIdCode, s5.Errors[0].Code)
}

func Test_reorderSampleRecords_Duplicates(t *testing.T) {
	r1 := &SampleValidationRecord{Sample: types.SampleBatch{SubmitterSampleId: "S1", SampleOrganizationCode: "ORG1"}}
	r2 := &SampleValidationRecord{Sample: types.SampleBatch{SubmitterSampleId: "S2", SampleOrganizationCode: "ORG1", SubmitterParentSampleId: "S1"}}
	r3 := &SampleValidationRecord{Sample: types.SampleBatch{SubmitterSampleId: "S2", SampleOrganizationCode: "ORG1", SubmitterParentSampleId: "S1"}} // Duplicate S2

	// Input in reverse order to force reordering
	records := []*SampleValidationRecord{r2, r3, r1}

	sorted := reorderSampleRecords(records)
	assert.Len(t, sorted, 3, "Should have 3 records after reordering")

	// Check for duplicates in the result slice
	recordCounts := make(map[*SampleValidationRecord]int)
	for _, r := range sorted {
		recordCounts[r]++
	}

	assert.Equal(t, 1, recordCounts[r1], "r1 should appear exactly once")
	assert.Equal(t, 1, recordCounts[r2], "r2 should appear once")
	assert.Equal(t, 1, recordCounts[r3], "r3 should appear once")

	// Check order: r1 should be before r2 and r3
	var r1Idx, r2Idx, r3Idx int
	for i, r := range sorted {
		if r == r1 {
			r1Idx = i
		}
		if r == r2 {
			r2Idx = i
		}
		if r == r3 {
			r3Idx = i
		}
	}
	assert.Less(t, r1Idx, r2Idx, "Parent r1 should be before child r2")
	assert.Less(t, r1Idx, r3Idx, "Parent r1 should be before child r3")
}

func Test_reorderSampleRecords_DeepHierarchy(t *testing.T) {
	r1 := &SampleValidationRecord{Sample: types.SampleBatch{SubmitterSampleId: "S1", SampleOrganizationCode: "ORG1"}}                                // Grandparent
	r2 := &SampleValidationRecord{Sample: types.SampleBatch{SubmitterSampleId: "S2", SampleOrganizationCode: "ORG1", SubmitterParentSampleId: "S1"}} // Parent
	r3 := &SampleValidationRecord{Sample: types.SampleBatch{SubmitterSampleId: "S3", SampleOrganizationCode: "ORG1", SubmitterParentSampleId: "S2"}} // Child

	// Order: Child, Parent, Grandparent
	records := []*SampleValidationRecord{r3, r2, r1}

	sorted := reorderSampleRecords(records)
	assert.Len(t, sorted, 3)

	var r1Idx, r2Idx, r3Idx int
	for i, r := range sorted {
		if r == r1 {
			r1Idx = i
		}
		if r == r2 {
			r2Idx = i
		}
		if r == r3 {
			r3Idx = i
		}
	}
	assert.Less(t, r1Idx, r2Idx, "Grandparent S1 should be before parent S2")
	assert.Less(t, r2Idx, r3Idx, "Parent S2 should be before child S3")
}

func Test_reorderSampleRecords_DeepHierarchy_With_Duplicates(t *testing.T) {
	r1 := &SampleValidationRecord{Sample: types.SampleBatch{SubmitterSampleId: "S1", SampleOrganizationCode: "ORG1"}}                                // Grandparent
	r2 := &SampleValidationRecord{Sample: types.SampleBatch{SubmitterSampleId: "S1", SampleOrganizationCode: "ORG1"}}                                // Grandparent
	r3 := &SampleValidationRecord{Sample: types.SampleBatch{SubmitterSampleId: "S2", SampleOrganizationCode: "ORG1", SubmitterParentSampleId: "S1"}} // Parent
	r4 := &SampleValidationRecord{Sample: types.SampleBatch{SubmitterSampleId: "S2", SampleOrganizationCode: "ORG1", SubmitterParentSampleId: "S1"}} // Parent
	r5 := &SampleValidationRecord{Sample: types.SampleBatch{SubmitterSampleId: "S3", SampleOrganizationCode: "ORG1", SubmitterParentSampleId: "S2"}} // Child
	r6 := &SampleValidationRecord{Sample: types.SampleBatch{SubmitterSampleId: "S3", SampleOrganizationCode: "ORG1", SubmitterParentSampleId: "S2"}} // Child

	// Order: Child, Parent, Grandparent
	records := []*SampleValidationRecord{r6, r5, r4, r3, r2, r1}

	sorted := reorderSampleRecords(records)
	assert.Len(t, sorted, 6)

	var r1Idx, r2Idx, r3Idx, r4Idx, r5Idx, r6Idx int
	for i, r := range sorted {
		if r == r1 {
			r1Idx = i
		}
		if r == r2 {
			r2Idx = i
		}
		if r == r3 {
			r3Idx = i
		}
		if r == r4 {
			r4Idx = i
		}
		if r == r5 {
			r5Idx = i
		}
		if r == r6 {
			r6Idx = i
		}
	}
	assert.Less(t, r1Idx, r3Idx, "Grandparent S1 should be before parent S2")
	assert.Less(t, r1Idx, r4Idx, "Grandparent S1 should be before duplicate parent S2")
	assert.Less(t, r2Idx, r3Idx, "Grandparent duplicate S1 should also be before parent S2")
	assert.Less(t, r2Idx, r4Idx, "Grandparent duplicate S1 should also be before parent duplicate S2")
	assert.Less(t, r3Idx, r5Idx, "Parent S2 should be before child S3")
	assert.Less(t, r4Idx, r5Idx, "Parent duplicate S2 should be before child S3")
	assert.Less(t, r3Idx, r6Idx, "Parent S2 should be before child S3")
	assert.Less(t, r4Idx, r6Idx, "Parent duplicate S2 should be before child duplicate S3")
}

func Test_reorderSampleRecords_Cycle(t *testing.T) {
	// S1 -> S2 -> S1 (Cycle)
	r1 := &SampleValidationRecord{Sample: types.SampleBatch{SubmitterSampleId: "S1", SampleOrganizationCode: "ORG1", SubmitterParentSampleId: "S2"}}
	r2 := &SampleValidationRecord{Sample: types.SampleBatch{SubmitterSampleId: "S2", SampleOrganizationCode: "ORG1", SubmitterParentSampleId: "S1"}}

	records := []*SampleValidationRecord{r1, r2}

	// This should not hang/infinite loop
	sorted := reorderSampleRecords(records)
	assert.Len(t, sorted, 2)
}
