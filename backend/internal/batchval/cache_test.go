package batchval

import (
	"context"
	"errors"
	"testing"

	"github.com/radiant-network/radiant-api/internal/repository/postgres"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/stretchr/testify/assert"
)

// Mock repositories
type mockOrgRepo struct {
	GetByCodeFunc func(code string, tenantCode string) (*types.Organization, error)
}

func (m *mockOrgRepo) GetOrganizationByCode(_ context.Context, code string, tenantCode string) (*types.Organization, error) {
	return m.GetByCodeFunc(code, tenantCode)
}

type mockSampleRepo struct {
	GetByIdFunc                                func(id int) (*types.Sample, error)
	GetSampleByOrgCodeAndSubmitterSampleIdFunc func(orgCode string, submitterSampleId string, tenantCode string) (*types.Sample, error)
}

func (m *mockSampleRepo) GetSampleById(_ context.Context, id int) (*types.Sample, error) {
	return m.GetByIdFunc(id)
}
func (m *mockSampleRepo) GetSampleByOrgCodeAndSubmitterSampleId(_ context.Context, orgCode string, submitterSampleId string, tenantCode string) (*types.Sample, error) {
	return m.GetSampleByOrgCodeAndSubmitterSampleIdFunc(orgCode, submitterSampleId, tenantCode)
}
func (m *mockSampleRepo) GetFetusIDsWithSamples(_ context.Context, _ []int) ([]int, error) {
	return nil, nil
}

type mockValueSetsRepo struct {
	GetCodesFunc     func(vsType postgres.ValueSetType) ([]string, error)
	GetExamCodesFunc func(tenantCode string) ([]string, error)
}

func (m *mockValueSetsRepo) GetCodes(_ context.Context, vsType postgres.ValueSetType) ([]string, error) {
	return m.GetCodesFunc(vsType)
}

func (m *mockValueSetsRepo) GetExamCodes(_ context.Context, tenantCode string) ([]string, error) {
	return m.GetExamCodesFunc(tenantCode)
}

type mockProjectRepo struct {
	GetByCodeFunc func(code string, tenantCode string) (*types.Project, error)
}

func (m *mockProjectRepo) GetProjectByCode(_ context.Context, code string, tenantCode string) (*types.Project, error) {
	return m.GetByCodeFunc(code, tenantCode)
}

type mockCasesRepo struct {
	GetAnalysisCatalogFunc func(code string, tenantCode string) (*types.AnalysisCatalog, error)
	GetCaseBySubmitterFunc func(submitterCaseId string, projectId int, tenantCode string) (*types.Case, error)
}

func (m *mockCasesRepo) GetCaseAnalysisCatalogIdByCode(_ context.Context, code string, tenantCode string) (*types.AnalysisCatalog, error) {
	return m.GetAnalysisCatalogFunc(code, tenantCode)
}
func (m *mockCasesRepo) GetCaseBySubmitterCaseIdAndProjectId(_ context.Context, submitterCaseId string, projectId int, tenantCode string) (*types.Case, error) {
	return m.GetCaseBySubmitterFunc(submitterCaseId, projectId, tenantCode)
}

type mockPatientRepo struct {
	GetByOrgAndSubmitterFunc func(orgCode string, submitterPatientId string, tenantCode string) (*types.Patient, error)
}

func (m *mockPatientRepo) GetPatientByOrgCodeAndSubmitterPatientId(_ context.Context, orgCode string, submitterPatientId string, tenantCode string) (*types.Patient, error) {
	return m.GetByOrgAndSubmitterFunc(orgCode, submitterPatientId, tenantCode)
}

type mockSeqExpRepo struct {
	GetByAliquotFunc          func(aliquot string, tenantCode string) ([]types.SequencingExperiment, error)
	GetByAliquotAndSampleFunc func(aliquot string, submitterSampleId string, organizationCode string, tenantCode string) (*types.SequencingExperiment, error)
	GetByCaseIdFunc           func(caseID int) ([]types.SequencingExperiment, error)
}

func (m *mockSeqExpRepo) GetSequencingExperimentByAliquot(_ context.Context, aliquot string, tenantCode string) ([]types.SequencingExperiment, error) {
	return m.GetByAliquotFunc(aliquot, tenantCode)
}
func (m *mockSeqExpRepo) GetSequencingExperimentByAliquotAndSubmitterSample(_ context.Context, aliquot string, submitterSampleId string, organizationCode string, tenantCode string) (*types.SequencingExperiment, error) {
	return m.GetByAliquotAndSampleFunc(aliquot, submitterSampleId, organizationCode, tenantCode)
}
func (m *mockSeqExpRepo) GetSequencingExperimentsByCaseId(_ context.Context, caseID int) ([]types.SequencingExperiment, error) {
	return m.GetByCaseIdFunc(caseID)
}

type mockTaskRepo struct {
	GetContextBySeqExpFunc func(seqExpId int) ([]*types.TaskContext, error)
	GetHasDocByDocFunc     func(documentId int, tenantCode string) ([]*types.TaskHasDocument, error)
}

func (m *mockTaskRepo) GetTaskContextBySequencingExperimentId(_ context.Context, seqExpId int) ([]*types.TaskContext, error) {
	return m.GetContextBySeqExpFunc(seqExpId)
}
func (m *mockTaskRepo) GetTaskHasDocumentByDocumentId(_ context.Context, documentId int, tenantCode string) ([]*types.TaskHasDocument, error) {
	return m.GetHasDocByDocFunc(documentId, tenantCode)
}

type mockDocRepo struct {
	GetByUrlFunc func(url string, tenantCode string) (*types.Document, error)
}

func (m *mockDocRepo) GetDocumentByUrl(_ context.Context, url string, tenantCode string) (*types.Document, error) {
	return m.GetByUrlFunc(url, tenantCode)
}

func TestBatchValidationCache_GetOrganizationByCode(t *testing.T) {
	mockRepo := &mockOrgRepo{}
	ctx := &BatchValidationContext{OrgRepo: mockRepo}
	cache := NewBatchValidationCache(ctx)

	org := &types.Organization{Code: "ORG1", TenantCode: types.DefaultTenantCode}

	// Test cache miss
	mockRepo.GetByCodeFunc = func(code string, tenantCode string) (*types.Organization, error) {
		assert.Equal(t, "ORG1", code)
		assert.Equal(t, types.DefaultTenantCode, tenantCode)
		return org, nil
	}
	result, err := cache.GetOrganizationByCode(t.Context(), "ORG1", types.DefaultTenantCode)
	assert.NoError(t, err)
	assert.Equal(t, org, result)
	assert.Equal(t, org, cache.OrganizationsByCode[OrganizationKey{Code: "ORG1", TenantCode: types.DefaultTenantCode}])

	// Test cache hit (Repo should not be called again)
	mockRepo.GetByCodeFunc = func(code string, tenantCode string) (*types.Organization, error) {
		t.Fatal("Repo should not be called on cache hit")
		return nil, nil
	}
	result, err = cache.GetOrganizationByCode(t.Context(), "ORG1", types.DefaultTenantCode)
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
	result, err := cache.GetSampleById(t.Context(), 10)
	assert.NoError(t, err)
	assert.Equal(t, sample, result)
	assert.Equal(t, sample, cache.SamplesById[10])

	// Test cache hit
	mockRepo.GetByIdFunc = func(id int) (*types.Sample, error) {
		t.Fatal("Repo should not be called on cache hit")
		return nil, nil
	}
	result, err = cache.GetSampleById(t.Context(), 10)
	assert.NoError(t, err)
	assert.Equal(t, sample, result)
}

func TestBatchValidationCache_GetValueSetCodes(t *testing.T) {
	mockRepo := &mockValueSetsRepo{}
	ctx := &BatchValidationContext{ValueSetsRepo: mockRepo}
	cache := NewBatchValidationCache(ctx)

	codes := []string{"C1", "C2"}

	// Test cache miss
	mockRepo.GetCodesFunc = func(vsType postgres.ValueSetType) ([]string, error) {
		assert.Equal(t, postgres.ValueSetStatus, vsType)
		return codes, nil
	}
	result, err := cache.GetValueSetCodes(t.Context(), postgres.ValueSetStatus)
	assert.NoError(t, err)
	assert.Equal(t, codes, result)
	assert.Equal(t, codes, cache.ValueSets[postgres.ValueSetStatus])

	// Test cache hit
	mockRepo.GetCodesFunc = func(vsType postgres.ValueSetType) ([]string, error) {
		t.Fatal("Repo should not be called on cache hit")
		return nil, nil
	}
	result, err = cache.GetValueSetCodes(t.Context(), postgres.ValueSetStatus)
	assert.NoError(t, err)
	assert.Equal(t, codes, result)
}

func TestBatchValidationCache_GetProjectByCode(t *testing.T) {
	mockRepo := &mockProjectRepo{}
	ctx := &BatchValidationContext{ProjectRepo: mockRepo}
	cache := NewBatchValidationCache(ctx)

	project := &types.Project{ID: 42, Code: "PROJ1"}

	// Test cache miss
	mockRepo.GetByCodeFunc = func(code string, tenantCode string) (*types.Project, error) {
		assert.Equal(t, "PROJ1", code)
		assert.Equal(t, types.DefaultTenantCode, tenantCode)
		return project, nil
	}
	result, err := cache.GetProjectByCode(t.Context(), "PROJ1", types.DefaultTenantCode)
	assert.NoError(t, err)
	assert.Equal(t, project, result)
	assert.Equal(t, project, cache.Projects[ProjectKey{Code: "PROJ1", TenantCode: types.DefaultTenantCode}])

	// Test cache hit
	mockRepo.GetByCodeFunc = func(code string, tenantCode string) (*types.Project, error) {
		t.Fatal("Repo should not be called on cache hit")
		return nil, nil
	}
	result, err = cache.GetProjectByCode(t.Context(), "PROJ1", types.DefaultTenantCode)
	assert.NoError(t, err)
	assert.Equal(t, project, result)
}

func TestBatchValidationCache_GetPatientByOrgCodeAndSubmitterPatientId(t *testing.T) {
	mockRepo := &mockPatientRepo{}
	ctx := &BatchValidationContext{PatientRepo: mockRepo}
	cache := NewBatchValidationCache(ctx)

	patient := &types.Patient{ID: 100, SubmitterPatientId: "PAT1"}
	key := PatientKey{OrganizationCode: "ORG1", SubmitterPatientId: "PAT1", TenantCode: "tenant1"}

	// Test cache miss
	mockRepo.GetByOrgAndSubmitterFunc = func(orgCode string, submitterPatientId string, tenantCode string) (*types.Patient, error) {
		assert.Equal(t, "ORG1", orgCode)
		assert.Equal(t, "PAT1", submitterPatientId)
		assert.Equal(t, "tenant1", tenantCode)
		return patient, nil
	}
	result, err := cache.GetPatientByOrgCodeAndSubmitterPatientId(t.Context(), "ORG1", "PAT1", "tenant1")
	assert.NoError(t, err)
	assert.Equal(t, patient, result)
	assert.Equal(t, patient, cache.Patients[key])

	// Test cache hit
	mockRepo.GetByOrgAndSubmitterFunc = func(orgCode string, submitterPatientId string, tenantCode string) (*types.Patient, error) {
		t.Fatal("Repo should not be called on cache hit")
		return nil, nil
	}
	result, err = cache.GetPatientByOrgCodeAndSubmitterPatientId(t.Context(), "ORG1", "PAT1", "tenant1")
	assert.NoError(t, err)
	assert.Equal(t, patient, result)
}

func TestBatchValidationCache_GetPatientByOrgCodeAndSubmitterPatientId_TenantScoped(t *testing.T) {
	mockRepo := &mockPatientRepo{}
	ctx := &BatchValidationContext{PatientRepo: mockRepo}
	cache := NewBatchValidationCache(ctx)

	patientTenant1 := &types.Patient{ID: 100, SubmitterPatientId: "PAT1", TenantCode: "tenant1"}
	patientTenant2 := &types.Patient{ID: 200, SubmitterPatientId: "PAT1", TenantCode: "tenant2"}

	mockRepo.GetByOrgAndSubmitterFunc = func(_ string, _ string, tenantCode string) (*types.Patient, error) {
		if tenantCode == "tenant1" {
			return patientTenant1, nil
		}
		return patientTenant2, nil
	}

	result1, err := cache.GetPatientByOrgCodeAndSubmitterPatientId(t.Context(), "ORG1", "PAT1", "tenant1")
	assert.NoError(t, err)
	assert.Equal(t, patientTenant1, result1)

	result2, err := cache.GetPatientByOrgCodeAndSubmitterPatientId(t.Context(), "ORG1", "PAT1", "tenant2")
	assert.NoError(t, err)
	assert.Equal(t, patientTenant2, result2)
	assert.NotEqual(t, result1, result2, "same org_code/submitter_patient_id in different tenants must not collide in cache")
}

func TestBatchValidationCache_GetSequencingExperimentByAliquot(t *testing.T) {
	mockRepo := &mockSeqExpRepo{}
	ctx := &BatchValidationContext{SeqExpRepo: mockRepo}
	cache := NewBatchValidationCache(ctx)

	seqExps := []types.SequencingExperiment{{ID: 200, Aliquot: "ALQ1"}}

	// Test cache miss
	mockRepo.GetByAliquotFunc = func(aliquot string, tenantCode string) ([]types.SequencingExperiment, error) {
		assert.Equal(t, "ALQ1", aliquot)
		assert.Equal(t, types.DefaultTenantCode, tenantCode)
		return seqExps, nil
	}
	result, err := cache.GetSequencingExperimentByAliquot(t.Context(), "ALQ1", types.DefaultTenantCode)
	assert.NoError(t, err)
	assert.Equal(t, seqExps, result)
	assert.Equal(t, seqExps, cache.SequencingExperimentsByAliquot[AliquotKey{Aliquot: "ALQ1", TenantCode: types.DefaultTenantCode}])

	// Test cache hit
	mockRepo.GetByAliquotFunc = func(aliquot string, tenantCode string) ([]types.SequencingExperiment, error) {
		t.Fatal("Repo should not be called on cache hit")
		return nil, nil
	}
	result, err = cache.GetSequencingExperimentByAliquot(t.Context(), "ALQ1", types.DefaultTenantCode)
	assert.NoError(t, err)
	assert.Equal(t, seqExps, result)
}

func TestBatchValidationCache_GetDocumentByUrl(t *testing.T) {
	mockRepo := &mockDocRepo{}
	ctx := &BatchValidationContext{DocRepo: mockRepo}
	cache := NewBatchValidationCache(ctx)

	doc := &types.Document{ID: 500, Url: "s3://bucket/file.bam"}

	// Test cache miss
	mockRepo.GetByUrlFunc = func(url string, tenantCode string) (*types.Document, error) {
		assert.Equal(t, "s3://bucket/file.bam", url)
		assert.Equal(t, types.DefaultTenantCode, tenantCode)
		return doc, nil
	}
	result, err := cache.GetDocumentByUrl(t.Context(), "s3://bucket/file.bam", types.DefaultTenantCode)
	assert.NoError(t, err)
	assert.Equal(t, doc, result)
	assert.Equal(t, doc, cache.Documents[DocumentKey{Url: "s3://bucket/file.bam", TenantCode: types.DefaultTenantCode}])

	// Test cache hit
	mockRepo.GetByUrlFunc = func(url string, tenantCode string) (*types.Document, error) {
		t.Fatal("Repo should not be called on cache hit")
		return nil, nil
	}
	result, err = cache.GetDocumentByUrl(t.Context(), "s3://bucket/file.bam", types.DefaultTenantCode)
	assert.NoError(t, err)
	assert.Equal(t, doc, result)
}

func TestBatchValidationCache_GetCaseAnalysisCatalogByCode(t *testing.T) {
	mockRepo := &mockCasesRepo{}
	ctx := &BatchValidationContext{CasesRepo: mockRepo}
	cache := NewBatchValidationCache(ctx)

	ac := &types.AnalysisCatalog{ID: 1, Code: "WGS"}

	// Test cache miss
	mockRepo.GetAnalysisCatalogFunc = func(code string, tenantCode string) (*types.AnalysisCatalog, error) {
		assert.Equal(t, "WGS", code)
		assert.Equal(t, types.DefaultTenantCode, tenantCode)
		return ac, nil
	}
	result, err := cache.GetCaseAnalysisCatalogByCode(t.Context(), "WGS", types.DefaultTenantCode)
	assert.NoError(t, err)
	assert.Equal(t, ac, result)
	assert.Equal(t, ac, cache.AnalysisCatalogs[AnalysisCatalogKey{Code: "WGS", TenantCode: types.DefaultTenantCode}])

	// Test cache hit
	mockRepo.GetAnalysisCatalogFunc = func(code string, tenantCode string) (*types.AnalysisCatalog, error) {
		t.Fatal("Repo should not be called on cache hit")
		return nil, nil
	}
	result, err = cache.GetCaseAnalysisCatalogByCode(t.Context(), "WGS", types.DefaultTenantCode)
	assert.NoError(t, err)
	assert.Equal(t, ac, result)
}

func TestBatchValidationCache_GetCaseBySubmitterCaseIdAndProjectId(t *testing.T) {
	mockRepo := &mockCasesRepo{}
	ctx := &BatchValidationContext{CasesRepo: mockRepo}
	cache := NewBatchValidationCache(ctx)

	cs := &types.Case{ID: 1, SubmitterCaseID: "CASE1", ProjectID: 42}
	key := CaseKey{ProjectId: 42, SubmitterCaseId: "CASE1", TenantCode: types.DefaultTenantCode}

	// Test cache miss
	mockRepo.GetCaseBySubmitterFunc = func(id string, pid int, tenantCode string) (*types.Case, error) {
		assert.Equal(t, "CASE1", id)
		assert.Equal(t, 42, pid)
		assert.Equal(t, types.DefaultTenantCode, tenantCode)
		return cs, nil
	}
	result, err := cache.GetCaseBySubmitterCaseIdAndProjectId(t.Context(), "CASE1", 42, types.DefaultTenantCode)
	assert.NoError(t, err)
	assert.Equal(t, cs, result)
	assert.Equal(t, cs, cache.Cases[key])

	// Test cache hit
	mockRepo.GetCaseBySubmitterFunc = func(id string, pid int, tenantCode string) (*types.Case, error) {
		t.Fatal("Repo should not be called on cache hit")
		return nil, nil
	}
	result, err = cache.GetCaseBySubmitterCaseIdAndProjectId(t.Context(), "CASE1", 42, types.DefaultTenantCode)
	assert.NoError(t, err)
	assert.Equal(t, cs, result)
}

func TestBatchValidationCache_GetSequencingExperimentByAliquotAndSubmitterSample(t *testing.T) {
	mockRepo := &mockSeqExpRepo{}
	ctx := &BatchValidationContext{SeqExpRepo: mockRepo}
	cache := NewBatchValidationCache(ctx)

	seqExp := &types.SequencingExperiment{ID: 1, Aliquot: "ALQ1"}
	key := SequencingExperimentKey{SampleOrganizationCode: "ORG1", SubmitterSampleId: "SMP1", Aliquot: "ALQ1", TenantCode: types.DefaultTenantCode}

	// Test cache miss
	mockRepo.GetByAliquotAndSampleFunc = func(aliquot, sample, org, tenantCode string) (*types.SequencingExperiment, error) {
		assert.Equal(t, "ALQ1", aliquot)
		assert.Equal(t, "SMP1", sample)
		assert.Equal(t, "ORG1", org)
		assert.Equal(t, types.DefaultTenantCode, tenantCode)
		return seqExp, nil
	}
	result, err := cache.GetSequencingExperimentByAliquotAndSubmitterSample(t.Context(), "ALQ1", "SMP1", "ORG1", types.DefaultTenantCode)
	assert.NoError(t, err)
	assert.Equal(t, seqExp, result)
	assert.Equal(t, seqExp, cache.SequencingExperimentsByKey[key])

	// Test cache hit
	mockRepo.GetByAliquotAndSampleFunc = func(aliquot, sample, org, tenantCode string) (*types.SequencingExperiment, error) {
		t.Fatal("Repo should not be called on cache hit")
		return nil, nil
	}
	result, err = cache.GetSequencingExperimentByAliquotAndSubmitterSample(t.Context(), "ALQ1", "SMP1", "ORG1", types.DefaultTenantCode)
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
	result, err := cache.GetTaskContextBySequencingExperimentId(t.Context(), 200)
	assert.NoError(t, err)
	assert.Equal(t, tc, result)
	assert.Equal(t, tc, cache.TaskContext[200])

	// Test cache hit
	mockRepo.GetContextBySeqExpFunc = func(id int) ([]*types.TaskContext, error) {
		t.Fatal("Repo should not be called on cache hit")
		return nil, nil
	}
	result, err = cache.GetTaskContextBySequencingExperimentId(t.Context(), 200)
	assert.NoError(t, err)
	assert.Equal(t, tc, result)
}

func TestBatchValidationCache_GetTaskHasDocumentByDocumentId(t *testing.T) {
	mockRepo := &mockTaskRepo{}
	ctx := &BatchValidationContext{TaskRepo: mockRepo}
	cache := NewBatchValidationCache(ctx)

	thd := []*types.TaskHasDocument{{TaskID: 1, DocumentID: 500}}

	// Test cache miss
	mockRepo.GetHasDocByDocFunc = func(id int, tenantCode string) ([]*types.TaskHasDocument, error) {
		assert.Equal(t, 500, id)
		assert.Equal(t, types.DefaultTenantCode, tenantCode)
		return thd, nil
	}
	result, err := cache.GetTaskHasDocumentByDocumentId(t.Context(), 500, types.DefaultTenantCode)
	assert.NoError(t, err)
	assert.Equal(t, thd, result)
	assert.Equal(t, thd, cache.TaskHasDocuments[500])

	// Test cache hit
	mockRepo.GetHasDocByDocFunc = func(id int, tenantCode string) ([]*types.TaskHasDocument, error) {
		t.Fatal("Repo should not be called on cache hit")
		return nil, nil
	}
	result, err = cache.GetTaskHasDocumentByDocumentId(t.Context(), 500, types.DefaultTenantCode)
	assert.NoError(t, err)
	assert.Equal(t, thd, result)
}

func TestBatchValidationCache_GetSampleByOrgCodeAndSubmitterSampleId(t *testing.T) {
	mockSample := &mockSampleRepo{}
	ctx := &BatchValidationContext{SampleRepo: mockSample}
	cache := NewBatchValidationCache(ctx)
	sample := &types.Sample{ID: 10, OrganizationCode: "ORG1", TenantCode: types.DefaultTenantCode, SubmitterSampleId: "S1"}

	// Test miss for both org and sample
	mockSample.GetSampleByOrgCodeAndSubmitterSampleIdFunc = func(orgCode string, id string, tenantCode string) (*types.Sample, error) {
		assert.Equal(t, types.DefaultTenantCode, tenantCode)
		return sample, nil
	}

	result, err := cache.GetSampleByOrgCodeAndSubmitterSampleId(t.Context(), "ORG1", "S1", types.DefaultTenantCode)
	assert.NoError(t, err)
	assert.Equal(t, sample, result)

	// Test hit for both
	mockSample.GetSampleByOrgCodeAndSubmitterSampleIdFunc = func(orgCode string, id string, tenantCode string) (*types.Sample, error) {
		t.Fatal("Sample Repo should not be called")
		return nil, nil
	}
	result, err = cache.GetSampleByOrgCodeAndSubmitterSampleId(t.Context(), "ORG1", "S1", types.DefaultTenantCode)
	assert.NoError(t, err)
	assert.Equal(t, sample, result)
}

func TestBatchValidationCache_Errors(t *testing.T) {
	mockRepo := &mockOrgRepo{}
	ctx := &BatchValidationContext{OrgRepo: mockRepo}
	cache := NewBatchValidationCache(ctx)

	expectedErr := errors.New("db error")

	mockRepo.GetByCodeFunc = func(code string, tenantCode string) (*types.Organization, error) {
		return nil, expectedErr
	}

	result, err := cache.GetOrganizationByCode(t.Context(), "ORG1", types.DefaultTenantCode)
	assert.Error(t, err)
	assert.Nil(t, result)
	assert.Equal(t, expectedErr, err)
}

func TestBatchValidationCache_GetExamCodes_IsScopedByTenant(t *testing.T) {
	mockRepo := &mockValueSetsRepo{}
	ctx := &BatchValidationContext{ValueSetsRepo: mockRepo}
	cache := NewBatchValidationCache(ctx)

	mockRepo.GetExamCodesFunc = func(tenantCode string) ([]string, error) {
		return []string{tenantCode + "-exam"}, nil
	}

	qlin, err := cache.GetExamCodes(t.Context(), "qlin")
	assert.NoError(t, err)
	assert.Equal(t, []string{"qlin-exam"}, qlin)

	radiant, err := cache.GetExamCodes(t.Context(), "radiant")
	assert.NoError(t, err)
	assert.Equal(t, []string{"radiant-exam"}, radiant)

	// Cache hit: a second read of a known tenant must not reach the repository.
	mockRepo.GetExamCodesFunc = func(string) ([]string, error) {
		t.Fatal("Repo should not be called on cache hit")
		return nil, nil
	}
	again, err := cache.GetExamCodes(t.Context(), "qlin")
	assert.NoError(t, err)
	assert.Equal(t, []string{"qlin-exam"}, again)
}

func TestBatchValidationCache_GetOrganizationByCode_TenantScoped(t *testing.T) {
	mockRepo := &mockOrgRepo{}
	ctx := &BatchValidationContext{OrgRepo: mockRepo}
	cache := NewBatchValidationCache(ctx)

	mockRepo.GetByCodeFunc = func(code string, tenantCode string) (*types.Organization, error) {
		return &types.Organization{Code: code, TenantCode: tenantCode}, nil
	}

	radiant, err := cache.GetOrganizationByCode(t.Context(), "CQGC", "radiant")
	assert.NoError(t, err)
	cypress, err := cache.GetOrganizationByCode(t.Context(), "CQGC", "cypress")
	assert.NoError(t, err)
	assert.Equal(t, "radiant", radiant.TenantCode)
	assert.Equal(t, "cypress", cypress.TenantCode)
}

func TestBatchValidationCache_GetProjectByCode_TenantScoped(t *testing.T) {
	mockRepo := &mockProjectRepo{}
	ctx := &BatchValidationContext{ProjectRepo: mockRepo}
	cache := NewBatchValidationCache(ctx)

	// types.Project carries no tenant_code column, so the tenant's row is identified by its id.
	ids := map[string]int{"radiant": 1, "cypress": 2}
	mockRepo.GetByCodeFunc = func(code string, tenantCode string) (*types.Project, error) {
		return &types.Project{ID: ids[tenantCode], Code: code}, nil
	}

	radiant, err := cache.GetProjectByCode(t.Context(), "PROJ1", "radiant")
	assert.NoError(t, err)
	cypress, err := cache.GetProjectByCode(t.Context(), "PROJ1", "cypress")
	assert.NoError(t, err)
	assert.Equal(t, 1, radiant.ID)
	assert.Equal(t, 2, cypress.ID)
}

func TestBatchValidationCache_GetSampleByOrgCodeAndSubmitterSampleId_TenantScoped(t *testing.T) {
	mockRepo := &mockSampleRepo{}
	ctx := &BatchValidationContext{SampleRepo: mockRepo}
	cache := NewBatchValidationCache(ctx)

	mockRepo.GetSampleByOrgCodeAndSubmitterSampleIdFunc = func(orgCode string, id string, tenantCode string) (*types.Sample, error) {
		return &types.Sample{OrganizationCode: orgCode, SubmitterSampleId: id, TenantCode: tenantCode}, nil
	}

	radiant, err := cache.GetSampleByOrgCodeAndSubmitterSampleId(t.Context(), "CQGC", "S13224", "radiant")
	assert.NoError(t, err)
	cypress, err := cache.GetSampleByOrgCodeAndSubmitterSampleId(t.Context(), "CQGC", "S13224", "cypress")
	assert.NoError(t, err)
	assert.Equal(t, "radiant", radiant.TenantCode)
	assert.Equal(t, "cypress", cypress.TenantCode)
}

func TestBatchValidationCache_GetDocumentByUrl_TenantScoped(t *testing.T) {
	mockRepo := &mockDocRepo{}
	ctx := &BatchValidationContext{DocRepo: mockRepo}
	cache := NewBatchValidationCache(ctx)

	mockRepo.GetByUrlFunc = func(url string, tenantCode string) (*types.Document, error) {
		return &types.Document{Url: url, TenantCode: tenantCode}, nil
	}

	radiant, err := cache.GetDocumentByUrl(t.Context(), "s3://bucket/v.vcf.gz", "radiant")
	assert.NoError(t, err)
	cypress, err := cache.GetDocumentByUrl(t.Context(), "s3://bucket/v.vcf.gz", "cypress")
	assert.NoError(t, err)
	assert.Equal(t, "radiant", radiant.TenantCode)
	assert.Equal(t, "cypress", cypress.TenantCode)
}

func TestBatchValidationCache_GetCaseBySubmitterCaseIdAndProjectId_TenantScoped(t *testing.T) {
	mockRepo := &mockCasesRepo{}
	ctx := &BatchValidationContext{CasesRepo: mockRepo}
	cache := NewBatchValidationCache(ctx)

	mockRepo.GetCaseBySubmitterFunc = func(id string, pid int, tenantCode string) (*types.Case, error) {
		return &types.Case{SubmitterCaseID: id, ProjectID: pid, TenantCode: tenantCode}, nil
	}

	radiant, err := cache.GetCaseBySubmitterCaseIdAndProjectId(t.Context(), "CASE1", 42, "radiant")
	assert.NoError(t, err)
	cypress, err := cache.GetCaseBySubmitterCaseIdAndProjectId(t.Context(), "CASE1", 42, "cypress")
	assert.NoError(t, err)
	assert.Equal(t, "radiant", radiant.TenantCode)
	assert.Equal(t, "cypress", cypress.TenantCode)
}

func TestBatchValidationCache_GetCaseAnalysisCatalogByCode_TenantScoped(t *testing.T) {
	mockRepo := &mockCasesRepo{}
	ctx := &BatchValidationContext{CasesRepo: mockRepo}
	cache := NewBatchValidationCache(ctx)

	// types.AnalysisCatalog carries no tenant_code column; the tenant's row is its id.
	ids := map[string]int{"radiant": 1, "cypress": 2}
	mockRepo.GetAnalysisCatalogFunc = func(code string, tenantCode string) (*types.AnalysisCatalog, error) {
		return &types.AnalysisCatalog{ID: ids[tenantCode], Code: code}, nil
	}

	radiant, err := cache.GetCaseAnalysisCatalogByCode(t.Context(), "WGS", "radiant")
	assert.NoError(t, err)
	cypress, err := cache.GetCaseAnalysisCatalogByCode(t.Context(), "WGS", "cypress")
	assert.NoError(t, err)
	assert.Equal(t, 1, radiant.ID)
	assert.Equal(t, 2, cypress.ID)
}

func TestBatchValidationCache_GetSequencingExperimentByAliquot_TenantScoped(t *testing.T) {
	mockRepo := &mockSeqExpRepo{}
	ctx := &BatchValidationContext{SeqExpRepo: mockRepo}
	cache := NewBatchValidationCache(ctx)

	mockRepo.GetByAliquotFunc = func(aliquot string, tenantCode string) ([]types.SequencingExperiment, error) {
		return []types.SequencingExperiment{{Aliquot: aliquot, TenantCode: tenantCode}}, nil
	}

	radiant, err := cache.GetSequencingExperimentByAliquot(t.Context(), "ALQ1", "radiant")
	assert.NoError(t, err)
	cypress, err := cache.GetSequencingExperimentByAliquot(t.Context(), "ALQ1", "cypress")
	assert.NoError(t, err)
	assert.Equal(t, "radiant", radiant[0].TenantCode)
	assert.Equal(t, "cypress", cypress[0].TenantCode)
}

func TestBatchValidationCache_GetSequencingExperimentByAliquotAndSubmitterSample_TenantScoped(t *testing.T) {
	mockRepo := &mockSeqExpRepo{}
	ctx := &BatchValidationContext{SeqExpRepo: mockRepo}
	cache := NewBatchValidationCache(ctx)

	mockRepo.GetByAliquotAndSampleFunc = func(aliquot, sample, org, tenantCode string) (*types.SequencingExperiment, error) {
		return &types.SequencingExperiment{Aliquot: aliquot, TenantCode: tenantCode}, nil
	}

	radiant, err := cache.GetSequencingExperimentByAliquotAndSubmitterSample(t.Context(), "ALQ1", "SMP1", "ORG1", "radiant")
	assert.NoError(t, err)
	cypress, err := cache.GetSequencingExperimentByAliquotAndSubmitterSample(t.Context(), "ALQ1", "SMP1", "ORG1", "cypress")
	assert.NoError(t, err)
	assert.Equal(t, "radiant", radiant.TenantCode)
	assert.Equal(t, "cypress", cypress.TenantCode)
}
