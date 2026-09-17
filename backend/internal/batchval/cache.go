package batchval

import (
	"context"
	"fmt"

	"github.com/radiant-network/radiant-api/internal/repository/postgres"
	"github.com/radiant-network/radiant-api/internal/types"
)

type PatientKey struct {
	OrganizationCode   string
	SubmitterPatientId string
	TenantCode         string
}

type SequencingExperimentKey struct {
	SampleOrganizationCode string
	SubmitterSampleId      string
	Aliquot                string
	TenantCode             string
}

type CaseKey struct {
	ProjectId       int
	SubmitterCaseId string
	TenantCode      string
}

type SampleKey struct {
	OrganizationCode  string
	SubmitterSampleId string
	TenantCode        string
}

type OrganizationKey struct {
	Code       string
	TenantCode string
}

type ProjectKey struct {
	Code       string
	TenantCode string
}

type DocumentKey struct {
	Url        string
	TenantCode string
}

type AnalysisCatalogKey struct {
	Code       string
	TenantCode string
}

type AliquotKey struct {
	Aliquot    string
	TenantCode string
}

type BatchValidationCache struct {
	Context *BatchValidationContext

	// Value Sets (Static Lookups)
	ValueSets map[postgres.ValueSetType][]string
	// ExamCodes is keyed by tenant: exam is the only value set scoped by (code, tenant_code).
	ExamCodes map[string][]string

	// Referenced Entities (Indexed by their natural keys). Every natural key includes the
	// tenant: none of these keys is unique across tenants, and the tenant is what the lookups
	// themselves are scoped by. Maps keyed by an internal id (SamplesById, FetusesById,
	// TaskContext, TaskHasDocuments) need no tenant — the id was resolved within one.
	OrganizationsByCode            map[OrganizationKey]*types.Organization                 // Key: code + tenant
	Projects                       map[ProjectKey]*types.Project                           // Key: code + tenant
	Patients                       map[PatientKey]*types.Patient                           // Key: org_code + submitter_id + tenant
	SamplesById                    map[int]*types.Sample                                   // Key: ID
	SamplesByKey                   map[SampleKey]*types.Sample                             // Key: org_code + submitter_sample_id + tenant
	FetusesById                    map[int]*types.Fetus                                    // Key: ID
	SequencingExperimentsByAliquot map[AliquotKey][]types.SequencingExperiment             // Key: aliquot + tenant
	SequencingExperimentsByKey     map[SequencingExperimentKey]*types.SequencingExperiment // Key: org_code + submitter_sample_id + aliquot + tenant
	TaskContext                    map[int][]*types.TaskContext                            // Key: sequencing experiment ID
	Documents                      map[DocumentKey]*types.Document                         // Key: URL + tenant
	TaskHasDocuments               map[int][]*types.TaskHasDocument                        // Key: document ID
	AnalysisCatalogs               map[AnalysisCatalogKey]*types.AnalysisCatalog           // Key: code + tenant
	Cases                          map[CaseKey]*types.Case                                 // Key: project_id + submitter_case_id + tenant
}

func NewBatchValidationCache(context *BatchValidationContext) *BatchValidationCache {
	return &BatchValidationCache{
		Context:                        context,
		ValueSets:                      make(map[postgres.ValueSetType][]string),
		ExamCodes:                      make(map[string][]string),
		OrganizationsByCode:            make(map[OrganizationKey]*types.Organization),
		Projects:                       make(map[ProjectKey]*types.Project),
		Patients:                       make(map[PatientKey]*types.Patient),
		SamplesById:                    make(map[int]*types.Sample),
		SamplesByKey:                   make(map[SampleKey]*types.Sample),
		FetusesById:                    make(map[int]*types.Fetus),
		SequencingExperimentsByAliquot: make(map[AliquotKey][]types.SequencingExperiment),
		SequencingExperimentsByKey:     make(map[SequencingExperimentKey]*types.SequencingExperiment),
		TaskContext:                    make(map[int][]*types.TaskContext),
		Documents:                      make(map[DocumentKey]*types.Document),
		TaskHasDocuments:               make(map[int][]*types.TaskHasDocument),
		AnalysisCatalogs:               make(map[AnalysisCatalogKey]*types.AnalysisCatalog),
		Cases:                          make(map[CaseKey]*types.Case),
	}
}

func getCopy[T any](input []T) []T {
	out := make([]T, len(input))
	copy(out, input)
	return out
}

func (c *BatchValidationCache) GetCaseAnalysisCatalogByCode(ctx context.Context, code string, tenantCode string) (*types.AnalysisCatalog, error) {
	key := AnalysisCatalogKey{Code: code, TenantCode: tenantCode}
	if ac, ok := c.AnalysisCatalogs[key]; ok {
		return ac, nil
	}

	ac, err := c.Context.CasesRepo.GetCaseAnalysisCatalogIdByCode(ctx, code, tenantCode)
	if err != nil {
		return nil, err
	}

	c.AnalysisCatalogs[key] = ac
	return ac, nil
}

func (c *BatchValidationCache) GetCaseBySubmitterCaseIdAndProjectId(ctx context.Context, submitterCaseId string, projectId int, tenantCode string) (*types.Case, error) {
	key := CaseKey{ProjectId: projectId, SubmitterCaseId: submitterCaseId, TenantCode: tenantCode}
	if cs, ok := c.Cases[key]; ok {
		return cs, nil
	}

	cs, err := c.Context.CasesRepo.GetCaseBySubmitterCaseIdAndProjectId(ctx, submitterCaseId, projectId, tenantCode)
	if err != nil {
		return nil, err
	}

	if cs != nil {
		c.Cases[key] = cs
	}

	return cs, nil
}

func (c *BatchValidationCache) GetDocumentByUrl(ctx context.Context, url string, tenantCode string) (*types.Document, error) {
	key := DocumentKey{Url: url, TenantCode: tenantCode}
	if doc, ok := c.Documents[key]; ok {
		return doc, nil
	}

	doc, err := c.Context.DocRepo.GetDocumentByUrl(ctx, url, tenantCode)
	if err != nil {
		return nil, err
	}

	if doc != nil {
		c.Documents[key] = doc
	}

	return doc, nil
}

func (c *BatchValidationCache) GetOrganizationByCode(ctx context.Context, code string, tenantCode string) (*types.Organization, error) {
	key := OrganizationKey{Code: code, TenantCode: tenantCode}
	if org, ok := c.OrganizationsByCode[key]; ok {
		return org, nil
	}

	org, err := c.Context.OrgRepo.GetOrganizationByCode(ctx, code, tenantCode)
	if err != nil {
		return nil, err
	}

	if org != nil {
		c.OrganizationsByCode[key] = org
	}

	return org, nil
}

func (c *BatchValidationCache) GetPatientByOrgCodeAndSubmitterPatientId(ctx context.Context, orgCode string, submitterPatientId string, tenantCode string) (*types.Patient, error) {
	key := PatientKey{OrganizationCode: orgCode, SubmitterPatientId: submitterPatientId, TenantCode: tenantCode}
	if patient, ok := c.Patients[key]; ok {
		return patient, nil
	}

	patient, err := c.Context.PatientRepo.GetPatientByOrgCodeAndSubmitterPatientId(ctx, orgCode, submitterPatientId, tenantCode)
	if err != nil {
		return nil, err
	}

	if patient != nil {
		c.Patients[key] = patient
	}

	return patient, nil
}

func (c *BatchValidationCache) GetProjectByCode(ctx context.Context, code string, tenantCode string) (*types.Project, error) {
	key := ProjectKey{Code: code, TenantCode: tenantCode}
	if project, ok := c.Projects[key]; ok {
		return project, nil
	}

	project, err := c.Context.ProjectRepo.GetProjectByCode(ctx, code, tenantCode)
	if err != nil {
		return nil, err
	}

	if project != nil {
		c.Projects[key] = project
	}

	return project, nil
}

func (c *BatchValidationCache) GetSampleById(ctx context.Context, id int) (*types.Sample, error) {
	if sample, ok := c.SamplesById[id]; ok {
		return sample, nil
	}

	sample, err := c.Context.SampleRepo.GetSampleById(ctx, id)
	if err != nil {
		return nil, err
	}

	if sample != nil {
		c.SamplesById[id] = sample
	}

	return sample, nil
}

func (c *BatchValidationCache) GetSampleByOrgCodeAndSubmitterSampleId(ctx context.Context, orgCode string, submitterSampleId string, tenantCode string) (*types.Sample, error) {
	key := SampleKey{OrganizationCode: orgCode, SubmitterSampleId: submitterSampleId, TenantCode: tenantCode}
	if sample, ok := c.SamplesByKey[key]; ok {
		return sample, nil
	}

	sample, err := c.Context.SampleRepo.GetSampleByOrgCodeAndSubmitterSampleId(ctx, orgCode, submitterSampleId, tenantCode)
	if err != nil {
		return nil, err
	}

	if sample != nil {
		c.SamplesByKey[key] = sample
		c.SamplesById[sample.ID] = sample
	}

	return sample, nil
}

// GetFetusByMotherAndSubmitterId shares FetusesById with GetFetusById: a batch typically resolves
// the same fetus once per sample, and both paths key the row by its internal id.
func (c *BatchValidationCache) GetFetusByMotherAndSubmitterId(ctx context.Context, motherID int, submitterFetusId string) (*types.Fetus, error) {
	for _, fetus := range c.FetusesById {
		if fetus.MotherID == motherID && fetus.SubmitterFetusId == submitterFetusId {
			return fetus, nil
		}
	}

	fetus, err := c.Context.FetusRepo.GetFetusByMotherAndSubmitterId(ctx, motherID, submitterFetusId)
	if err != nil {
		return nil, err
	}

	if fetus != nil {
		c.FetusesById[fetus.ID] = fetus
	}

	return fetus, nil
}

func (c *BatchValidationCache) GetFetusById(ctx context.Context, id int) (*types.Fetus, error) {
	if fetus, ok := c.FetusesById[id]; ok {
		return fetus, nil
	}

	fetus, err := c.Context.FetusRepo.GetFetusById(ctx, id)
	if err != nil {
		return nil, err
	}

	if fetus != nil {
		c.FetusesById[id] = fetus
	}

	return fetus, nil
}

func (c *BatchValidationCache) GetSequencingExperimentByAliquot(ctx context.Context, aliquot string, tenantCode string) ([]types.SequencingExperiment, error) {
	key := AliquotKey{Aliquot: aliquot, TenantCode: tenantCode}
	if seqExps, ok := c.SequencingExperimentsByAliquot[key]; ok {
		return getCopy(seqExps), nil
	}

	seqExps, err := c.Context.SeqExpRepo.GetSequencingExperimentByAliquot(ctx, aliquot, tenantCode)
	if err != nil {
		return nil, err
	}

	c.SequencingExperimentsByAliquot[key] = seqExps
	return getCopy(seqExps), nil
}

func (c *BatchValidationCache) GetSequencingExperimentByAliquotAndSubmitterSample(ctx context.Context, aliquot string, submitterSampleId string, organizationCode string, tenantCode string) (*types.SequencingExperiment, error) {
	key := SequencingExperimentKey{SampleOrganizationCode: organizationCode, SubmitterSampleId: submitterSampleId, Aliquot: aliquot, TenantCode: tenantCode}
	if seqExp, ok := c.SequencingExperimentsByKey[key]; ok {
		return seqExp, nil
	}

	seqExp, err := c.Context.SeqExpRepo.GetSequencingExperimentByAliquotAndSubmitterSample(ctx, aliquot, submitterSampleId, organizationCode, tenantCode)
	if err != nil {
		return nil, err
	}

	if seqExp != nil {
		c.SequencingExperimentsByKey[key] = seqExp
	}

	return seqExp, nil
}

func (c *BatchValidationCache) GetTaskContextBySequencingExperimentId(ctx context.Context, seqExpId int) ([]*types.TaskContext, error) {
	if tc, ok := c.TaskContext[seqExpId]; ok {
		return getCopy(tc), nil
	}

	tc, err := c.Context.TaskRepo.GetTaskContextBySequencingExperimentId(ctx, seqExpId)
	if err != nil {
		return nil, err
	}

	c.TaskContext[seqExpId] = tc
	return getCopy(tc), nil
}

func (c *BatchValidationCache) GetTaskHasDocumentByDocumentId(ctx context.Context, documentId int, tenantCode string) ([]*types.TaskHasDocument, error) {
	if thd, ok := c.TaskHasDocuments[documentId]; ok {
		return getCopy(thd), nil
	}

	thd, err := c.Context.TaskRepo.GetTaskHasDocumentByDocumentId(ctx, documentId, tenantCode)
	if err != nil {
		return nil, err
	}

	c.TaskHasDocuments[documentId] = thd
	return getCopy(thd), nil
}

func (c *BatchValidationCache) GetValueSetCodes(ctx context.Context, valueSetType postgres.ValueSetType) ([]string, error) {
	if codes, ok := c.ValueSets[valueSetType]; ok {
		return getCopy(codes), nil
	}

	codes, err := c.Context.ValueSetsRepo.GetCodes(ctx, valueSetType)
	if err != nil {
		return nil, fmt.Errorf("batch validation cache GetValueSetCodes: %w", err)
	}

	c.ValueSets[valueSetType] = codes
	return getCopy(codes), nil
}

func (c *BatchValidationCache) GetExamCodes(ctx context.Context, tenantCode string) ([]string, error) {
	if codes, ok := c.ExamCodes[tenantCode]; ok {
		return getCopy(codes), nil
	}

	codes, err := c.Context.ValueSetsRepo.GetExamCodes(ctx, tenantCode)
	if err != nil {
		return nil, fmt.Errorf("batch validation cache GetExamCodes: %w", err)
	}

	c.ExamCodes[tenantCode] = codes
	return getCopy(codes), nil
}
