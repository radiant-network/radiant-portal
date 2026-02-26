package main

import (
	"testing"
	"time"

	"github.com/radiant-network/radiant-api/internal/batchval"
	"github.com/radiant-network/radiant-api/internal/repository"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

type mockOrgDAO struct{ mock.Mock }

func (m *mockOrgDAO) GetOrganizationById(id int) (*types.Organization, error) {
	args := m.Called(id)
	if s, ok := args.Get(0).(*types.Organization); ok {
		return s, args.Error(1)
	}
	return nil, args.Error(1)
}

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

func (m *mockSampleDAO) GetSampleById(id int) (*types.Sample, error) {
	args := m.Called(id)
	if s, ok := args.Get(0).(*types.Sample); ok {
		return s, args.Error(1)
	}
	return nil, args.Error(1)
}

func (m *mockSampleDAO) GetSampleBySubmitterSampleId(orgID int, submitterID string) (*types.Sample, error) {
	args := m.Called(orgID, submitterID)
	if s, ok := args.Get(0).(*types.Sample); ok {
		return s, args.Error(1)
	}
	return nil, args.Error(1)
}

func (m *mockSampleDAO) GetSampleByOrgCodeAndSubmitterSampleId(organizationCode string, submitterSampleId string) (*types.Sample, error) {
	return nil, nil
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

func (m *mockSeqExpDAO) GetSequencingExperimentByAliquotAndSubmitterSample(string, string, string) (*types.SequencingExperiment, error) {
	return nil, nil
}

func (m *mockSeqExpDAO) GetSequencingExperimentDetailById(seqId int) (*types.SequencingExperimentDetail, error) {
	return nil, nil
}

type mockValueSetsDAO struct{ mock.Mock }

func (m *mockValueSetsDAO) GetCodes(vsType repository.ValueSetType) ([]string, error) {
	switch vsType {
	case repository.ValueSetExperimentalStrategy:
		return []string{"wgs", "wxs", "rna_seq"}, nil
	case repository.ValueSetSequencingReadTechnology:
		return []string{"short_read", "long_read"}, nil
	case repository.ValueSetStatus:
		return []string{"draft", "in_progress", "completed"}, nil
	case repository.ValueSetPlatform:
		return []string{"illumina", "pacbio", "nanopore"}, nil
	default:
		return []string{}, nil
	}
}

func newBaseRecord() *SequencingExperimentValidationRecord {
	return &SequencingExperimentValidationRecord{
		BaseValidationRecord: batchval.BaseValidationRecord{Index: 0},
		SequencingExperiment: types.SequencingExperimentBatch{},
	}
}

// ------ Tests ------

func Test_VerifyIdentical_DifferentField_AddsWarning(t *testing.T) {
	r := &SequencingExperimentValidationRecord{
		BaseValidationRecord: batchval.BaseValidationRecord{Index: 0},
	}
	verifyIsDifferentField(1, 2, r, "key", "mock_field")
	assert.Len(t, r.Warnings, 1)
	assert.Equal(t, "SEQ-004", r.Warnings[0].Code)
	assert.Equal(t, "A sequencing with same ids (key) has been found but with a different mock_field (1 <> 2).", r.Warnings[0].Message)
	assert.Equal(t, "sequencing_experiment[0].mock_field", r.Warnings[0].Path)
}

func Test_VerifyIdentical_AddsInfo(t *testing.T) {
	r := &SequencingExperimentValidationRecord{
		BaseValidationRecord: batchval.BaseValidationRecord{Index: 0},
	}
	verifyIsDifferentField("same", "same", r, "key", "field")
	assert.Empty(t, r.Warnings)
}

func Test_ValidateExperimentalStrategyCodeField_Allowed(t *testing.T) {
	r := newBaseRecord()
	r.Context = &batchval.BatchValidationContext{
		ValueSetsRepo: &mockValueSetsDAO{},
	}
	r.ExperimentalStrategyCodes = []string{"wgs", "wxs"}

	r.SequencingExperiment.ExperimentalStrategyCode = "wgs"
	err := r.validateExperimentalStrategyCodeField()
	assert.NoError(t, err)
	assert.Empty(t, r.Errors)
}

func Test_ValidateExperimentalStrategyCodeField_NotAllowed(t *testing.T) {
	r := newBaseRecord()
	r.Context = &batchval.BatchValidationContext{
		ValueSetsRepo: &mockValueSetsDAO{},
	}
	r.ExperimentalStrategyCodes = []string{"wgs", "wxs", "rna_seq"}
	r.SequencingExperiment.SampleOrganizationCode = "ORG"
	r.SequencingExperiment.SubmitterSampleId = "S1"
	r.SequencingExperiment.Aliquot = "A1"
	r.SequencingExperiment.ExperimentalStrategyCode = "foobar"
	err := r.validateExperimentalStrategyCodeField()
	assert.NoError(t, err)
	assert.Len(t, r.Errors, 1)
	assert.Equal(t, "SEQ-002", r.Errors[0].Code)
	assert.Equal(t, "Invalid field experimental_strategy_code for sequencing_experiment (ORG / S1 / A1). Reason: \"foobar\" is not a valid experimental strategy code. Valid values [wgs, wxs, rna_seq].", r.Errors[0].Message)
	assert.Equal(t, "sequencing_experiment[0].experimental_strategy_code", r.Errors[0].Path)
}

func Test_ValidateSequencingReadTechnologyCodeField_Allowed(t *testing.T) {
	r := newBaseRecord()
	r.Context = &batchval.BatchValidationContext{
		ValueSetsRepo: &mockValueSetsDAO{},
	}
	r.SequencingReadTechnologyCodes = []string{"short_read", "long_read"}
	r.SequencingExperiment.SequencingReadTechnologyCode = "short_read"
	err := r.validateSequencingReadTechnologyCodeField()
	assert.NoError(t, err)
	assert.Empty(t, r.Errors)
}

func Test_ValidateSequencingReadTechnologyCodeField_NotAllowed(t *testing.T) {
	r := newBaseRecord()
	r.Context = &batchval.BatchValidationContext{
		ValueSetsRepo: &mockValueSetsDAO{},
	}
	r.SequencingReadTechnologyCodes = []string{"short_read", "long_read"}
	r.SequencingExperiment.SampleOrganizationCode = "ORG"
	r.SequencingExperiment.SubmitterSampleId = "S1"
	r.SequencingExperiment.Aliquot = "A1"
	r.SequencingExperiment.SequencingReadTechnologyCode = "mini_read"
	err := r.validateSequencingReadTechnologyCodeField()
	assert.NoError(t, err)
	assert.Len(t, r.Errors, 1)
	assert.Equal(t, "SEQ-002", r.Errors[0].Code)
	assert.Equal(t, "Invalid field sequencing_read_technology_code for sequencing_experiment (ORG / S1 / A1). Reason: \"mini_read\" is not a valid sequencing read technology code. Valid values [short_read, long_read].", r.Errors[0].Message)
	assert.Equal(t, "sequencing_experiment[0].sequencing_read_technology_code", r.Errors[0].Path)
}

func Test_ValidateStatusCodeField_Allowed(t *testing.T) {
	r := newBaseRecord()
	r.Context = &batchval.BatchValidationContext{
		ValueSetsRepo: &mockValueSetsDAO{},
	}
	r.StatusCodes = []string{"draft", "in_progress", "completed"}
	r.SequencingExperiment.StatusCode = "in_progress"
	err := r.validateStatusCodeField()
	assert.NoError(t, err)
	assert.Empty(t, r.Errors)
}

func Test_ValidateStatusCodeField_NotAllowed(t *testing.T) {
	r := newBaseRecord()
	r.Context = &batchval.BatchValidationContext{
		ValueSetsRepo: &mockValueSetsDAO{},
	}
	r.StatusCodes = []string{"draft", "in_progress", "completed"}
	r.SequencingExperiment.SampleOrganizationCode = "ORG"
	r.SequencingExperiment.SubmitterSampleId = "S1"
	r.SequencingExperiment.Aliquot = "A1"
	r.SequencingExperiment.StatusCode = "invalid"
	err := r.validateStatusCodeField()
	assert.NoError(t, err)
	assert.Len(t, r.Errors, 1)
	assert.Equal(t, "SEQ-002", r.Errors[0].Code)
	assert.Equal(t, "Invalid field status_code for sequencing_experiment (ORG / S1 / A1). Reason: \"invalid\" is not a valid status code. Valid values [draft, in_progress, completed].", r.Errors[0].Message)
	assert.Equal(t, "sequencing_experiment[0].status_code", r.Errors[0].Path)
}

func Test_ValidatePlatformCodeField_Allowed(t *testing.T) {
	r := newBaseRecord()
	r.Context = &batchval.BatchValidationContext{
		ValueSetsRepo: &mockValueSetsDAO{},
	}
	r.PlatformCodes = []string{"illumina", "pacbio", "nanopore"}
	r.SequencingExperiment.PlatformCode = "illumina"
	err := r.validatePlatformCodeField()
	assert.NoError(t, err)
	assert.Empty(t, r.Errors)
}

func Test_ValidatePlatformCodeField_NotAllowed(t *testing.T) {
	r := newBaseRecord()
	r.Context = &batchval.BatchValidationContext{
		ValueSetsRepo: &mockValueSetsDAO{},
	}
	r.PlatformCodes = []string{"illumina", "pacbio", "nanopore"}
	r.SequencingExperiment.SampleOrganizationCode = "ORG"
	r.SequencingExperiment.SubmitterSampleId = "S1"
	r.SequencingExperiment.Aliquot = "A1"
	r.SequencingExperiment.PlatformCode = "not-illumina"
	err := r.validatePlatformCodeField()
	assert.NoError(t, err)
	assert.Len(t, r.Errors, 1)
	assert.Equal(t, "SEQ-002", r.Errors[0].Code)
	assert.Equal(t, "Invalid field platform_code for sequencing_experiment (ORG / S1 / A1). Reason: \"not-illumina\" is not a valid platform code. Valid values [illumina, pacbio, nanopore].", r.Errors[0].Message)
	assert.Equal(t, "sequencing_experiment[0].platform_code", r.Errors[0].Path)
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
	assert.Equal(t, "SEQ-002", r.Errors[0].Code)
	assert.Equal(t, "Invalid field run_date for sequencing_experiment (ORG / S1 / A1). Reason: must be a past date.", r.Errors[0].Message)
	assert.Equal(t, "sequencing_experiment[0].run_date", r.Errors[0].Path)
}

func Test_ValidateIdenticalSequencingExperiment_Found_AddsInfo(t *testing.T) {
	r := newBaseRecord()
	seqExpId := 70
	sampleId := 10
	r.SampleID = &sampleId
	r.SequencingLabID = &seqExpId
	r.SequencingExperiment.SubmitterSampleId = "S1"
	r.SequencingExperiment.Aliquot = "A1"
	r.SequencingExperiment.SampleOrganizationCode = "ORG"

	seqDAO := &mockSeqExpDAO{}
	seqDAO.On("GetSequencingExperimentByAliquot", "A1").
		Return([]types.SequencingExperiment{
			{
				ID:              70,
				Aliquot:         "A1",
				SampleID:        10,
				SequencingLabID: 70,
			},
		}, nil)

	orgDAO := &mockOrgDAO{}
	orgDAO.On("GetOrganizationById", 70).Return(&types.Organization{Code: "ORG"}, nil)

	sampleDAO := &mockSampleDAO{}
	sampleDAO.On("GetSampleById", 10).Return(&types.Sample{SubmitterSampleId: "S1", OrganizationId: 70}, nil)

	r.Context = &batchval.BatchValidationContext{
		SeqExpRepo: seqDAO,
		OrgRepo:    orgDAO,
		SampleRepo: sampleDAO,
	}
	r.Cache = batchval.NewBatchValidationCache(r.Context)

	err := r.validateExistingAliquotForSequencingLabCode()
	assert.NoError(t, err)
	assert.Len(t, r.Infos, 1)
	assert.Equal(t, "SEQ-001", r.Infos[0].Code)
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
	assert.Equal(t, "SEQ-003", r.Errors[0].Code)
	assert.Equal(t, "Sequencing lab LABX for sequencing A1 does not exist.", r.Errors[0].Message)
	assert.Equal(t, "sequencing_experiment[0].sequencing_lab_code", r.Errors[0].Path)
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

	orgDAO := &mockOrgDAO{}
	orgDAO.On("GetOrganizationById", 70).Return(&types.Organization{Code: "ORG", ID: 70}, nil)

	sampleDAO := &mockSampleDAO{}
	sampleDAO.On("GetSampleById", 1).Return(&types.Sample{SubmitterSampleId: "S1", OrganizationId: 70}, nil)

	r.Context = &batchval.BatchValidationContext{
		SeqExpRepo: seqDAO,
		OrgRepo:    orgDAO,
		SampleRepo: sampleDAO,
	}
	r.Cache = batchval.NewBatchValidationCache(r.Context)

	err := r.validateExistingAliquotForSequencingLabCode()

	assert.NoError(t, err)
	assert.NotEmpty(t, r.Warnings)
	assert.Empty(t, r.Errors)
	assert.Len(t, r.Warnings, 9)
	assert.Equal(t, "SEQ-004", r.Warnings[0].Code)
	assert.Equal(t, "A sequencing with same ids (ORG / S2 / A1) has been found but with a different submitter_sample_id (S1 <> S2).", r.Warnings[0].Message)
	assert.Equal(t, "sequencing_experiment[0].submitter_sample_id", r.Warnings[0].Path)
	assert.Equal(t, "SEQ-004", r.Warnings[7].Code)
	assert.Equal(t, "A sequencing with same ids (ORG / S2 / A1) has been found but with a different capture_kit (OTHER <> CK1).", r.Warnings[7].Message)
	assert.Equal(t, "sequencing_experiment[0].capture_kit", r.Warnings[7].Path)
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
	assert.Equal(t, "SEQ-005", r.Errors[0].Code)
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
		PlatformCode:                 "illumina",
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
	seqDAO.On("GetSequencingExperimentByAliquotAndSubmitterSample", "A1", "S1", "ORG").
		Return([]types.SequencingExperiment{}, nil)

	mockContext := &batchval.BatchValidationContext{
		OrgRepo:       orgDAO,
		SampleRepo:    sampleDAO,
		SeqExpRepo:    seqDAO,
		ValueSetsRepo: &mockValueSetsDAO{},
	}
	cache := batchval.NewBatchValidationCache(mockContext)

	record, err := validateSequencingExperimentRecord(mockContext, cache, seq, 0)

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
		PlatformCode:                 "illumina",
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

	mockContext := &batchval.BatchValidationContext{
		OrgRepo:       orgDAO,
		SampleRepo:    sampleDAO,
		SeqExpRepo:    seqDAO,
		ValueSetsRepo: &mockValueSetsDAO{},
	}

	records, err := validateSequencingExperimentBatch(mockContext, []types.SequencingExperimentBatch{seq1, seq2})

	assert.NoError(t, err)
	assert.Len(t, records, 2)
	assert.Empty(t, records[0].Errors)
	assert.Equal(t, 1, len(records[1].Errors))
	assert.Equal(t, "SEQ-006", records[1].Errors[0].Code)
	assert.Equal(t, "Sequencing_experiment (ORG / S1 / A1) appears multiple times in the batch.", records[1].Errors[0].Message)
	assert.Equal(t, "sequencing_experiment[1]", records[1].Errors[0].Path)
}

func Test_PreFetchValidationInfo_SetsIDs(t *testing.T) {
	orgDAO := &mockOrgDAO{}
	sampleDAO := &mockSampleDAO{}
	valueSetDAO := &mockValueSetsDAO{}

	mockContext := &batchval.BatchValidationContext{
		OrgRepo:       orgDAO,
		SampleRepo:    sampleDAO,
		ValueSetsRepo: valueSetDAO,
	}
	cache := batchval.NewBatchValidationCache(mockContext)

	// Input batch record
	r := &SequencingExperimentValidationRecord{
		BaseValidationRecord: batchval.BaseValidationRecord{Context: mockContext, Cache: cache, Index: 0},
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

	err := r.preFetchValidationInfo()

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

func Test_PreFetchValidationInfo_NullOrg(t *testing.T) {
	orgDAO := &mockOrgDAO{}
	sampleDAO := &mockSampleDAO{}
	valueSetDAO := &mockValueSetsDAO{}

	mockContext := &batchval.BatchValidationContext{
		OrgRepo:       orgDAO,
		SampleRepo:    sampleDAO,
		ValueSetsRepo: valueSetDAO,
	}
	cache := batchval.NewBatchValidationCache(mockContext)

	// Input batch record
	r := &SequencingExperimentValidationRecord{
		BaseValidationRecord: batchval.BaseValidationRecord{Context: mockContext, Cache: cache, Index: 0},
		SequencingExperiment: types.SequencingExperimentBatch{
			SampleOrganizationCode: "ORG",
			SubmitterSampleId:      "S1",
			SequencingLabCode:      "LAB1",
		},
	}

	// Mocked orgs and sample
	orgDAO.
		On("GetOrganizationByCode", "ORG").
		Return(nil, nil)
	orgDAO.
		On("GetOrganizationByCode", "LAB1").
		Return(&types.Organization{ID: 2}, nil)

	err := r.preFetchValidationInfo()

	assert.NoError(t, err)
	assert.Nil(t, r.SubmitterOrganizationID)
	assert.Nil(t, r.SampleID)
	assert.NotNil(t, r.SequencingLabID)

	orgDAO.AssertExpectations(t)
}

func Test_PreFetchValidationInfo_NullSequencingLab(t *testing.T) {
	orgDAO := &mockOrgDAO{}
	sampleDAO := &mockSampleDAO{}
	valueSetDAO := &mockValueSetsDAO{}

	mockContext := &batchval.BatchValidationContext{
		OrgRepo:       orgDAO,
		SampleRepo:    sampleDAO,
		ValueSetsRepo: valueSetDAO,
	}
	cache := batchval.NewBatchValidationCache(mockContext)

	// Input batch record
	r := &SequencingExperimentValidationRecord{
		BaseValidationRecord: batchval.BaseValidationRecord{Context: mockContext, Cache: cache, Index: 0},
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
		Return(nil, nil)

	sampleDAO.
		On("GetSampleBySubmitterSampleId", 1, "S1").
		Return(&types.Sample{ID: 10}, nil)

	err := r.preFetchValidationInfo()

	assert.NoError(t, err)
	assert.NotNil(t, r.SubmitterOrganizationID)
	assert.Equal(t, 1, *r.SubmitterOrganizationID)
	assert.NotNil(t, r.SampleID)
	assert.Equal(t, 10, *r.SampleID)
	assert.Nil(t, r.SequencingLabID)

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

	r.Context = &batchval.BatchValidationContext{
		OrgRepo:    orgDAO,
		SampleRepo: sampleDAO,
	}
	r.Cache = batchval.NewBatchValidationCache(r.Context)

	err := r.preFetchValidationInfo()
	assert.Error(t, err)
	assert.ErrorContains(t, err, "error fetching sample: assert.AnError general error for testing")
}
