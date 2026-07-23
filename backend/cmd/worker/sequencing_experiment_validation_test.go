package main

import (
	"context"
	"errors"
	"testing"
	"time"

	"github.com/radiant-network/radiant-api/internal/batchval"
	"github.com/radiant-network/radiant-api/internal/repository"
	"github.com/radiant-network/radiant-api/internal/repository/postgres"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"github.com/stretchr/testify/require"
)

type mockOrgDAO struct{ mock.Mock }

func (m *mockOrgDAO) GetOrganizationByCode(_ context.Context, code string) (*types.Organization, error) {
	args := m.Called(code)
	if org, ok := args.Get(0).(*types.Organization); ok {
		return org, args.Error(1)
	}
	return nil, args.Error(1)
}

type mockSampleDAO struct{ mock.Mock }

func (m *mockSampleDAO) CreateSample(context.Context, *types.Sample) (*types.Sample, error) {
	return nil, nil
}

func (m *mockSampleDAO) GetTypeCodes() ([]string, error) {
	return nil, nil
}

func (m *mockSampleDAO) GetSampleById(_ context.Context, id int) (*types.Sample, error) {
	args := m.Called(id)
	if s, ok := args.Get(0).(*types.Sample); ok {
		return s, args.Error(1)
	}
	return nil, args.Error(1)
}

func (m *mockSampleDAO) GetSampleByOrgCodeAndSubmitterSampleId(_ context.Context, organizationCode string, submitterSampleId string) (*types.Sample, error) {
	args := m.Called(organizationCode, submitterSampleId)
	if s, ok := args.Get(0).(*types.Sample); ok {
		return s, args.Error(1)
	}
	return nil, args.Error(1)
}

type mockSeqExpDAO struct{ mock.Mock }

func (m *mockSeqExpDAO) CreateSequencingExperiment(_ context.Context, se *types.SequencingExperiment) error {
	return nil
}

func (m *mockSeqExpDAO) GetSequencingExperimentBySampleID(sampleID int) ([]types.SequencingExperiment, error) {
	args := m.Called(sampleID)
	if se, ok := args.Get(0).([]types.SequencingExperiment); ok {
		return se, args.Error(1)
	}
	return nil, args.Error(1)
}

func (m *mockSeqExpDAO) GetSequencingExperimentsByCaseId(_ context.Context, caseID int) ([]types.SequencingExperiment, error) {
	return nil, nil
}

func (m *mockSeqExpDAO) GetSequencingExperimentByAliquot(_ context.Context, aliquot string) ([]types.SequencingExperiment, error) {
	args := m.Called(aliquot)
	if se, ok := args.Get(0).([]types.SequencingExperiment); ok {
		return se, args.Error(1)
	}
	return nil, args.Error(1)
}

func (m *mockSeqExpDAO) GetSequencingExperimentByAliquotAndSubmitterSample(_ context.Context, aliquot string, submitterSampleId string, organizationCode string) (*types.SequencingExperiment, error) {
	args := m.Called(aliquot, submitterSampleId, organizationCode)
	if se, ok := args.Get(0).(*types.SequencingExperiment); ok {
		return se, args.Error(1)
	}
	return nil, args.Error(1)
}

func (m *mockSeqExpDAO) UpdateSequencingExperiment(_ context.Context, se *types.SequencingExperiment) error {
	args := m.Called(se)
	return args.Error(0)
}

func (m *mockSeqExpDAO) GetSequencingExperimentDetailById(seqId int) (*types.SequencingExperimentDetail, error) {
	return nil, nil
}

type mockValueSetsDAO struct{ mock.Mock }

func (m *mockValueSetsDAO) GetCodes(_ context.Context, vsType postgres.ValueSetType) ([]string, error) {
	switch vsType {
	case postgres.ValueSetExperimentalStrategy:
		return []string{"wgs", "wxs", "rna_seq"}, nil
	case postgres.ValueSetSequencingReadTechnology:
		return []string{"short_read", "long_read"}, nil
	case postgres.ValueSetStatus:
		return []string{"draft", "in_progress", "completed"}, nil
	case postgres.ValueSetPlatform:
		return []string{"illumina", "pacbio", "nanopore"}, nil
	default:
		return []string{}, nil
	}
}

func newBaseRecord() *SequencingExperimentValidationRecord {
	return &SequencingExperimentValidationRecord{
		BaseValidationRecord: batchval.BaseValidationRecord{ResourceType: types.CreateSequencingExperimentBatchType, Index: 0},
		SequencingExperiment: types.SequencingExperimentBatch{},
	}
}

// ------ Tests ------

func Test_VerifyIdentical_DifferentField_AddsWarning(t *testing.T) {
	r := &SequencingExperimentValidationRecord{
		BaseValidationRecord: batchval.BaseValidationRecord{ResourceType: types.CreateSequencingExperimentBatchType, Index: 0},
	}
	verifyIsDifferentField(1, 2, r, "key", "mock_field")
	assert.Len(t, r.Warnings, 1)
	assert.Equal(t, "SEQ-004", r.Warnings[0].Code)
	assert.Equal(t, "A sequencing with same ids (key) has been found but with a different mock_field (1 <> 2).", r.Warnings[0].Message)
	assert.Equal(t, "create_sequencing_experiment[0].mock_field", r.Warnings[0].Path)
}

func Test_VerifyIdentical_AddsInfo(t *testing.T) {
	r := &SequencingExperimentValidationRecord{
		BaseValidationRecord: batchval.BaseValidationRecord{ResourceType: types.CreateSequencingExperimentBatchType, Index: 0},
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
	assert.Equal(t, "Invalid field experimental_strategy_code for create_sequencing_experiment (ORG / S1 / A1). Reason: \"foobar\" is not a valid experimental strategy code. Valid values [wgs, wxs, rna_seq].", r.Errors[0].Message)
	assert.Equal(t, "create_sequencing_experiment[0].experimental_strategy_code", r.Errors[0].Path)
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
	assert.Equal(t, "Invalid field sequencing_read_technology_code for create_sequencing_experiment (ORG / S1 / A1). Reason: \"mini_read\" is not a valid sequencing read technology code. Valid values [short_read, long_read].", r.Errors[0].Message)
	assert.Equal(t, "create_sequencing_experiment[0].sequencing_read_technology_code", r.Errors[0].Path)
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
	assert.Equal(t, "Invalid field status_code for create_sequencing_experiment (ORG / S1 / A1). Reason: \"invalid\" is not a valid status code. Valid values [draft, in_progress, completed].", r.Errors[0].Message)
	assert.Equal(t, "create_sequencing_experiment[0].status_code", r.Errors[0].Path)
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
	assert.Equal(t, "Invalid field platform_code for create_sequencing_experiment (ORG / S1 / A1). Reason: \"not-illumina\" is not a valid platform code. Valid values [illumina, pacbio, nanopore].", r.Errors[0].Message)
	assert.Equal(t, "create_sequencing_experiment[0].platform_code", r.Errors[0].Path)
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
	assert.Equal(t, "Invalid field run_date for create_sequencing_experiment (ORG / S1 / A1). Reason: must be a past date.", r.Errors[0].Message)
	assert.Equal(t, "create_sequencing_experiment[0].run_date", r.Errors[0].Path)
}

func Test_ValidateIdenticalSequencingExperiment_Found_AddsInfo(t *testing.T) {
	r := newBaseRecord()
	seqLab := "LAB"
	sampleId := 10
	r.SampleID = &sampleId
	r.SequencingLabCode = &seqLab
	r.SequencingExperiment.SubmitterSampleId = "S1"
	r.SequencingExperiment.Aliquot = "A1"
	r.SequencingExperiment.SampleOrganizationCode = "ORG"

	seqDAO := &mockSeqExpDAO{}
	seqDAO.On("GetSequencingExperimentByAliquot", "A1").
		Return([]types.SequencingExperiment{
			{
				ID:                70,
				Aliquot:           "A1",
				SampleID:          10,
				SequencingLabCode: "LAB",
			},
		}, nil)

	orgDAO := &mockOrgDAO{}

	sampleDAO := &mockSampleDAO{}
	sampleDAO.On("GetSampleById", 10).Return(&types.Sample{SubmitterSampleId: "S1", OrganizationCode: "ORG", TenantCode: types.DefaultTenantCode}, nil)

	r.Context = &batchval.BatchValidationContext{
		SeqExpRepo: seqDAO,
		OrgRepo:    orgDAO,
		SampleRepo: sampleDAO,
	}
	r.Cache = batchval.NewBatchValidationCache(r.Context)

	err := r.validateExistingAliquotForSequencingLabCode(t.Context())
	assert.NoError(t, err)
	assert.Len(t, r.Infos, 1)
	assert.Equal(t, "SEQ-001", r.Infos[0].Code)
	assert.Equal(t, "Sequencing (ORG / S1 / A1) already exists, skipped.", r.Infos[0].Message)
	assert.Equal(t, "create_sequencing_experiment[0]", r.Infos[0].Path)
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
	assert.Equal(t, "create_sequencing_experiment[0].sequencing_lab_code", r.Errors[0].Path)
}

func Test_ValidateExistingAliquotForSequencingLabCode_DifferentFields_AddWarnings(t *testing.T) {
	seqLab := "LAB"
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
	r.SequencingLabCode = &seqLab
	r.SampleID = &sampleId

	seqDAO := &mockSeqExpDAO{}
	seqDAO.On("GetSequencingExperimentByAliquot", "A1").
		Return([]types.SequencingExperiment{
			{
				SequencingLabCode:            "LAB",
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

	sampleDAO := &mockSampleDAO{}
	sampleDAO.On("GetSampleById", 1).Return(&types.Sample{SubmitterSampleId: "S1", OrganizationCode: "ORG", TenantCode: types.DefaultTenantCode}, nil)

	r.Context = &batchval.BatchValidationContext{
		SeqExpRepo: seqDAO,
		OrgRepo:    orgDAO,
		SampleRepo: sampleDAO,
	}
	r.Cache = batchval.NewBatchValidationCache(r.Context)

	err := r.validateExistingAliquotForSequencingLabCode(t.Context())

	assert.NoError(t, err)
	assert.NotEmpty(t, r.Warnings)
	assert.Empty(t, r.Errors)
	assert.Len(t, r.Warnings, 9)
	assert.Equal(t, "SEQ-004", r.Warnings[0].Code)
	assert.Equal(t, "A sequencing with same ids (ORG / S2 / A1) has been found but with a different submitter_sample_id (S1 <> S2).", r.Warnings[0].Message)
	assert.Equal(t, "create_sequencing_experiment[0].submitter_sample_id", r.Warnings[0].Path)
	assert.Equal(t, "SEQ-004", r.Warnings[7].Code)
	assert.Equal(t, "A sequencing with same ids (ORG / S2 / A1) has been found but with a different capture_kit (OTHER <> CK1).", r.Warnings[7].Message)
	assert.Equal(t, "create_sequencing_experiment[0].capture_kit", r.Warnings[7].Path)
}

func Test_ValidateUnknownSampleForOrganizationCode_Nil_AddsError(t *testing.T) {
	r := newBaseRecord()
	r.SequencingExperiment.SampleOrganizationCode = "ORG"
	r.SequencingExperiment.SubmitterSampleId = "S1"

	err := r.validateUnknownSampleForOrganizationCode()

	assert.NoError(t, err)
	assert.Len(t, r.Errors, 1)
	assert.Equal(t, "SEQ-005", r.Errors[0].Code)
	assert.Equal(t, "Sample (ORG / S1) does not exist.", r.Errors[0].Message)
	assert.Equal(t, "create_sequencing_experiment[0]", r.Errors[0].Path)
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
		Return(&types.Organization{Code: "LAB1"}, nil)
	orgDAO.On("GetOrganizationByCode", "ORG").
		Return(&types.Organization{Code: "ORG"}, nil)
	orgDAO.On("GetOrganizationById", 1).
		Return(&types.Organization{Code: "ORG"}, nil)

	sampleDAO.On("GetSampleBySubmitterSampleId", 1, "S1").
		Return(&types.Sample{ID: 10, SubmitterSampleId: "S1"}, nil)
	sampleDAO.On("GetSampleByOrgCodeAndSubmitterSampleId", "ORG", "S1").
		Return(&types.Sample{ID: 10, SubmitterSampleId: "S1"}, nil)

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

	record, err := validateSequencingExperimentRecord(t.Context(), mockContext, cache, seq, 0)

	assert.NoError(t, err)
	assert.Equal(t, 0, record.Index)
	assert.Equal(t, 10, *record.SampleID)
	assert.Equal(t, "ORG", *record.SubmitterOrganizationCode)
	assert.Equal(t, "LAB1", *record.SequencingLabCode)
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
		Return(&types.Organization{Code: "LAB1"}, nil).Twice()
	orgDAO.On("GetOrganizationByCode", "ORG").
		Return(&types.Organization{Code: "ORG"}, nil).Twice()
	orgDAO.On("GetOrganizationById", 1).
		Return(&types.Organization{Code: "ORG"}, nil)

	sampleDAO.On("GetSampleBySubmitterSampleId", 1, "S1").
		Return(&types.Sample{ID: 10}, nil).Twice()
	sampleDAO.On("GetSampleByOrgCodeAndSubmitterSampleId", "ORG", "S1").
		Return(&types.Sample{ID: 10, SubmitterSampleId: "S1"}, nil)

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

	records, err := validateSequencingExperimentBatch(t.Context(), mockContext, []types.SequencingExperimentBatch{seq1, seq2})

	assert.NoError(t, err)
	assert.Len(t, records, 2)
	assert.Empty(t, records[0].Errors)
	assert.Equal(t, 1, len(records[1].Errors))
	assert.Equal(t, "SEQ-006", records[1].Errors[0].Code)
	assert.Equal(t, "Create_sequencing_experiment (ORG / S1 / A1) appears multiple times in the batch.", records[1].Errors[0].Message)
	assert.Equal(t, "create_sequencing_experiment[1]", records[1].Errors[0].Path)
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
		BaseValidationRecord: batchval.BaseValidationRecord{ResourceType: types.CreateSequencingExperimentBatchType, Context: mockContext, Cache: cache, Index: 0},
		SequencingExperiment: types.SequencingExperimentBatch{
			SampleOrganizationCode: "ORG",
			SubmitterSampleId:      "S1",
			SequencingLabCode:      "LAB1",
		},
	}

	// Mocked orgs and sample
	orgDAO.
		On("GetOrganizationByCode", "ORG").
		Return(&types.Organization{Code: "ORG"}, nil)
	orgDAO.
		On("GetOrganizationByCode", "LAB1").
		Return(&types.Organization{Code: "LAB1"}, nil)

	sampleDAO.On("GetSampleByOrgCodeAndSubmitterSampleId", "ORG", "S1").
		Return(&types.Sample{ID: 10, SubmitterSampleId: "S1"}, nil)

	err := r.preFetchValidationInfo(t.Context())

	assert.NoError(t, err)
	assert.NotNil(t, r.SubmitterOrganizationCode)
	assert.Equal(t, "ORG", *r.SubmitterOrganizationCode)
	assert.NotNil(t, r.SampleID)
	assert.Equal(t, 10, *r.SampleID)
	assert.NotNil(t, r.SequencingLabCode)
	assert.Equal(t, "LAB1", *r.SequencingLabCode)

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
		BaseValidationRecord: batchval.BaseValidationRecord{ResourceType: types.CreateSequencingExperimentBatchType, Context: mockContext, Cache: cache, Index: 0},
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
		Return(&types.Organization{Code: "LAB1"}, nil)

	err := r.preFetchValidationInfo(t.Context())

	assert.NoError(t, err)
	assert.Nil(t, r.SubmitterOrganizationCode)
	assert.Nil(t, r.SampleID)
	assert.NotNil(t, r.SequencingLabCode)

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
		BaseValidationRecord: batchval.BaseValidationRecord{ResourceType: types.CreateSequencingExperimentBatchType, Context: mockContext, Cache: cache, Index: 0},
		SequencingExperiment: types.SequencingExperimentBatch{
			SampleOrganizationCode: "ORG",
			SubmitterSampleId:      "S1",
			SequencingLabCode:      "LAB1",
		},
	}

	// Mocked orgs and sample
	orgDAO.
		On("GetOrganizationByCode", "ORG").
		Return(&types.Organization{Code: "ORG"}, nil)
	orgDAO.
		On("GetOrganizationByCode", "LAB1").
		Return(nil, nil)

	sampleDAO.On("GetSampleByOrgCodeAndSubmitterSampleId", "ORG", "S1").
		Return(&types.Sample{ID: 10, SubmitterSampleId: "S1"}, nil)

	err := r.preFetchValidationInfo(t.Context())

	assert.NoError(t, err)
	assert.NotNil(t, r.SubmitterOrganizationCode)
	assert.Equal(t, "ORG", *r.SubmitterOrganizationCode)
	assert.NotNil(t, r.SampleID)
	assert.Equal(t, 10, *r.SampleID)
	assert.Nil(t, r.SequencingLabCode)

	orgDAO.AssertExpectations(t)
	sampleDAO.AssertExpectations(t)
}

func Test_PreFetchValidationInfo_SampleLookupError_Propagates(t *testing.T) {
	orgDAO := &mockOrgDAO{}
	sampleDAO := &mockSampleDAO{}
	valueSetDAO := &mockValueSetsDAO{}

	r := &SequencingExperimentValidationRecord{
		SequencingExperiment: types.SequencingExperimentBatch{
			SampleOrganizationCode: "ORG",
			SubmitterSampleId:      "S1",
			SequencingLabCode:      "LAB1",
		},
	}

	orgDAO.
		On("GetOrganizationByCode", "LAB1").
		Return(&types.Organization{Code: "LAB1"}, nil)
	orgDAO.
		On("GetOrganizationByCode", "ORG").
		Return(&types.Organization{Code: "ORG"}, nil)
	sampleDAO.On("GetSampleByOrgCodeAndSubmitterSampleId", "ORG", "S1").
		Return(nil, errors.New("sample not found"))

	r.Context = &batchval.BatchValidationContext{
		OrgRepo:       orgDAO,
		SampleRepo:    sampleDAO,
		ValueSetsRepo: valueSetDAO,
	}
	r.Cache = batchval.NewBatchValidationCache(r.Context)

	err := r.preFetchValidationInfo(t.Context())
	assert.Error(t, err)
	assert.ErrorContains(t, err, "error fetching sample: sample not found")
}

func Test_ValidateExistingSeqExpForUpdate_Nil(t *testing.T) {
	r := newBaseRecord()
	r.SequencingExperiment.SampleOrganizationCode = "ORG"
	r.SequencingExperiment.SubmitterSampleId = "S1"
	r.SequencingExperiment.Aliquot = "A1"

	r.validateExistingSeqExpForUpdate(nil)

	assert.True(t, r.Skipped)
	assert.Len(t, r.Errors, 1)
	assert.Equal(t, SeqExpNotExistForUpdateCode, r.Errors[0].Code)
	assert.Contains(t, r.Errors[0].Message, "does not exist, cannot update")
}

func Test_ValidateExistingSeqExpForUpdate_Found(t *testing.T) {
	r := newBaseRecord()
	r.SequencingExperiment.SampleOrganizationCode = "ORG"
	r.SequencingExperiment.SubmitterSampleId = "S1"
	r.SequencingExperiment.Aliquot = "A1"

	r.validateExistingSeqExpForUpdate(&types.SequencingExperiment{ID: 1})

	assert.False(t, r.Skipped)
	assert.Empty(t, r.Errors)
}

func Test_ValidateUpdateSequencingExperimentRecord_MissingReportsError(t *testing.T) {
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

	orgDAO.On("GetOrganizationByCode", "LAB1").Return(&types.Organization{Code: "LAB1"}, nil)
	orgDAO.On("GetOrganizationByCode", "ORG").Return(&types.Organization{Code: "ORG"}, nil)
	sampleDAO.On("GetSampleByOrgCodeAndSubmitterSampleId", "ORG", "S1").
		Return(&types.Sample{ID: 10, SubmitterSampleId: "S1"}, nil)
	seqDAO.On("GetSequencingExperimentByAliquotAndSubmitterSample", "A1", "S1", "ORG").
		Return(nil, nil)

	mockContext := &batchval.BatchValidationContext{
		OrgRepo:       orgDAO,
		SampleRepo:    sampleDAO,
		SeqExpRepo:    seqDAO,
		ValueSetsRepo: &mockValueSetsDAO{},
	}
	cache := batchval.NewBatchValidationCache(mockContext)

	record, err := validateUpdateSequencingExperimentRecord(t.Context(), mockContext, cache, seq, 0)

	assert.NoError(t, err)
	assert.True(t, record.Skipped)
	require.Len(t, record.Errors, 1)
	assert.Equal(t, SeqExpNotExistForUpdateCode, record.Errors[0].Code)
}

func Test_ValidateUpdateSequencingExperimentRecord_ExistingNotSkipped(t *testing.T) {
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

	orgDAO.On("GetOrganizationByCode", "LAB1").Return(&types.Organization{Code: "LAB1"}, nil)
	orgDAO.On("GetOrganizationByCode", "ORG").Return(&types.Organization{Code: "ORG"}, nil)
	sampleDAO.On("GetSampleByOrgCodeAndSubmitterSampleId", "ORG", "S1").
		Return(&types.Sample{ID: 10, SubmitterSampleId: "S1"}, nil)
	seqDAO.On("GetSequencingExperimentByAliquotAndSubmitterSample", "A1", "S1", "ORG").
		Return(&types.SequencingExperiment{ID: 5, SampleID: 10, Aliquot: "A1"}, nil)

	mockContext := &batchval.BatchValidationContext{
		OrgRepo:       orgDAO,
		SampleRepo:    sampleDAO,
		SeqExpRepo:    seqDAO,
		ValueSetsRepo: &mockValueSetsDAO{},
	}
	cache := batchval.NewBatchValidationCache(mockContext)

	record, err := validateUpdateSequencingExperimentRecord(t.Context(), mockContext, cache, seq, 0)

	assert.NoError(t, err)
	assert.False(t, record.Skipped)
	assert.Empty(t, record.Errors)
}

func Test_UpdateSequencingExperimentRecords_SkipsMissingRecords(t *testing.T) {
	seqDAO := &mockSeqExpDAO{}
	seqDAO.On("UpdateSequencingExperiment", mock.Anything).Return(nil).Once()

	sampleID1 := 10
	records := []*SequencingExperimentValidationRecord{
		{SequencingExperiment: types.SequencingExperimentBatch{Aliquot: "A1"}, SampleID: &sampleID1, BaseValidationRecord: batchval.BaseValidationRecord{ResourceType: types.CreateSequencingExperimentBatchType, Skipped: false}},
		{SequencingExperiment: types.SequencingExperimentBatch{Aliquot: "A2"}, BaseValidationRecord: batchval.BaseValidationRecord{ResourceType: types.CreateSequencingExperimentBatchType, Skipped: true}},
	}

	err := updateSequencingExperimentRecords(t.Context(), records, seqDAO, types.DefaultTenantCode)
	assert.NoError(t, err)
	seqDAO.AssertExpectations(t)
}

func Test_Persist_Batch_And_Update_SequencingExperiment_Records(t *testing.T) {
	// ExclusivePostgres: writes directly into "sample"/"sequencing_experiment" (id >= 1000),
	// tables other parallel WritePostgres tests may bulk-clean concurrently — see
	// setup_postgres.go cleanUp.
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		db := env.Postgres
		require.NoError(t, db.Exec(`
			INSERT INTO sample (id, type_code, tissue_site, histology_code, submitter_sample_id, patient_id, organization_code, tenant_code)
			VALUES (1001, 'blood', NULL, 'normal', 'S-SEQ-WORKER-UPDATE-1', 1, 'CQGC', 'radiant')
		`).Error)
		require.NoError(t, db.Exec(`
			INSERT INTO sequencing_experiment (id, sample_id, status_code, aliquot, sequencing_lab_code, tenant_code, experimental_strategy_code, sequencing_read_technology_code, platform_code, created_on, updated_on)
			VALUES (1001, 1001, 'submitted', 'ALIQUOT-WORKER-UPDATE-1', 'CQGC', 'radiant', 'wgs', 'short_read', 'illumina', now(), now())
		`).Error)

		var id string
		require.NoError(t, db.Raw(`
			INSERT INTO batch (payload, status, batch_type, dry_run, username, created_on, tenant_code)
			VALUES (?, 'RUNNING', ?, false, 'user999', '2025-10-09', 'radiant')
			RETURNING id;
		`, "{}", types.UpdateSequencingExperimentBatchType).Scan(&id).Error)

		batch := types.Batch{
			ID:        id,
			BatchType: types.UpdateSequencingExperimentBatchType,
			Payload:   "[]",
			Status:    types.BatchStatusSuccess,
			DryRun:    false,
		}
		sampleID := 1001
		records := []*SequencingExperimentValidationRecord{{
			SequencingExperiment: types.SequencingExperimentBatch{
				Aliquot:                      "ALIQUOT-WORKER-UPDATE-1",
				StatusCode:                   "completed",
				SequencingLabCode:            "CQGC",
				ExperimentalStrategyCode:     "wxs",
				SequencingReadTechnologyCode: "long_read",
				PlatformCode:                 "pacbio",
			},
			SampleID: &sampleID,
		}}

		err := persistBatchAndUpdateSequencingExperimentRecords(t.Context(), db, &batch, records)
		require.NoError(t, err)

		repo := repository.NewSequencingExperimentRepository(db)
		seqExp, err := repo.GetSequencingExperimentByAliquotAndSubmitterSample(t.Context(), "ALIQUOT-WORKER-UPDATE-1", "S-SEQ-WORKER-UPDATE-1", "CQGC")
		require.NoError(t, err)
		require.NotNil(t, seqExp)
		assert.Equal(t, "completed", seqExp.StatusCode)
		assert.Equal(t, "wxs", seqExp.ExperimentalStrategyCode)
		assert.Equal(t, "long_read", seqExp.SequencingReadTechnologyCode)
		assert.Equal(t, "pacbio", seqExp.PlatformCode)
	})
}
