package batchval

import (
	"errors"
	"testing"

	"github.com/radiant-network/radiant-api/internal/repository"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/stretchr/testify/assert"
)

// Mock repositories
type mockOrgRepo struct {
	repository.OrganizationDAO
	GetByCodeFunc func(code string) (*types.Organization, error)
	GetByIdFunc   func(id int) (*types.Organization, error)
}

func (m *mockOrgRepo) GetOrganizationByCode(code string) (*types.Organization, error) {
	return m.GetByCodeFunc(code)
}
func (m *mockOrgRepo) GetOrganizationById(id int) (*types.Organization, error) {
	return m.GetByIdFunc(id)
}

type mockSampleRepo struct {
	repository.SamplesDAO
	GetByIdFunc                                func(id int) (*types.Sample, error)
	GetBySubmitterSampleIdFunc                 func(organizationId int, submitterSampleId string) (*types.Sample, error)
	GetSampleByOrgCodeAndSubmitterSampleIdFunc func(orgCode string, submitterSampleId string) (*types.Sample, error)
}

func (m *mockSampleRepo) GetSampleById(id int) (*types.Sample, error) {
	return m.GetByIdFunc(id)
}
func (m *mockSampleRepo) GetSampleBySubmitterSampleId(organizationId int, submitterSampleId string) (*types.Sample, error) {
	return m.GetBySubmitterSampleIdFunc(organizationId, submitterSampleId)
}
func (m *mockSampleRepo) GetSampleByOrgCodeAndSubmitterSampleId(orgCode string, submitterSampleId string) (*types.Sample, error) {
	return m.GetSampleByOrgCodeAndSubmitterSampleIdFunc(orgCode, submitterSampleId)
}

type mockValueSetsRepo struct {
	repository.ValueSetsDAO
	GetCodesFunc func(vsType repository.ValueSetType) ([]string, error)
}

func (m *mockValueSetsRepo) GetCodes(vsType repository.ValueSetType) ([]string, error) {
	return m.GetCodesFunc(vsType)
}

type mockProjectRepo struct {
	repository.ProjectDAO
	GetByCodeFunc func(code string) (*types.Project, error)
}

func (m *mockProjectRepo) GetProjectByCode(code string) (*types.Project, error) {
	return m.GetByCodeFunc(code)
}

type mockCasesRepo struct {
	repository.CasesDAO
	GetAnalysisCatalogFunc func(code string) (*types.AnalysisCatalog, error)
	GetCaseBySubmitterFunc func(submitterCaseId string, projectId int) (*types.Case, error)
}

func (m *mockCasesRepo) GetCaseAnalysisCatalogIdByCode(code string) (*types.AnalysisCatalog, error) {
	return m.GetAnalysisCatalogFunc(code)
}
func (m *mockCasesRepo) GetCaseBySubmitterCaseIdAndProjectId(submitterCaseId string, projectId int) (*types.Case, error) {
	return m.GetCaseBySubmitterFunc(submitterCaseId, projectId)
}

type mockPatientRepo struct {
	repository.PatientsDAO
	GetByOrgAndSubmitterFunc func(orgCode string, submitterPatientId string) (*types.Patient, error)
}

func (m *mockPatientRepo) GetPatientByOrgCodeAndSubmitterPatientId(orgCode string, submitterPatientId string) (*types.Patient, error) {
	return m.GetByOrgAndSubmitterFunc(orgCode, submitterPatientId)
}

type mockSeqExpRepo struct {
	repository.SequencingExperimentDAO
	GetByAliquotFunc          func(aliquot string) ([]types.SequencingExperiment, error)
	GetByAliquotAndSampleFunc func(aliquot string, submitterSampleId string, organizationCode string) (*types.SequencingExperiment, error)
}

func (m *mockSeqExpRepo) GetSequencingExperimentByAliquot(aliquot string) ([]types.SequencingExperiment, error) {
	return m.GetByAliquotFunc(aliquot)
}
func (m *mockSeqExpRepo) GetSequencingExperimentByAliquotAndSubmitterSample(aliquot string, submitterSampleId string, organizationCode string) (*types.SequencingExperiment, error) {
	return m.GetByAliquotAndSampleFunc(aliquot, submitterSampleId, organizationCode)
}

type mockTaskRepo struct {
	repository.TaskDAO
	GetContextBySeqExpFunc func(seqExpId int) ([]*types.TaskContext, error)
	GetHasDocByDocFunc     func(documentId int) ([]*types.TaskHasDocument, error)
}

func (m *mockTaskRepo) GetTaskContextBySequencingExperimentId(seqExpId int) ([]*types.TaskContext, error) {
	return m.GetContextBySeqExpFunc(seqExpId)
}
func (m *mockTaskRepo) GetTaskHasDocumentByDocumentId(documentId int) ([]*types.TaskHasDocument, error) {
	return m.GetHasDocByDocFunc(documentId)
}

type mockDocRepo struct {
	repository.DocumentsDAO
	GetByUrlFunc func(url string) (*types.Document, error)
}

func (m *mockDocRepo) GetDocumentByUrl(url string) (*types.Document, error) {
	return m.GetByUrlFunc(url)
}

func TestBatchValidationCache_GetOrganizationByCode(t *testing.T) {
	mockRepo := &mockOrgRepo{}
	ctx := &BatchValidationContext{OrgRepo: mockRepo}
	cache := NewBatchValidationCache(ctx)

	org := &types.Organization{ID: 1, Code: "ORG1"}

	// Test cache miss
	mockRepo.GetByCodeFunc = func(code string) (*types.Organization, error) {
		assert.Equal(t, "ORG1", code)
		return org, nil
	}
	result, err := cache.GetOrganizationByCode("ORG1")
	assert.NoError(t, err)
	assert.Equal(t, org, result)
	assert.Equal(t, org, cache.OrganizationsByCode["ORG1"])
	assert.Equal(t, org, cache.OrganizationsById[1])

	// Test cache hit (Repo should not be called again)
	mockRepo.GetByCodeFunc = func(code string) (*types.Organization, error) {
		t.Fatal("Repo should not be called on cache hit")
		return nil, nil
	}
	result, err = cache.GetOrganizationByCode("ORG1")
	assert.NoError(t, err)
	assert.Equal(t, org, result)
}

func TestBatchValidationCache_GetOrganizationById(t *testing.T) {
	mockRepo := &mockOrgRepo{}
	ctx := &BatchValidationContext{OrgRepo: mockRepo}
	cache := NewBatchValidationCache(ctx)

	org := &types.Organization{ID: 1, Code: "ORG1"}

	// Test cache miss
	mockRepo.GetByIdFunc = func(id int) (*types.Organization, error) {
		assert.Equal(t, 1, id)
		return org, nil
	}
	result, err := cache.GetOrganizationById(1)
	assert.NoError(t, err)
	assert.Equal(t, org, result)
	assert.Equal(t, org, cache.OrganizationsByCode["ORG1"])
	assert.Equal(t, org, cache.OrganizationsById[1])

	// Test cache hit
	mockRepo.GetByIdFunc = func(id int) (*types.Organization, error) {
		t.Fatal("Repo should not be called on cache hit")
		return nil, nil
	}
	result, err = cache.GetOrganizationById(1)
	assert.NoError(t, err)
	assert.Equal(t, org, result)
}

func TestBatchValidationCache_GetSampleById(t *testing.T) {
	mockRepo := &mockSampleRepo{}
	ctx := &BatchValidationContext{SampleRepo: mockRepo}
	cache := NewBatchValidationCache(ctx)

	sample := &types.Sample{ID: 10}

	// Test cache miss
	mockRepo.GetByIdFunc = func(id int) (*types.Sample, error) {
		assert.Equal(t, 10, id)
		return sample, nil
	}
	result, err := cache.GetSampleById(10)
	assert.NoError(t, err)
	assert.Equal(t, sample, result)
	assert.Equal(t, sample, cache.SamplesById[10])

	// Test cache hit
	mockRepo.GetByIdFunc = func(id int) (*types.Sample, error) {
		t.Fatal("Repo should not be called on cache hit")
		return nil, nil
	}
	result, err = cache.GetSampleById(10)
	assert.NoError(t, err)
	assert.Equal(t, sample, result)
}

func TestBatchValidationCache_GetValueSetCodes(t *testing.T) {
	mockRepo := &mockValueSetsRepo{}
	ctx := &BatchValidationContext{ValueSetsRepo: mockRepo}
	cache := NewBatchValidationCache(ctx)

	codes := []string{"C1", "C2"}

	// Test cache miss
	mockRepo.GetCodesFunc = func(vsType repository.ValueSetType) ([]string, error) {
		assert.Equal(t, repository.ValueSetStatus, vsType)
		return codes, nil
	}
	result, err := cache.GetValueSetCodes(repository.ValueSetStatus)
	assert.NoError(t, err)
	assert.Equal(t, codes, result)
	assert.Equal(t, codes, cache.ValueSets[repository.ValueSetStatus])

	// Test cache hit
	mockRepo.GetCodesFunc = func(vsType repository.ValueSetType) ([]string, error) {
		t.Fatal("Repo should not be called on cache hit")
		return nil, nil
	}
	result, err = cache.GetValueSetCodes(repository.ValueSetStatus)
	assert.NoError(t, err)
	assert.Equal(t, codes, result)
}

func TestBatchValidationCache_GetProjectByCode(t *testing.T) {
	mockRepo := &mockProjectRepo{}
	ctx := &BatchValidationContext{ProjectRepo: mockRepo}
	cache := NewBatchValidationCache(ctx)

	project := &types.Project{ID: 42, Code: "PROJ1"}

	// Test cache miss
	mockRepo.GetByCodeFunc = func(code string) (*types.Project, error) {
		assert.Equal(t, "PROJ1", code)
		return project, nil
	}
	result, err := cache.GetProjectByCode("PROJ1")
	assert.NoError(t, err)
	assert.Equal(t, project, result)
	assert.Equal(t, project, cache.Projects["PROJ1"])

	// Test cache hit
	mockRepo.GetByCodeFunc = func(code string) (*types.Project, error) {
		t.Fatal("Repo should not be called on cache hit")
		return nil, nil
	}
	result, err = cache.GetProjectByCode("PROJ1")
	assert.NoError(t, err)
	assert.Equal(t, project, result)
}

func TestBatchValidationCache_GetPatientByOrgCodeAndSubmitterPatientId(t *testing.T) {
	mockRepo := &mockPatientRepo{}
	ctx := &BatchValidationContext{PatientRepo: mockRepo}
	cache := NewBatchValidationCache(ctx)

	patient := &types.Patient{ID: 100, SubmitterPatientId: "PAT1"}
	key := PatientKey{"ORG1", "PAT1"}

	// Test cache miss
	mockRepo.GetByOrgAndSubmitterFunc = func(orgCode string, submitterPatientId string) (*types.Patient, error) {
		assert.Equal(t, "ORG1", orgCode)
		assert.Equal(t, "PAT1", submitterPatientId)
		return patient, nil
	}
	result, err := cache.GetPatientByOrgCodeAndSubmitterPatientId("ORG1", "PAT1")
	assert.NoError(t, err)
	assert.Equal(t, patient, result)
	assert.Equal(t, patient, cache.Patients[key])

	// Test cache hit
	mockRepo.GetByOrgAndSubmitterFunc = func(orgCode string, submitterPatientId string) (*types.Patient, error) {
		t.Fatal("Repo should not be called on cache hit")
		return nil, nil
	}
	result, err = cache.GetPatientByOrgCodeAndSubmitterPatientId("ORG1", "PAT1")
	assert.NoError(t, err)
	assert.Equal(t, patient, result)
}

func TestBatchValidationCache_GetSequencingExperimentByAliquot(t *testing.T) {
	mockRepo := &mockSeqExpRepo{}
	ctx := &BatchValidationContext{SeqExpRepo: mockRepo}
	cache := NewBatchValidationCache(ctx)

	seqExps := []types.SequencingExperiment{{ID: 200, Aliquot: "ALQ1"}}

	// Test cache miss
	mockRepo.GetByAliquotFunc = func(aliquot string) ([]types.SequencingExperiment, error) {
		assert.Equal(t, "ALQ1", aliquot)
		return seqExps, nil
	}
	result, err := cache.GetSequencingExperimentByAliquot("ALQ1")
	assert.NoError(t, err)
	assert.Equal(t, seqExps, result)
	assert.Equal(t, seqExps, cache.SequencingExperimentsByAliquot["ALQ1"])

	// Test cache hit
	mockRepo.GetByAliquotFunc = func(aliquot string) ([]types.SequencingExperiment, error) {
		t.Fatal("Repo should not be called on cache hit")
		return nil, nil
	}
	result, err = cache.GetSequencingExperimentByAliquot("ALQ1")
	assert.NoError(t, err)
	assert.Equal(t, seqExps, result)
}

func TestBatchValidationCache_GetDocumentByUrl(t *testing.T) {
	mockRepo := &mockDocRepo{}
	ctx := &BatchValidationContext{DocRepo: mockRepo}
	cache := NewBatchValidationCache(ctx)

	doc := &types.Document{ID: 500, Url: "s3://bucket/file.bam"}

	// Test cache miss
	mockRepo.GetByUrlFunc = func(url string) (*types.Document, error) {
		assert.Equal(t, "s3://bucket/file.bam", url)
		return doc, nil
	}
	result, err := cache.GetDocumentByUrl("s3://bucket/file.bam")
	assert.NoError(t, err)
	assert.Equal(t, doc, result)
	assert.Equal(t, doc, cache.Documents["s3://bucket/file.bam"])

	// Test cache hit
	mockRepo.GetByUrlFunc = func(url string) (*types.Document, error) {
		t.Fatal("Repo should not be called on cache hit")
		return nil, nil
	}
	result, err = cache.GetDocumentByUrl("s3://bucket/file.bam")
	assert.NoError(t, err)
	assert.Equal(t, doc, result)
}

func TestBatchValidationCache_GetCaseAnalysisCatalogByCode(t *testing.T) {
	mockRepo := &mockCasesRepo{}
	ctx := &BatchValidationContext{CasesRepo: mockRepo}
	cache := NewBatchValidationCache(ctx)

	ac := &types.AnalysisCatalog{ID: 1, Code: "WGS"}

	// Test cache miss
	mockRepo.GetAnalysisCatalogFunc = func(code string) (*types.AnalysisCatalog, error) {
		assert.Equal(t, "WGS", code)
		return ac, nil
	}
	result, err := cache.GetCaseAnalysisCatalogByCode("WGS")
	assert.NoError(t, err)
	assert.Equal(t, ac, result)
	assert.Equal(t, ac, cache.AnalysisCatalogIDs["WGS"])

	// Test cache hit
	mockRepo.GetAnalysisCatalogFunc = func(code string) (*types.AnalysisCatalog, error) {
		t.Fatal("Repo should not be called on cache hit")
		return nil, nil
	}
	result, err = cache.GetCaseAnalysisCatalogByCode("WGS")
	assert.NoError(t, err)
	assert.Equal(t, ac, result)
}

func TestBatchValidationCache_GetCaseBySubmitterCaseIdAndProjectId(t *testing.T) {
	mockRepo := &mockCasesRepo{}
	ctx := &BatchValidationContext{CasesRepo: mockRepo}
	cache := NewBatchValidationCache(ctx)

	cs := &types.Case{ID: 1, SubmitterCaseID: "CASE1", ProjectID: 42}
	key := CaseKey{42, "CASE1"}

	// Test cache miss
	mockRepo.GetCaseBySubmitterFunc = func(id string, pid int) (*types.Case, error) {
		assert.Equal(t, "CASE1", id)
		assert.Equal(t, 42, pid)
		return cs, nil
	}
	result, err := cache.GetCaseBySubmitterCaseIdAndProjectId("CASE1", 42)
	assert.NoError(t, err)
	assert.Equal(t, cs, result)
	assert.Equal(t, cs, cache.Cases[key])

	// Test cache hit
	mockRepo.GetCaseBySubmitterFunc = func(id string, pid int) (*types.Case, error) {
		t.Fatal("Repo should not be called on cache hit")
		return nil, nil
	}
	result, err = cache.GetCaseBySubmitterCaseIdAndProjectId("CASE1", 42)
	assert.NoError(t, err)
	assert.Equal(t, cs, result)
}

func TestBatchValidationCache_GetSequencingExperimentByAliquotAndSubmitterSample(t *testing.T) {
	mockRepo := &mockSeqExpRepo{}
	ctx := &BatchValidationContext{SeqExpRepo: mockRepo}
	cache := NewBatchValidationCache(ctx)

	seqExp := &types.SequencingExperiment{ID: 1, Aliquot: "ALQ1"}
	key := SequencingExperimentKey{"ORG1", "SMP1", "ALQ1"}

	// Test cache miss
	mockRepo.GetByAliquotAndSampleFunc = func(aliquot, sample, org string) (*types.SequencingExperiment, error) {
		assert.Equal(t, "ALQ1", aliquot)
		assert.Equal(t, "SMP1", sample)
		assert.Equal(t, "ORG1", org)
		return seqExp, nil
	}
	result, err := cache.GetSequencingExperimentByAliquotAndSubmitterSample("ALQ1", "SMP1", "ORG1")
	assert.NoError(t, err)
	assert.Equal(t, seqExp, result)
	assert.Equal(t, seqExp, cache.SequencingExperimentsByKey[key])

	// Test cache hit
	mockRepo.GetByAliquotAndSampleFunc = func(aliquot, sample, org string) (*types.SequencingExperiment, error) {
		t.Fatal("Repo should not be called on cache hit")
		return nil, nil
	}
	result, err = cache.GetSequencingExperimentByAliquotAndSubmitterSample("ALQ1", "SMP1", "ORG1")
	assert.NoError(t, err)
	assert.Equal(t, seqExp, result)
}

func TestBatchValidationCache_GetTaskContextBySequencingExperimentId(t *testing.T) {
	mockRepo := &mockTaskRepo{}
	ctx := &BatchValidationContext{TaskRepo: mockRepo}
	cache := NewBatchValidationCache(ctx)

	tc := []*types.TaskContext{{TaskID: 1, SequencingExperimentID: 200}}

	// Test cache miss
	mockRepo.GetContextBySeqExpFunc = func(id int) ([]*types.TaskContext, error) {
		assert.Equal(t, 200, id)
		return tc, nil
	}
	result, err := cache.GetTaskContextBySequencingExperimentId(200)
	assert.NoError(t, err)
	assert.Equal(t, tc, result)
	assert.Equal(t, tc, cache.TaskContext[200])

	// Test cache hit
	mockRepo.GetContextBySeqExpFunc = func(id int) ([]*types.TaskContext, error) {
		t.Fatal("Repo should not be called on cache hit")
		return nil, nil
	}
	result, err = cache.GetTaskContextBySequencingExperimentId(200)
	assert.NoError(t, err)
	assert.Equal(t, tc, result)
}

func TestBatchValidationCache_GetTaskHasDocumentByDocumentId(t *testing.T) {
	mockRepo := &mockTaskRepo{}
	ctx := &BatchValidationContext{TaskRepo: mockRepo}
	cache := NewBatchValidationCache(ctx)

	thd := []*types.TaskHasDocument{{TaskID: 1, DocumentID: 500}}

	// Test cache miss
	mockRepo.GetHasDocByDocFunc = func(id int) ([]*types.TaskHasDocument, error) {
		assert.Equal(t, 500, id)
		return thd, nil
	}
	result, err := cache.GetTaskHasDocumentByDocumentId(500)
	assert.NoError(t, err)
	assert.Equal(t, thd, result)
	assert.Equal(t, thd, cache.TaskHasDocuments[500])

	// Test cache hit
	mockRepo.GetHasDocByDocFunc = func(id int) ([]*types.TaskHasDocument, error) {
		t.Fatal("Repo should not be called on cache hit")
		return nil, nil
	}
	result, err = cache.GetTaskHasDocumentByDocumentId(500)
	assert.NoError(t, err)
	assert.Equal(t, thd, result)
}

func TestBatchValidationCache_GetSampleBySubmitterSampleId(t *testing.T) {
	mockRepo := &mockSampleRepo{}
	orgRepo := &mockOrgRepo{}
	ctx := &BatchValidationContext{SampleRepo: mockRepo, OrgRepo: orgRepo}
	cache := NewBatchValidationCache(ctx)

	sample := &types.Sample{ID: 10, OrganizationId: 1, SubmitterSampleId: "S1"}

	// Test cache miss
	orgRepo.GetByIdFunc = func(id int) (*types.Organization, error) {
		assert.Equal(t, 1, id)
		return &types.Organization{ID: 1, Code: "ORG1"}, nil
	}
	mockRepo.GetSampleByOrgCodeAndSubmitterSampleIdFunc = func(orgCode string, id string) (*types.Sample, error) {
		assert.Equal(t, "ORG1", orgCode)
		assert.Equal(t, "S1", id)
		return sample, nil
	}
	result, err := cache.GetSampleBySubmitterSampleId(1, "S1")
	assert.NoError(t, err)
	assert.Equal(t, sample, result)
	assert.Equal(t, sample, cache.SamplesById[10])

	// Test cache hit
	mockRepo.GetBySubmitterSampleIdFunc = func(orgID int, id string) (*types.Sample, error) {
		t.Fatal("Repo should not be called on cache hit")
		return nil, nil
	}
	result, err = cache.GetSampleBySubmitterSampleId(1, "S1")
	assert.NoError(t, err)
	assert.Equal(t, sample, result)
}

func TestBatchValidationCache_GetSampleByOrgCodeAndSubmitterSampleId(t *testing.T) {
	mockSample := &mockSampleRepo{}
	ctx := &BatchValidationContext{SampleRepo: mockSample}
	cache := NewBatchValidationCache(ctx)
	sample := &types.Sample{ID: 10, OrganizationId: 1, SubmitterSampleId: "S1"}

	// Test miss for both org and sample
	mockSample.GetSampleByOrgCodeAndSubmitterSampleIdFunc = func(orgCode string, id string) (*types.Sample, error) {
		return sample, nil
	}

	result, err := cache.GetSampleByOrgCodeAndSubmitterSampleId("ORG1", "S1")
	assert.NoError(t, err)
	assert.Equal(t, sample, result)

	// Test hit for both
	mockSample.GetBySubmitterSampleIdFunc = func(orgID int, id string) (*types.Sample, error) {
		t.Fatal("Sample Repo should not be called")
		return nil, nil
	}
	result, err = cache.GetSampleByOrgCodeAndSubmitterSampleId("ORG1", "S1")
	assert.NoError(t, err)
	assert.Equal(t, sample, result)
}

func TestBatchValidationCache_Errors(t *testing.T) {
	mockRepo := &mockOrgRepo{}
	ctx := &BatchValidationContext{OrgRepo: mockRepo}
	cache := NewBatchValidationCache(ctx)

	expectedErr := errors.New("db error")

	mockRepo.GetByCodeFunc = func(code string) (*types.Organization, error) {
		return nil, expectedErr
	}

	result, err := cache.GetOrganizationByCode("ORG1")
	assert.Error(t, err)
	assert.Nil(t, result)
	assert.Equal(t, expectedErr, err)
}
