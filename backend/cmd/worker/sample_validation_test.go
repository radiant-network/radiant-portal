package main

import (
	"context"
	"testing"

	"github.com/radiant-network/radiant-api/internal/batchval"
	"github.com/radiant-network/radiant-api/internal/repository"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

type MockOrganizationRepository struct {
	GetOrganizationByCodeFunc func(code string) (*types.Organization, error)
}

func (m *MockOrganizationRepository) GetOrganizationByCode(_ context.Context, code string) (*types.Organization, error) {
	if m.GetOrganizationByCodeFunc != nil {
		return m.GetOrganizationByCodeFunc(code)
	}
	return nil, nil
}

type MockPatientsRepository struct {
	GetPatientByOrgCodeAndSubmitterPatientIdFunc func(organizationCode string, submitterPatientId string) (*types.Patient, error)
	UpdatePatientFunc                            func(patient *types.Patient) error
	UpdatedPatients                              []types.Patient
}

func (m *MockPatientsRepository) GetPatientByOrgCodeAndSubmitterPatientId(_ context.Context, organizationCode string, submitterPatientId string) (*types.Patient, error) {
	if m.GetPatientByOrgCodeAndSubmitterPatientIdFunc != nil {
		return m.GetPatientByOrgCodeAndSubmitterPatientIdFunc(organizationCode, submitterPatientId)
	}
	return nil, nil
}

func (m *MockPatientsRepository) CreatePatient(_ context.Context, newPatient *types.Patient) error {
	return nil
}

func (m *MockPatientsRepository) UpdatePatient(_ context.Context, patient *types.Patient) error {
	m.UpdatedPatients = append(m.UpdatedPatients, *patient)
	if m.UpdatePatientFunc != nil {
		return m.UpdatePatientFunc(patient)
	}
	return nil
}

type MockSamplesRepository struct {
	GetSampleByOrgCodeAndSubmitterSampleIdFunc func(organizationCode string, submitterSampleId string) (*types.Sample, error)
	CreateSampleFunc                           func(newSample *types.Sample) (*types.Sample, error)
	UpdateSampleFunc                           func(sample *types.Sample) error
	GetTypeCodesFunc                           func() ([]string, error)
	UpdatedSamples                             []types.Sample
}

func (m *MockSamplesRepository) GetSampleById(_ context.Context, id int) (*types.Sample, error) {
	return nil, nil
}

func (m *MockSamplesRepository) GetSampleByOrgCodeAndSubmitterSampleId(_ context.Context, organizationCode string, submitterSampleId string) (*types.Sample, error) {
	if m.GetSampleByOrgCodeAndSubmitterSampleIdFunc != nil {
		return m.GetSampleByOrgCodeAndSubmitterSampleIdFunc(organizationCode, submitterSampleId)
	}
	return nil, nil
}

func (m *MockSamplesRepository) CreateSample(_ context.Context, newSample *types.Sample) (*types.Sample, error) {
	if m.CreateSampleFunc != nil {
		return m.CreateSampleFunc(newSample)
	}
	return nil, nil
}

func (m *MockSamplesRepository) UpdateSample(_ context.Context, sample *types.Sample) error {
	m.UpdatedSamples = append(m.UpdatedSamples, *sample)
	if m.UpdateSampleFunc != nil {
		return m.UpdateSampleFunc(sample)
	}
	return nil
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

func (m *MockValueSetRepository) GetCodes(_ context.Context, vsType repository.ValueSetType) ([]string, error) {
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
	mockContext := &batchval.BatchValidationContext{ValueSetsRepo: mockValueSetRepo}
	rec := SampleValidationRecord{
		BaseValidationRecord: batchval.BaseValidationRecord{Context: mockContext, Cache: batchval.NewBatchValidationCache(mockContext)},
		Sample:               sample,
	}
	err := rec.validateTypeCode(t.Context())
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
	mockContext := &batchval.BatchValidationContext{ValueSetsRepo: mockValueSetRepo}
	rec := SampleValidationRecord{
		BaseValidationRecord: batchval.BaseValidationRecord{Context: mockContext, Cache: batchval.NewBatchValidationCache(mockContext)},
		Sample:               sample,
	}
	err := rec.validateTypeCode(t.Context())
	assert.NoError(t, err)
	assert.Len(t, rec.Errors, 1)
	assert.Equal(t, SampleInvalidValueCode, rec.Errors[0].Code)
	assert.Equal(t, rec.Errors[0].Message, "Invalid field type_code for sample (CHUSJ / S1). Reason: \"invalid_type\" is not a valid type code. Valid values [blood, dna].")
}

func Test_ValidateHistologyTypeCode_Valid(t *testing.T) {
	sample := types.SampleBatch{SampleOrganizationCode: "CHUSJ", SubmitterSampleId: "S1", TypeCode: "blood", HistologyCode: "normal"}
	mockContext := &batchval.BatchValidationContext{ValueSetsRepo: &MockValueSetRepository{}}
	rec := SampleValidationRecord{
		BaseValidationRecord: batchval.BaseValidationRecord{Context: mockContext, Cache: batchval.NewBatchValidationCache(mockContext)},
		Sample:               sample,
	}
	err := rec.validateHistologyCode(t.Context())
	assert.NoError(t, err)
	assert.Empty(t, rec.Errors)
}

func Test_ValidateHistologyTypeCode_Invalid(t *testing.T) {
	sample := types.SampleBatch{SampleOrganizationCode: "CHUSJ", SubmitterSampleId: "S1", TypeCode: "blood", HistologyCode: "invalid_histology"}
	mockContext := &batchval.BatchValidationContext{ValueSetsRepo: &MockValueSetRepository{}}
	rec := SampleValidationRecord{
		BaseValidationRecord: batchval.BaseValidationRecord{Context: mockContext, Cache: batchval.NewBatchValidationCache(mockContext)},
		Sample:               sample,
	}
	err := rec.validateHistologyCode(t.Context())
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
	org := &types.Organization{Code: "CHUSJ", TenantCode: types.DefaultTenantCode}
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
		GetSampleByOrgCodeAndSubmitterSampleIdFunc: func(orgCode, sampleId string) (*types.Sample, error) {
			if orgCode == "CHUSJ" {
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
	cache := batchval.NewBatchValidationCache(mockContext)

	samples := []types.SampleBatch{
		{SubmitterSampleId: "S1", SampleOrganizationCode: "CHUSJ", PatientOrganizationCode: "CHUSJ", SubmitterPatientId: "P1", TypeCode: "dna", HistologyCode: "normal"},                                           // 1. Valid new sample
		{SubmitterSampleId: "S2", SampleOrganizationCode: "CHUSJ", PatientOrganizationCode: "CHUSJ", SubmitterPatientId: "P1", TypeCode: "dna", HistologyCode: "normal"},                                           // 2. Conflict with DB
		{SubmitterSampleId: "S3", SampleOrganizationCode: "CHUSJ", PatientOrganizationCode: "CHUSJ", SubmitterPatientId: "P1", TypeCode: "dna", SubmitterParentSampleId: "P-BATCH", HistologyCode: "normal"},       // 3. Parent in batch
		{SubmitterSampleId: "S4", SampleOrganizationCode: "CHUSJ", PatientOrganizationCode: "CHUSJ", SubmitterPatientId: "P1", TypeCode: "dna", SubmitterParentSampleId: "P-DB", HistologyCode: "normal"},          // 4. Parent in DB
		{SubmitterSampleId: "S5", SampleOrganizationCode: "CHUSJ", PatientOrganizationCode: "CHUSJ", SubmitterPatientId: "P1", TypeCode: "dna", SubmitterParentSampleId: "P-NONE", HistologyCode: "normal"},        // 5. Parent not found
		{SubmitterSampleId: "P-BATCH", SampleOrganizationCode: "CHUSJ", PatientOrganizationCode: "CHUSJ", SubmitterPatientId: "P1", TypeCode: "dna", SubmitterParentSampleId: "P-BATCH2", HistologyCode: "normal"}, // 6. The parent for S3
		{SubmitterSampleId: "P-BATCH2", SampleOrganizationCode: "CHUSJ", PatientOrganizationCode: "CHUSJ", SubmitterPatientId: "P1", TypeCode: "dna", HistologyCode: "normal"},                                     // 7. The grandparent for S3
	}

	records, err := validateSamplesBatch(t.Context(), mockContext, cache, samples)
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

func Test_ValidateExistingSampleForUpdate_Nil(t *testing.T) {
	sample := types.SampleBatch{SampleOrganizationCode: "CHUSJ", SubmitterSampleId: "S1"}
	rec := SampleValidationRecord{Sample: sample}
	rec.validateExistingSampleForUpdate(nil)
	assert.True(t, rec.Skipped)
	assert.Len(t, rec.Errors, 1)
	assert.Equal(t, SampleNotExistForUpdateCode, rec.Errors[0].Code)
	assert.Contains(t, rec.Errors[0].Message, "does not exist, cannot update")
}

func Test_ValidateExistingSampleForUpdate_Found(t *testing.T) {
	sample := types.SampleBatch{SampleOrganizationCode: "CHUSJ", SubmitterSampleId: "S1"}
	rec := SampleValidationRecord{Sample: sample}
	rec.validateExistingSampleForUpdate(&types.Sample{ID: 1})
	assert.False(t, rec.Skipped)
	assert.Empty(t, rec.Errors)
}

func Test_ValidateUpdateSamplesBatch_MissingSampleReportsError(t *testing.T) {
	org := &types.Organization{Code: "CHUSJ", TenantCode: types.DefaultTenantCode}
	patient := &types.Patient{ID: 10, SubmitterPatientId: "P1"}
	mockOrgRepo := &MockOrganizationRepository{
		GetOrganizationByCodeFunc: func(code string) (*types.Organization, error) {
			return org, nil
		},
	}
	mockPatientRepo := &MockPatientsRepository{
		GetPatientByOrgCodeAndSubmitterPatientIdFunc: func(orgCode, submitterPatientId string) (*types.Patient, error) {
			return patient, nil
		},
	}
	mockSampleRepo := &MockSamplesRepository{
		GetSampleByOrgCodeAndSubmitterSampleIdFunc: func(orgCode, sampleId string) (*types.Sample, error) {
			return nil, nil
		},
	}
	mockContext := &batchval.BatchValidationContext{
		OrgRepo:       mockOrgRepo,
		PatientRepo:   mockPatientRepo,
		SampleRepo:    mockSampleRepo,
		ValueSetsRepo: &MockValueSetRepository{},
	}
	cache := batchval.NewBatchValidationCache(mockContext)

	samples := []types.SampleBatch{
		{SubmitterSampleId: "S-MISSING", SampleOrganizationCode: "CHUSJ", PatientOrganizationCode: "CHUSJ", SubmitterPatientId: "P1", TypeCode: "dna", HistologyCode: "normal"},
	}

	records, err := validateUpdateSamplesBatch(t.Context(), mockContext, cache, samples)
	assert.NoError(t, err)
	require.Len(t, records, 1)
	assert.True(t, records[0].Skipped)
	assert.Len(t, records[0].Errors, 1)
	assert.Equal(t, SampleNotExistForUpdateCode, records[0].Errors[0].Code)
}

func Test_ValidateUpdateSamplesBatch_ExistingSampleNotSkipped(t *testing.T) {
	org := &types.Organization{Code: "CHUSJ", TenantCode: types.DefaultTenantCode}
	patient := &types.Patient{ID: 10, SubmitterPatientId: "P1"}
	existingSample := &types.Sample{ID: 5, SubmitterSampleId: "S-EXISTING", TypeCode: "blood", PatientID: 10, HistologyCode: "normal"}
	mockOrgRepo := &MockOrganizationRepository{
		GetOrganizationByCodeFunc: func(code string) (*types.Organization, error) {
			return org, nil
		},
	}
	mockPatientRepo := &MockPatientsRepository{
		GetPatientByOrgCodeAndSubmitterPatientIdFunc: func(orgCode, submitterPatientId string) (*types.Patient, error) {
			return patient, nil
		},
	}
	mockSampleRepo := &MockSamplesRepository{
		GetSampleByOrgCodeAndSubmitterSampleIdFunc: func(orgCode, sampleId string) (*types.Sample, error) {
			if sampleId == "S-EXISTING" {
				return existingSample, nil
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
	cache := batchval.NewBatchValidationCache(mockContext)

	samples := []types.SampleBatch{
		{SubmitterSampleId: "S-EXISTING", SampleOrganizationCode: "CHUSJ", PatientOrganizationCode: "CHUSJ", SubmitterPatientId: "P1", TypeCode: "dna", HistologyCode: "normal"},
	}

	records, err := validateUpdateSamplesBatch(t.Context(), mockContext, cache, samples)
	assert.NoError(t, err)
	require.Len(t, records, 1)
	assert.False(t, records[0].Skipped)
	assert.Empty(t, records[0].Errors)
}

func Test_ValidateUpdateSamplesBatch_MissingParentSampleReportsError(t *testing.T) {
	org := &types.Organization{Code: "CHUSJ", TenantCode: types.DefaultTenantCode}
	patient := &types.Patient{ID: 10, SubmitterPatientId: "P1"}
	existingSample := &types.Sample{ID: 5, SubmitterSampleId: "S-EXISTING", TypeCode: "dna", PatientID: 10, HistologyCode: "normal"}
	mockOrgRepo := &MockOrganizationRepository{
		GetOrganizationByCodeFunc: func(code string) (*types.Organization, error) {
			return org, nil
		},
	}
	mockPatientRepo := &MockPatientsRepository{
		GetPatientByOrgCodeAndSubmitterPatientIdFunc: func(orgCode, submitterPatientId string) (*types.Patient, error) {
			return patient, nil
		},
	}
	mockSampleRepo := &MockSamplesRepository{
		GetSampleByOrgCodeAndSubmitterSampleIdFunc: func(orgCode, sampleId string) (*types.Sample, error) {
			if sampleId == "S-EXISTING" {
				return existingSample, nil
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
	cache := batchval.NewBatchValidationCache(mockContext)

	samples := []types.SampleBatch{
		{SubmitterSampleId: "S-EXISTING", SampleOrganizationCode: "CHUSJ", PatientOrganizationCode: "CHUSJ", SubmitterPatientId: "P1", TypeCode: "dna", HistologyCode: "normal", SubmitterParentSampleId: "P-MISSING"},
	}

	records, err := validateUpdateSamplesBatch(t.Context(), mockContext, cache, samples)
	assert.NoError(t, err)
	require.Len(t, records, 1)
	assert.False(t, records[0].Skipped)
	require.Len(t, records[0].Errors, 1)
	assert.Equal(t, SampleUnknownParentSubmitterSampleIdCode, records[0].Errors[0].Code)
}

func Test_UpdateSampleRecords_SkipsMissingRecords(t *testing.T) {
	mockRepo := &MockSamplesRepository{}
	records := []*SampleValidationRecord{
		{Sample: types.SampleBatch{SubmitterSampleId: "S1"}, OrganizationCode: "CHUSJ", BaseValidationRecord: batchval.BaseValidationRecord{Skipped: false}},
		{Sample: types.SampleBatch{SubmitterSampleId: "S2"}, OrganizationCode: "CHUSJ", BaseValidationRecord: batchval.BaseValidationRecord{Skipped: true}},
	}

	err := updateSampleRecords(t.Context(), records, mockRepo, types.DefaultTenantCode)
	assert.NoError(t, err)
	require.Len(t, mockRepo.UpdatedSamples, 1)
	assert.Equal(t, "S1", mockRepo.UpdatedSamples[0].SubmitterSampleId)
}

func Test_Persist_Batch_And_Update_Sample_Records(t *testing.T) {
	// ExclusivePostgres: writes directly into "sample" (id >= 1000), a table other parallel
	// WritePostgres tests may bulk-clean concurrently — see setup_postgres.go cleanUp.
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		db := env.Postgres
		require.NoError(t, db.Exec(`
			INSERT INTO sample (id, type_code, tissue_site, histology_code, submitter_sample_id, patient_id, organization_code, tenant_code)
			VALUES (1001, 'blood', NULL, 'normal', 'S-WORKER-UPDATE-1', 1, 'CQGC', 'radiant')
		`).Error)

		var id string
		require.NoError(t, db.Raw(`
			INSERT INTO batch (payload, status, batch_type, dry_run, username, created_on, tenant_code)
			VALUES (?, 'RUNNING', ?, false, 'user999', '2025-10-09', 'radiant')
			RETURNING id;
		`, "{}", types.UpdateSampleBatchType).Scan(&id).Error)

		batch := types.Batch{
			ID:        id,
			BatchType: types.UpdateSampleBatchType,
			Payload:   "[]",
			Status:    types.BatchStatusSuccess,
			DryRun:    false,
		}
		records := []*SampleValidationRecord{{
			Sample: types.SampleBatch{
				SubmitterSampleId: "S-WORKER-UPDATE-1",
				TypeCode:          "dna",
				HistologyCode:     "tumoral",
			},
			OrganizationCode: "CQGC",
			PatientId:        2,
		}}

		err := persistBatchAndUpdateSampleRecords(t.Context(), db, &batch, records)
		require.NoError(t, err)

		repo := repository.NewSamplesRepository(db)
		sample, err := repo.GetSampleByOrgCodeAndSubmitterSampleId(t.Context(), "CQGC", "S-WORKER-UPDATE-1")
		require.NoError(t, err)
		require.NotNil(t, sample)
		assert.Equal(t, "dna", sample.TypeCode)
		assert.Equal(t, "tumoral", sample.HistologyCode)
		assert.Equal(t, 2, sample.PatientID)
	})
}
