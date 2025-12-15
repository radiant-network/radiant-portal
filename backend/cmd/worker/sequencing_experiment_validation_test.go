package main

import (
	"regexp"
	"testing"
	"time"

	"github.com/radiant-network/radiant-api/internal/repository"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

type mockOrgDAO struct{ mock.Mock }

func (m *mockOrgDAO) GetOrganizationByCode(code string) (*types.Organization, error) {
	args := m.Called(code)
	if org, ok := args.Get(0).(*types.Organization); ok {
		return org, args.Error(1)
	}
	return nil, args.Error(1)
}

type mockSampleDAO struct{ mock.Mock }

func (m *mockSampleDAO) CreateSample(*types.Sample) (*types.Sample, error) {
	return nil, nil
}

func (m *mockSampleDAO) GetTypeCodes() ([]string, error) {
	return nil, nil
}

func (m *mockSampleDAO) GetSampleBySubmitterSampleId(orgID int, submitterID string) (*types.Sample, error) {
	args := m.Called(orgID, submitterID)
	if s, ok := args.Get(0).(*types.Sample); ok {
		return s, args.Error(1)
	}
	return nil, args.Error(1)
}

type mockSeqExpDAO struct{ mock.Mock }

func (m *mockSeqExpDAO) CreateSequencingExperiment(se *types.SequencingExperiment) error {
	return nil
}

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

func (m *mockBatchDAO) CreateBatch(payload any, batchType string, username string, dryRun bool) (*repository.Batch, error) {
	return nil, nil
}

func (m *mockBatchDAO) UpdateBatch(batch repository.Batch) (int64, error) {
	return 0, nil
}

func (m *mockBatchDAO) GetBatchByID(batchId string) (*repository.Batch, error) {
	return nil, nil
}

func (m *mockBatchDAO) ClaimNextBatch() (*repository.Batch, error) {
	return nil, nil
}

func (m *mockBatchDAO) UpdateBatchStatus(*types.Batch, string, string) error {
	args := m.Called()
	return args.Error(0)
}

func Test_VerifyIdentical_DifferentField_AddsWarning(t *testing.T) {
	r := &SequencingExperimentValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: 0},
	}
	verifyIdenticalField(1, 2, r, "key", "sample_id")
	assert.Len(t, r.Warnings, 1)
	assert.Equal(t, ExistingAliquotForSequencingLabCode, r.Warnings[0].Code)
	assert.Equal(t, "A sequencing with same ids (key) has been found but with a different sample_id (1 <> 2).", r.Warnings[0].Message)
	assert.Equal(t, "sequencing_experiment[0]", r.Warnings[0].Path)
}

func Test_VerifyIdentical_AddsInfo(t *testing.T) {
	r := &SequencingExperimentValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: 0},
	}
	verifyIdenticalField("same", "same", r, "key", "field")
	assert.Empty(t, r.Warnings)
}

func Test_VerifyStringField_RequiredMissing(t *testing.T) {
	r := &SequencingExperimentValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: 0},
	}
	r.verifyStringField("", "aliquot", 10, nil, "", nil, true)
	assert.Len(t, r.Errors, 1)
	assert.Equal(t, InvalidFieldValueCode, r.Errors[0].Code)
	assert.Equal(t, "Invalid field aliquot for sequencing_experiment. Reason: field is missing.", r.Errors[0].Message)
	assert.Equal(t, "sequencing_experiment[0]", r.Errors[0].Path)
}

func Test_VerifyStringField_TooLong(t *testing.T) {
	r := &SequencingExperimentValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: 0},
	}
	r.verifyStringField("0123456789", "aliquot", 5, nil, "", nil, true)
	assert.Len(t, r.Errors, 1)
	assert.Equal(t, InvalidFieldValueCode, r.Errors[0].Code)
	assert.Equal(t, "Invalid field aliquot for sequencing_experiment. Reason: field is too long, maximum length allowed is 5.", r.Errors[0].Message)
	assert.Equal(t, "sequencing_experiment[0]", r.Errors[0].Path)
}

func Test_VerifyStringField_RegexpMismatch(t *testing.T) {
	r := &SequencingExperimentValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: 0},
	}
	re := regexp.MustCompile(`^[A-Z]+$`)
	r.verifyStringField("abc", "mock", 10, re, "^[A-Z]+$", nil, true)
	assert.Len(t, r.Errors, 1)
	assert.Equal(t, InvalidFieldValueCode, r.Errors[0].Code)
	assert.Equal(t, "Invalid field mock for sequencing_experiment. Reason: does not match the regular expression ^[A-Z]+$.", r.Errors[0].Message)
	assert.Equal(t, "sequencing_experiment[0]", r.Errors[0].Path)
}

func newBaseRecord() *SequencingExperimentValidationRecord {
	return &SequencingExperimentValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: 0},
		SequencingExperiment: types.SequencingExperimentBatch{},
	}
}

func Test_ValidateExperimentalStrategyCodeField_Allowed(t *testing.T) {
	r := newBaseRecord()
	r.SequencingExperiment.ExperimentalStrategyCode = "wgs"
	r.validateExperimentalStrategyCodeField()
	assert.Empty(t, r.Errors)
}

func Test_ValidateExperimentalStrategyCodeField_NotAllowed(t *testing.T) {
	r := newBaseRecord()
	r.SequencingExperiment.SampleOrganizationCode = "ORG"
	r.SequencingExperiment.SubmitterSampleId = "S1"
	r.SequencingExperiment.Aliquot = "A1"
	r.SequencingExperiment.ExperimentalStrategyCode = "foobar"
	r.validateExperimentalStrategyCodeField()
	assert.Len(t, r.Errors, 1)
	assert.Equal(t, InvalidFieldValueCode, r.Errors[0].Code)
	assert.Equal(t, "Invalid field experimental_strategy_code for sequencing_experiment (ORG / S1 / A1). Reason: value not allowed.", r.Errors[0].Message)
	assert.Equal(t, "sequencing_experiment[0]", r.Errors[0].Path)
}

func Test_ValidateSequencingReadTechnologyCodeField_Allowed(t *testing.T) {
	r := newBaseRecord()
	r.SequencingExperiment.SequencingReadTechnologyCode = "short_read"
	r.validateSequencingReadTechnologyCodeField()
	assert.Empty(t, r.Errors)
}

func Test_ValidateSequencingReadTechnologyCodeField_NotAllowed(t *testing.T) {
	r := newBaseRecord()
	r.SequencingExperiment.SampleOrganizationCode = "ORG"
	r.SequencingExperiment.SubmitterSampleId = "S1"
	r.SequencingExperiment.Aliquot = "A1"
	r.SequencingExperiment.SequencingReadTechnologyCode = "mini_read"
	r.validateSequencingReadTechnologyCodeField()
	assert.Len(t, r.Errors, 1)
	assert.Equal(t, InvalidFieldValueCode, r.Errors[0].Code)
	assert.Equal(t, "Invalid field sequencing_read_technology_code for sequencing_experiment (ORG / S1 / A1). Reason: value not allowed.", r.Errors[0].Message)
	assert.Equal(t, "sequencing_experiment[0]", r.Errors[0].Path)
}

func Test_ValidateStatusCodeField_Allowed(t *testing.T) {
	r := newBaseRecord()
	r.SequencingExperiment.StatusCode = "in_progress"
	r.validateStatusCodeField()
	assert.Empty(t, r.Errors)
}

func Test_ValidateStatusCodeField_NotAllowed(t *testing.T) {
	r := newBaseRecord()
	r.SequencingExperiment.SampleOrganizationCode = "ORG"
	r.SequencingExperiment.SubmitterSampleId = "S1"
	r.SequencingExperiment.Aliquot = "A1"
	r.SequencingExperiment.StatusCode = "invalid"
	r.validateStatusCodeField()
	assert.Len(t, r.Errors, 1)
	assert.Equal(t, InvalidFieldValueCode, r.Errors[0].Code)
	assert.Equal(t, "Invalid field status_code for sequencing_experiment (ORG / S1 / A1). Reason: value not allowed.", r.Errors[0].Message)
	assert.Equal(t, "sequencing_experiment[0]", r.Errors[0].Path)
}

func Test_ValidateRunDateField_PastDateOK(t *testing.T) {
	r := newBaseRecord()
	past := time.Now().Add(-24 * time.Hour)
	r.SequencingExperiment.RunDate = (*types.DateRFC3339)(&past)
	r.validateRunDateField()
	assert.Empty(t, r.Errors)
}

func Test_ValidateRunDateField_FutureDateAddsError(t *testing.T) {
	r := newBaseRecord()
	future := time.Now().Add(24 * time.Hour)
	r.SequencingExperiment.SampleOrganizationCode = "ORG"
	r.SequencingExperiment.SubmitterSampleId = "S1"
	r.SequencingExperiment.Aliquot = "A1"
	r.SequencingExperiment.RunDate = (*types.DateRFC3339)(&future)
	r.validateRunDateField()
	assert.Len(t, r.Errors, 1)
	assert.Equal(t, InvalidFieldValueCode, r.Errors[0].Code)
	assert.Equal(t, "Invalid field run_date for sequencing_experiment (ORG / S1 / A1). Reason: must be a past date.", r.Errors[0].Message)
	assert.Equal(t, "sequencing_experiment[0]", r.Errors[0].Path)
}

func Test_ValidateIdenticalSequencingExperiment_Found_AddsInfo(t *testing.T) {
	r := newBaseRecord()
	sampleId := 10
	r.SampleID = &sampleId
	r.SequencingExperiment.SubmitterSampleId = "S1"
	r.SequencingExperiment.Aliquot = "A1"
	r.SequencingExperiment.SampleOrganizationCode = "ORG"

	sampleDAO := &mockSampleDAO{}
	seqDAO := &mockSeqExpDAO{}

	sampleDAO.On("GetSampleBySubmitterSampleId", 1, "S1").
		Return(&types.Sample{ID: 10}, nil)
	seqDAO.On("GetSequencingExperimentBySampleID", 10).
		Return([]types.SequencingExperiment{
			{Aliquot: "A1"},
		}, nil)

	err := r.validateIdenticalSequencingExperiment(seqDAO)
	assert.NoError(t, err)
	assert.Len(t, r.Infos, 1)
	assert.Equal(t, IdenticalSequencingExperimentInDBCode, r.Infos[0].Code)
	assert.Equal(t, "Sequencing (ORG / S1 / A1) already exists, skipped.", r.Infos[0].Message)
	assert.Equal(t, "sequencing_experiment[0]", r.Infos[0].Path)
}

func Test_ValidateSequencingLabCode_UnknownOrg_AddsError(t *testing.T) {
	r := newBaseRecord()
	r.SequencingExperiment.SubmitterSampleId = "S1"
	r.SequencingExperiment.Aliquot = "A1"
	r.SequencingExperiment.SampleOrganizationCode = "ORG"
	r.SequencingExperiment.SequencingLabCode = "LABX"
	orgDAO := &mockOrgDAO{}

	orgDAO.On("GetOrganizationByCode", "LABX").Return((*types.Organization)(nil), nil)

	err := r.validateSequencingLabCode()

	assert.NoError(t, err)
	assert.Len(t, r.Errors, 1)
	assert.Equal(t, UnknownSequencingLabCode, r.Errors[0].Code)
	assert.Equal(t, "Sequencing lab LABX for sequencing A1 does not exist.", r.Errors[0].Message)
	assert.Equal(t, "sequencing_experiment[0]", r.Errors[0].Path)
}

func Test_ValidateExistingAliquotForSequencingLabCode_DifferentFields_AddWarnings(t *testing.T) {
	seqLab := 5
	sampleId := 99
	r := newBaseRecord()
	r.SequencingExperiment.Aliquot = "A1"
	r.SequencingExperiment.SampleOrganizationCode = "ORG"
	r.SequencingExperiment.SubmitterSampleId = "S2"
	r.SequencingExperiment.StatusCode = "completed"
	r.SequencingExperiment.ExperimentalStrategyCode = "wgs"
	r.SequencingExperiment.SequencingReadTechnologyCode = "short_read"
	r.SequencingExperiment.PlatformCode = "ILLUMINA"
	r.SequencingExperiment.RunName = "RUN1"
	r.SequencingExperiment.RunAlias = "RA1"
	now := time.Now().Add(-time.Hour)
	r.SequencingExperiment.RunDate = (*types.DateRFC3339)(&now)
	r.SequencingExperiment.CaptureKit = "CK1"
	r.SequencingLabID = &seqLab
	r.SampleID = &sampleId

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
	assert.Empty(t, r.Errors)
	assert.Len(t, r.Warnings, 9)
	assert.Equal(t, ExistingAliquotForSequencingLabCode, r.Warnings[0].Code)
	assert.Equal(t, "A sequencing with same ids (ORG / S2 / A1) has been found but with a different sample_id (1 <> 99).", r.Warnings[0].Message)
	assert.Equal(t, "sequencing_experiment[0]", r.Warnings[0].Path)
	assert.Equal(t, ExistingAliquotForSequencingLabCode, r.Warnings[7].Code)
	assert.Equal(t, "A sequencing with same ids (ORG / S2 / A1) has been found but with a different capture_kit (OTHER <> CK1).", r.Warnings[7].Message)
	assert.Equal(t, "sequencing_experiment[0]", r.Warnings[7].Path)
}

func Test_ValidateUnknownSampleForOrganizationCode_Nil_AddsError(t *testing.T) {
	orgId := 1
	r := newBaseRecord()
	r.SubmitterOrganizationID = &orgId
	r.SequencingExperiment.SampleOrganizationCode = "ORG"
	r.SequencingExperiment.SubmitterSampleId = "S1"
	sampleDAO := &mockSampleDAO{}

	sampleDAO.On("GetSampleBySubmitterSampleId", 1, "S1").
		Return((*types.Sample)(nil), nil)

	err := r.validateUnknownSampleForOrganizationCode()

	assert.NoError(t, err)
	assert.Len(t, r.Errors, 1)
	assert.Equal(t, UnknownSampleForOrganizationCode, r.Errors[0].Code)
	assert.Equal(t, "Sample (ORG / S1) does not exist.", r.Errors[0].Message)
	assert.Equal(t, "sequencing_experiment[0]", r.Errors[0].Path)
}

func Test_ValidateSequencingExperimentRecord_Ok(t *testing.T) {
	orgDAO := &mockOrgDAO{}
	sampleDAO := &mockSampleDAO{}
	seqDAO := &mockSeqExpDAO{}

	seq := types.SequencingExperimentBatch{
		Aliquot:                      "A1",
		SampleOrganizationCode:       "ORG",
		SubmitterSampleId:            "S1",
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
	assert.Equal(t, 10, *record.SampleID)
	assert.Equal(t, 1, *record.SubmitterOrganizationID)
	assert.Equal(t, 2, *record.SequencingLabID)
	assert.Empty(t, record.Errors)
}

func Test_ValidateSequencingExperimentBatch_DuplicateInBatch_AddsError(t *testing.T) {
	orgDAO := &mockOrgDAO{}
	sampleDAO := &mockSampleDAO{}
	seqDAO := &mockSeqExpDAO{}

	seq1 := types.SequencingExperimentBatch{
		Aliquot:                      "A1",
		SampleOrganizationCode:       "ORG",
		SubmitterSampleId:            "S1",
		SequencingLabCode:            "LAB1",
		ExperimentalStrategyCode:     "wgs",
		SequencingReadTechnologyCode: "short_read",
		StatusCode:                   "draft",
	}
	seq2 := seq1

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
	assert.Empty(t, records[0].Errors)
	assert.Equal(t, 1, len(records[1].Errors))
	assert.Equal(t, IdenticalSequencingExperimentInBatchCode, records[1].Errors[0].Code)
	assert.Equal(t, "Sequencing_experiment (ORG / S1 / A1) appears multiple times in the batch.", records[1].Errors[0].Message)
	assert.Equal(t, "sequencing_experiment[1]", records[1].Errors[0].Path)
}

func Test_PreFetchValidationInfo_SetsIDs(t *testing.T) {
	orgDAO := &mockOrgDAO{}
	sampleDAO := &mockSampleDAO{}

	// Input batch record
	r := &SequencingExperimentValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: 0},
		SequencingExperiment: types.SequencingExperimentBatch{
			SampleOrganizationCode: "ORG",
			SubmitterSampleId:      "S1",
			SequencingLabCode:      "LAB1",
		},
	}

	// Mocked orgs and sample
	orgDAO.
		On("GetOrganizationByCode", "ORG").
		Return(&types.Organization{ID: 1}, nil)
	orgDAO.
		On("GetOrganizationByCode", "LAB1").
		Return(&types.Organization{ID: 2}, nil)

	sampleDAO.
		On("GetSampleBySubmitterSampleId", 1, "S1").
		Return(&types.Sample{ID: 10}, nil)

	err := r.preFetchValidationInfo(orgDAO, sampleDAO)

	assert.NoError(t, err)
	assert.NotNil(t, r.SubmitterOrganizationID)
	assert.Equal(t, 1, *r.SubmitterOrganizationID)
	assert.NotNil(t, r.SampleID)
	assert.Equal(t, 10, *r.SampleID)
	assert.NotNil(t, r.SequencingLabID)
	assert.Equal(t, 2, *r.SequencingLabID)

	orgDAO.AssertExpectations(t)
	sampleDAO.AssertExpectations(t)
}

func Test_PreFetchValidationInfo_SampleLookupError_Propagates(t *testing.T) {
	orgDAO := &mockOrgDAO{}
	sampleDAO := &mockSampleDAO{}

	r := &SequencingExperimentValidationRecord{
		SequencingExperiment: types.SequencingExperimentBatch{
			SampleOrganizationCode: "ORG",
			SubmitterSampleId:      "S1",
			SequencingLabCode:      "LAB1",
		},
	}

	orgDAO.
		On("GetOrganizationByCode", "ORG").
		Return(&types.Organization{ID: 1}, nil)
	sampleDAO.
		On("GetSampleBySubmitterSampleId", 1, "S1").
		Return((*types.Sample)(nil), assert.AnError)

	err := r.preFetchValidationInfo(orgDAO, sampleDAO)

	assert.Error(t, err)
	assert.Same(t, assert.AnError, err)
}
