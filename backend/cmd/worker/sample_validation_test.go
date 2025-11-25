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

// MockSamplesRepository is a manual mock for the SamplesRepositoryDAO interface.
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
	sample := types.SampleBatch{
		SubmitterOrganizationCode: "CHUSJ",
		SubmitterSampleId:         "S1",
		TissueSite:                longString,
	}
	rec := SampleValidationRecord{Sample: sample}
	rec.validateFieldLength("tissue_site", sample.TissueSite)

	assert.Len(t, rec.Errors, 1)
	assert.Equal(t, SampleInvalidValueCode, rec.Errors[0].Code)
	assert.Contains(t, rec.Errors[0].Message, "field is too long")
	assert.Equal(t, "sample[0].tissue_site", rec.Errors[0].Path)
}

func Test_SampleField_Valid_Length(t *testing.T) {
	validString := "some-tissue-site"
	sample := types.SampleBatch{
		SubmitterOrganizationCode: "CHUSJ",
		SubmitterSampleId:         "S1",
		TissueSite:                validString,
	}
	rec := SampleValidationRecord{Sample: sample}
	rec.validateFieldLength("tissue_site", sample.TissueSite)

	assert.Nil(t, rec.Errors)
}

func Test_SampleField_Empty(t *testing.T) {
	sample := types.SampleBatch{
		SubmitterOrganizationCode: "CHUSJ",
		SubmitterSampleId:         "S1",
		TissueSite:                "",
	}
	rec := SampleValidationRecord{Sample: sample}
	rec.validateFieldLength("tissue_site", sample.TissueSite)

	assert.Nil(t, rec.Errors)
}

func Test_ValidateExistingSampleInDb_Nil(t *testing.T) {
	rec := SampleValidationRecord{}
	rec.validateExistingSampleInDb(nil)
	assert.False(t, rec.Skipped)
	assert.Nil(t, rec.Infos)
	assert.Nil(t, rec.Warnings)
}

func Test_ValidateExistingSampleInDb_SameValues(t *testing.T) {
	sample := types.SampleBatch{
		SubmitterOrganizationCode: "CHUSJ",
		SubmitterSampleId:         "S1",
		TypeCode:                  "tumoral",
		TissueSite:                "dna",
		HistologyCode:             "8041/3",
	}
	existing := &types.Sample{
		TypeCode:          "tumoral",
		TissueType:        "dna",
		HistologyTypeCode: "8041/3",
	}
	rec := SampleValidationRecord{Sample: sample}
	rec.validateExistingSampleInDb(existing)

	assert.True(t, rec.Skipped)
	assert.Len(t, rec.Infos, 1)
	assert.Equal(t, SampleAlreadyExistCode, rec.Infos[0].Code)
	assert.Nil(t, rec.Warnings)
}

func Test_ValidateExistingSampleInDb_DifferentValues(t *testing.T) {
	sample := types.SampleBatch{
		SubmitterOrganizationCode: "CHUSJ",
		SubmitterSampleId:         "S1",
		TypeCode:                  "normal",
		TissueSite:                "blood",
		HistologyCode:             "9000/0",
	}
	existing := &types.Sample{
		TypeCode:          "tumoral",
		TissueType:        "dna",
		HistologyTypeCode: "8041/3",
	}
	rec := SampleValidationRecord{Sample: sample}
	rec.validateExistingSampleInDb(existing)

	assert.True(t, rec.Skipped)
	assert.Len(t, rec.Infos, 1)
	assert.Len(t, rec.Warnings, 3)
	for _, w := range rec.Warnings {
		assert.Equal(t, SampleExistingSampleDifferentFieldCode, w.Code)
	}
}

func Test_ValidateExistingSampleInBatch_SameValues(t *testing.T) {
	sample := types.SampleBatch{
		SubmitterOrganizationCode: "CHUSJ",
		SubmitterSampleId:         "S1",
		TypeCode:                  "tumoral",
		TissueSite:                "dna",
		HistologyCode:             "8041/3",
	}
	existing := &types.SampleBatch{
		TypeCode:      "tumoral",
		TissueSite:    "dna",
		HistologyCode: "8041/3",
	}
	rec := SampleValidationRecord{Sample: sample}
	rec.validateExistingSampleInBatch(existing)

	assert.True(t, rec.Skipped)
	assert.Len(t, rec.Infos, 1)
	assert.Equal(t, SampleAlreadyExistCode, rec.Infos[0].Code)
	assert.Nil(t, rec.Warnings)
}

func Test_ValidateExistingSampleInBatch_DifferentValues(t *testing.T) {
	sample := types.SampleBatch{
		SubmitterOrganizationCode: "CHUSJ",
		SubmitterSampleId:         "S1",
		TypeCode:                  "normal",
		TissueSite:                "blood",
		HistologyCode:             "9000/0",
	}
	existing := &types.SampleBatch{
		TypeCode:      "tumoral",
		TissueSite:    "dna",
		HistologyCode: "8041/3",
	}
	rec := SampleValidationRecord{Sample: sample}
	rec.validateExistingSampleInBatch(existing)

	assert.True(t, rec.Skipped)
	assert.Len(t, rec.Infos, 1)
	assert.Len(t, rec.Warnings, 3)
	for _, w := range rec.Warnings {
		assert.Equal(t, SampleExistingSampleDifferentFieldCode, w.Code)
	}
}
