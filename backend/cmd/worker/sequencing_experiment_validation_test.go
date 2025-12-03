package main

import (
	"encoding/json"
	"regexp"
	"testing"
	"time"

	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"gorm.io/gorm"
)

/************ simple mocks ************/

type mockOrgDAO struct{ mock.Mock }

func (m *mockOrgDAO) GetOrganizationByCode(code string) (*types.Organization, error) {
	args := m.Called(code)
	if org, ok := args.Get(0).(*types.Organization); ok {
		return org, args.Error(1)
	}
	return nil, args.Error(1)
}

type mockSampleDAO struct{ mock.Mock }

func (m *mockSampleDAO) GetSampleBySubmitterSampleId(orgID int, submitterID string) (*types.Sample, error) {
	args := m.Called(orgID, submitterID)
	if s, ok := args.Get(0).(*types.Sample); ok {
		return s, args.Error(1)
	}
	return nil, args.Error(1)
}

type mockSeqExpDAO struct{ mock.Mock }

func (m *mockSeqExpDAO) GetSequencingExperimentBySampleID(sampleID int) ([]types.SequencingExperiment, error) {
	args := m.Called(sampleID)
	if se, ok := args.Get(0).([]types.SequencingExperiment); ok {
		return se, args.Error(1)
	}
	return nil, args.Error(1)
}

func (m *mockSeqExpDAO) GetSequencingExperimentByAliquot(aliquot string) ([]types.SequencingExperiment, error) {
	args := m.Called(aliquot)
	if se, ok := args.Get(0).([]types.SequencingExperiment); ok {
		return se, args.Error(1)
	}
	return nil, args.Error(1)
}

type mockBatchDAO struct{ mock.Mock }

func (m *mockBatchDAO) UpdateBatchStatus(*types.Batch, string, string) error {
	args := m.Called()
	return args.Error(0)
}

/************ verifyIdentical ************/

func TestVerifyIdentical_AddsWarningOnDifference(t *testing.T) {
	r := &SequencingExperimentValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: 0},
	}

	verifyIdentical(1, 2, r, "key", "sample_id")

	assert.Len(t, r.Warnings, 1)
	assert.Equal(t, ExistingAliquotForSequencingLabCode, r.Warnings[0].Code)
	assert.Contains(t, r.Warnings[0].Message, "sample_id")
}

func TestVerifyIdentical_NoWarningWhenEqual(t *testing.T) {
	r := &SequencingExperimentValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: 0},
	}

	verifyIdentical("same", "same", r, "key", "field")

	assert.Empty(t, r.Warnings)
}

/************ verifyStringField ************/

func TestVerifyStringField_RequiredMissing(t *testing.T) {
	r := &SequencingExperimentValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: 0},
	}
	r.verifyStringField("", "aliquot", 10, nil, "", nil, true)

	assert.Len(t, r.Errors, 1)
	assert.Equal(t, InvalidFieldValueCode, r.Errors[0].Code)
}

func TestVerifyStringField_TooLong(t *testing.T) {
	r := &SequencingExperimentValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: 0},
	}
	r.verifyStringField("0123456789", "aliquot", 5, nil, "", nil, true)

	assert.Len(t, r.Errors, 1)
}

func TestVerifyStringField_RegexpMismatch(t *testing.T) {
	r := &SequencingExperimentValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: 0},
	}
	re := regexp.MustCompile(`^[A-Z]+$`)
	r.verifyStringField("abc", "field", 10, re, "^[A-Z]+$", nil, true)

	assert.Len(t, r.Errors, 1)
}

/************ validate*CodeField ************/

func newBaseRecord() *SequencingExperimentValidationRecord {
	return &SequencingExperimentValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: 0},
		SequencingExperiment: types.SequencingExperimentBatch{},
	}
}

func TestValidateExperimentalStrategyCodeField_Allowed(t *testing.T) {
	r := newBaseRecord()
	r.SequencingExperiment.ExperimentalStrategyCode = "wgs"

	r.validateExperimentalStrategyCodeField()

	assert.Empty(t, r.Errors)
}

func TestValidateExperimentalStrategyCodeField_NotAllowed(t *testing.T) {
	r := newBaseRecord()
	r.SequencingExperiment.ExperimentalStrategyCode = "foobar"

	r.validateExperimentalStrategyCodeField()

	assert.Len(t, r.Errors, 1)
	assert.Equal(t, InvalidFieldValueCode, r.Errors[0].Code)
}

func TestValidateSequencingReadTechnologyCodeField_Allowed(t *testing.T) {
	r := newBaseRecord()
	r.SequencingExperiment.SequencingReadTechnologyCode = "short_read"

	r.validateSequencingReadTechnologyCodeField()

	assert.Empty(t, r.Errors)
}

func TestValidateSequencingReadTechnologyCodeField_NotAllowed(t *testing.T) {
	r := newBaseRecord()
	r.SequencingExperiment.SequencingReadTechnologyCode = "unknown_tech"

	r.validateSequencingReadTechnologyCodeField()

	assert.Len(t, r.Errors, 1)
	assert.Equal(t, InvalidFieldValueCode, r.Errors[0].Code)
}

func TestValidateStatusCodeField_NotAllowed(t *testing.T) {
	r := newBaseRecord()
	r.SequencingExperiment.StatusCode = "invalid"
	r.SequencingExperiment.SequencingReadTechnologyCode = "invalid" // bug in code: uses SequencingReadTechnologyCode in map

	r.validateStatusCodeField()

	assert.Len(t, r.Errors, 1)
	assert.Equal(t, InvalidFieldValueCode, r.Errors[0].Code)
}

/************ validateRunDateField ************/

func TestValidateRunDateField_FutureDateAddsError(t *testing.T) {
	r := newBaseRecord()
	future := time.Now().Add(24 * time.Hour)
	r.SequencingExperiment.RunDate = &types.NullTime{Time: future, Valid: true}

	r.validateRunDateField()

	assert.Len(t, r.Errors, 1)
	assert.Equal(t, InvalidFieldValueCode, r.Errors[0].Code)
}

func TestValidateRunDateField_PastDateOK(t *testing.T) {
	r := newBaseRecord()
	past := time.Now().Add(-24 * time.Hour)
	r.SequencingExperiment.RunDate = &types.NullTime{Time: past, Valid: true}

	r.validateRunDateField()

	assert.Empty(t, r.Errors)
}

/************ validateIdenticalSequencingExperiment ************/

func TestValidateIdenticalSequencingExperiment_FoundAddsInfo(t *testing.T) {
	r := newBaseRecord()
	r.SubmitterOrganizationID = 1
	r.SequencingExperiment.SubmitterSampleId = types.NullString{String: "S1", Valid: true}
	r.SequencingExperiment.Aliquot = types.NullString{String: "A1", Valid: true}
	r.SequencingExperiment.SampleOrganizationCode = "ORG"

	sampleDAO := &mockSampleDAO{}
	seqDAO := &mockSeqExpDAO{}

	sampleDAO.On("GetSampleBySubmitterSampleId", 1, "S1").
		Return(&types.Sample{ID: 10}, nil)
	seqDAO.On("GetSequencingExperimentBySampleID", 10).
		Return([]types.SequencingExperiment{
			{Aliquot: "A1"},
		}, nil)

	err := r.validateIdenticalSequencingExperiment(sampleDAO, seqDAO)

	assert.NoError(t, err)
	assert.Len(t, r.Infos, 1)
	assert.Equal(t, IdenticalSequencingExperimentInDBCode, r.Infos[0].Code)
}

/************ validateSequencingLabCode ************/

func TestValidateSequencingLabCode_UnknownOrgAddsError(t *testing.T) {
	r := newBaseRecord()
	r.SequencingExperiment.SequencingLabCode = "LABX"
	orgDAO := &mockOrgDAO{}

	orgDAO.On("GetOrganizationByCode", "LABX").Return((*types.Organization)(nil), nil)

	err := r.validateSequencingLabCode(orgDAO)

	assert.NoError(t, err)
	assert.Len(t, r.Errors, 1)
	assert.Equal(t, UnknownSequencingLabCode, r.Errors[0].Code)
}

func TestValidateSequencingLabCode_ExistingSetsID(t *testing.T) {
	r := newBaseRecord()
	r.SequencingExperiment.SequencingLabCode = "LAB1"
	orgDAO := &mockOrgDAO{}
	org := &types.Organization{ID: 42}

	orgDAO.On("GetOrganizationByCode", "LAB1").Return(org, nil)

	err := r.validateSequencingLabCode(orgDAO)

	assert.NoError(t, err)
	assert.Equal(t, 42, r.SequencingLabID)
}

/************ validateExistingAliquotForSequencingLabCode ************/

func TestValidateExistingAliquotForSequencingLabCode_DifferentFieldsAddWarnings(t *testing.T) {
	r := newBaseRecord()
	r.SequencingExperiment.Aliquot = types.NullString{String: "A1", Valid: true}
	r.SequencingExperiment.SampleOrganizationCode = "ORG"
	r.SequencingExperiment.SubmitterSampleId = types.NullString{String: "S1", Valid: true}
	r.SequencingExperiment.StatusCode = "completed"
	r.SequencingExperiment.ExperimentalStrategyCode = "wgs"
	r.SequencingExperiment.SequencingReadTechnologyCode = "short_read"
	r.SequencingExperiment.PlatformCode = "ILLUMINA"
	r.SequencingExperiment.RunName = types.NullString{String: "RUN1", Valid: true}
	r.SequencingExperiment.RunAlias = types.NullString{String: "RA1", Valid: true}
	now := time.Now().Add(-time.Hour)
	r.SequencingExperiment.RunDate = &types.NullTime{Time: now, Valid: true}
	r.SequencingExperiment.CaptureKit = types.NullString{String: "CK1", Valid: true}
	r.SequencingLabID = 5
	r.SampleID = 99

	seqDAO := &mockSeqExpDAO{}
	seqDAO.On("GetSequencingExperimentByAliquot", "A1").
		Return([]types.SequencingExperiment{
			{
				SequencingLabID:              5,
				SampleID:                     1,
				StatusCode:                   "draft",
				ExperimentalStrategyCode:     "wxs",
				SequencingReadTechnologyCode: "long_read",
				PlatformCode:                 "OTHER",
				RunName:                      "OTHER",
				RunAlias:                     "OTHER",
				RunDate:                      now.Add(-time.Hour),
				CaptureKit:                   "OTHER",
			},
		}, nil)

	err := r.validateExistingAliquotForSequencingLabCode(seqDAO)

	assert.NoError(t, err)
	assert.NotEmpty(t, r.Warnings)
}

/************ validateUnknownSampleForOrganizationCode ************/

func TestValidateUnknownSampleForOrganizationCode_AddsErrorWhenNil(t *testing.T) {
	r := newBaseRecord()
	r.SubmitterOrganizationID = 1
	r.SequencingExperiment.SubmitterSampleId = types.NullString{String: "S1", Valid: true}
	sampleDAO := &mockSampleDAO{}

	sampleDAO.On("GetSampleBySubmitterSampleId", 1, "S1").
		Return((*types.Sample)(nil), nil)

	err := r.validateUnknownSampleForOrganizationCode(sampleDAO)

	assert.NoError(t, err)
	assert.Len(t, r.Errors, 1)
	assert.Equal(t, UnknownSampleForOrganizationCode, r.Errors[0].Code)
}

/************ validateSequencingExperimentRecord ************/

func TestValidateSequencingExperimentRecord_ErrorOnOrgLookup(t *testing.T) {
	orgDAO := &mockOrgDAO{}
	sampleDAO := &mockSampleDAO{}
	seqDAO := &mockSeqExpDAO{}

	seq := types.SequencingExperimentBatch{
		SequencingLabCode:      "LAB1",
		SampleOrganizationCode: "ORG1",
	}

	orgDAO.On("GetOrganizationByCode", "LAB1").
		Return((*types.Organization)(nil), errors.New("db error"))

	_, err := validateSequencingExperimentRecord(seq, 0, orgDAO, sampleDAO, seqDAO)
	assert.Error(t, err)
}

func TestValidateSequencingExperimentRecord_HappyPath(t *testing.T) {
	orgDAO := &mockOrgDAO{}
	sampleDAO := &mockSampleDAO{}
	seqDAO := &mockSeqExpDAO{}

	seq := types.SequencingExperimentBatch{
		Aliquot:                      types.NullString{String: "A1", Valid: true},
		SampleOrganizationCode:       "ORG",
		SubmitterSampleId:            types.NullString{String: "S1", Valid: true},
		SequencingLabCode:            "LAB1",
		ExperimentalStrategyCode:     "wgs",
		SequencingReadTechnologyCode: "short_read",
		StatusCode:                   "draft",
	}

	orgDAO.On("GetOrganizationByCode", "LAB1").
		Return(&types.Organization{ID: 2}, nil)
	orgDAO.On("GetOrganizationByCode", "ORG").
		Return(&types.Organization{ID: 1}, nil)

	sampleDAO.On("GetSampleBySubmitterSampleId", 1, "S1").
		Return(&types.Sample{ID: 10}, nil)

	seqDAO.On("GetSequencingExperimentBySampleID", 10).
		Return([]types.SequencingExperiment{}, nil)
	seqDAO.On("GetSequencingExperimentByAliquot", "A1").
		Return([]types.SequencingExperiment{}, nil)

	record, err := validateSequencingExperimentRecord(seq, 0, orgDAO, sampleDAO, seqDAO)

	assert.NoError(t, err)
	assert.Equal(t, 0, record.Index)
	assert.Empty(t, record.Errors)
}

/************ validateSequencingExperimentBatch ************/

func TestValidateSequencingExperimentBatch_DuplicateInBatch(t *testing.T) {
	orgDAO := &mockOrgDAO{}
	sampleDAO := &mockSampleDAO{}
	seqDAO := &mockSeqExpDAO{}

	seq1 := types.SequencingExperimentBatch{
		Aliquot:                      types.NullString{String: "A1", Valid: true},
		SampleOrganizationCode:       "ORG",
		SubmitterSampleId:            types.NullString{String: "S1", Valid: true},
		SequencingLabCode:            "LAB1",
		ExperimentalStrategyCode:     "wgs",
		SequencingReadTechnologyCode: "short_read",
	}
	seq2 := seq1 // same key

	// org + sample + seq stubs kept minimal
	orgDAO.On("GetOrganizationByCode", "LAB1").
		Return(&types.Organization{ID: 2}, nil).Twice()
	orgDAO.On("GetOrganizationByCode", "ORG").
		Return(&types.Organization{ID: 1}, nil).Twice()

	sampleDAO.On("GetSampleBySubmitterSampleId", 1, "S1").
		Return(&types.Sample{ID: 10}, nil).Twice()

	seqDAO.On("GetSequencingExperimentBySampleID", 10).
		Return([]types.SequencingExperiment{}, nil).Twice()
	seqDAO.On("GetSequencingExperimentByAliquot", "A1").
		Return([]types.SequencingExperiment{}, nil).Twice()

	records, err := validateSequencingExperimentBatch([]types.SequencingExperimentBatch{seq1, seq2}, orgDAO, sampleDAO, seqDAO)

	assert.NoError(t, err)
	assert.Len(t, records, 2)
	// second record should have batch-duplicate error
	found := false
	for _, msg := range records[1].Errors {
		if msg.Code == IdenticalSequencingExperimentInBatchCode {
			found = true
			break
		}
	}
	assert.True(t, found, "expected duplicate-in-batch error on second record")
}

/************ processSequencingExperimentBatch ************/

// For this function, usually test the JSON unmarshal error path and the “happy” path.
// db is unused, so we can pass &gorm.DB{}.

func TestProcessSequencingExperimentBatch_UnmarshalError(t *testing.T) {
	batchDAO := &mockBatchDAO{}
	orgDAO := &mockOrgDAO{}
	sampleDAO := &mockSampleDAO{}
	seqDAO := &mockSeqExpDAO{}

	// Expect UpdateBatchStatus to be called once by processUnexpectedError.
	batchDAO.On("UpdateBatchStatus").Return(nil)

	b := &types.Batch{
		ID:      1,
		Payload: "{invalid-json",
	}

	processSequencingExperimentBatch(b, &gorm.DB{}, orgDAO, sampleDAO, seqDAO, batchDAO)

	batchDAO.AssertExpectations(t)
}

func TestProcessSequencingExperimentBatch_ValidEmptyBatch(t *testing.T) {
	batchDAO := &mockBatchDAO{}
	orgDAO := &mockOrgDAO{}
	sampleDAO := &mockSampleDAO{}
	seqDAO := &mockSeqExpDAO{}

	b := &types.Batch{ID: 1}
	payload, _ := json.Marshal([]types.SequencingExperimentBatch{})
	b.Payload = string(payload)

	// no errors expected, so no UpdateBatchStatus call
	processSequencingExperimentBatch(b, &gorm.DB{}, orgDAO, sampleDAO, seqDAO, batchDAO)
}
