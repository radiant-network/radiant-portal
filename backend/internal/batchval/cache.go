package batchval

import (
	"fmt"

	"github.com/radiant-network/radiant-api/internal/repository"
	"github.com/radiant-network/radiant-api/internal/types"
)

type PatientKey struct {
	OrganizationCode   string
	SubmitterPatientId string
}

type SequencingExperimentKey struct {
	SampleOrganizationCode string
	SubmitterSampleId      string
	Aliquot                string
}

type CaseKey struct {
	ProjectId       int
	SubmitterCaseId string
}

type SampleKey struct {
	OrganizationCode  string
	SubmitterSampleId string
}

type BatchValidationCache struct {
	Context *BatchValidationContext

	// Value Sets (Static Lookups)
	ValueSets map[repository.ValueSetType][]string

	// Referenced Entities (Indexed by their natural keys)
	OrganizationsByCode            map[string]*types.Organization                          // Key: code
	OrganizationsById              map[int]*types.Organization                             // Key: ID
	Projects                       map[string]*types.Project                               // Key: code
	Patients                       map[PatientKey]*types.Patient                           // Key: org_code + submitter_id
	SamplesById                    map[int]*types.Sample                                   // Key: ID
	SamplesByKey                   map[SampleKey]*types.Sample                             // Key: org_code + submitter_sample_id
	SequencingExperimentsByAliquot map[string][]types.SequencingExperiment                 // Key: aliquot
	SequencingExperimentsByKey     map[SequencingExperimentKey]*types.SequencingExperiment // Key: org_code + submitter_sample_id + aliquot
	TaskContext                    map[int][]*types.TaskContext                            // Key: sequencing experiment ID
	Documents                      map[string]*types.Document                              // Key: URL
	TaskHasDocuments               map[int][]*types.TaskHasDocument                        // Key: document ID
	AnalysisCatalogIDs             map[string]*types.AnalysisCatalog                       // Key: code
	Cases                          map[CaseKey]*types.Case                                 // Key: project_id + submitter_case_id

	// Task Metadata
	TaskTypes map[string]*types.TaskType // Key: code
}

func NewBatchValidationCache(context *BatchValidationContext) *BatchValidationCache {
	return &BatchValidationCache{
		Context:                        context,
		ValueSets:                      make(map[repository.ValueSetType][]string),
		OrganizationsByCode:            make(map[string]*types.Organization),
		OrganizationsById:              make(map[int]*types.Organization),
		Projects:                       make(map[string]*types.Project),
		Patients:                       make(map[PatientKey]*types.Patient),
		SamplesById:                    make(map[int]*types.Sample),
		SamplesByKey:                   make(map[SampleKey]*types.Sample),
		SequencingExperimentsByAliquot: make(map[string][]types.SequencingExperiment),
		SequencingExperimentsByKey:     make(map[SequencingExperimentKey]*types.SequencingExperiment),
		TaskTypes:                      make(map[string]*types.TaskType),
		TaskContext:                    make(map[int][]*types.TaskContext),
		Documents:                      make(map[string]*types.Document),
		TaskHasDocuments:               make(map[int][]*types.TaskHasDocument),
		AnalysisCatalogIDs:             make(map[string]*types.AnalysisCatalog),
		Cases:                          make(map[CaseKey]*types.Case),
	}
}

func getCopy[T any](input []T) []T {
	out := make([]T, len(input))
	copy(out, input)
	return out
}

func (c *BatchValidationCache) GetCaseAnalysisCatalogByCode(code string) (*types.AnalysisCatalog, error) {
	if ac, ok := c.AnalysisCatalogIDs[code]; ok {
		return ac, nil
	}

	ac, err := c.Context.CasesRepo.GetCaseAnalysisCatalogIdByCode(code)
	if err != nil {
		return nil, err
	}

	c.AnalysisCatalogIDs[code] = ac
	return ac, nil
}

func (c *BatchValidationCache) GetCaseBySubmitterCaseIdAndProjectId(submitterCaseId string, projectId int) (*types.Case, error) {
	key := CaseKey{projectId, submitterCaseId}
	if cs, ok := c.Cases[key]; ok {
		return cs, nil
	}

	cs, err := c.Context.CasesRepo.GetCaseBySubmitterCaseIdAndProjectId(submitterCaseId, projectId)
	if err != nil {
		return nil, err
	}

	if cs != nil {
		c.Cases[key] = cs
	}

	return cs, nil
}

func (c *BatchValidationCache) GetDocumentByUrl(url string) (*types.Document, error) {
	if doc, ok := c.Documents[url]; ok {
		return doc, nil
	}

	doc, err := c.Context.DocRepo.GetDocumentByUrl(url)
	if err != nil {
		return nil, err
	}

	if doc != nil {
		c.Documents[url] = doc
	}

	return doc, nil
}

func (c *BatchValidationCache) GetOrganizationByCode(code string) (*types.Organization, error) {
	if org, ok := c.OrganizationsByCode[code]; ok {
		return org, nil
	}

	org, err := c.Context.OrgRepo.GetOrganizationByCode(code)
	if err != nil {
		return nil, err
	}

	if org != nil {
		c.OrganizationsByCode[code] = org
		c.OrganizationsById[org.ID] = org
	}

	return org, nil
}

func (c *BatchValidationCache) GetOrganizationById(id int) (*types.Organization, error) {
	if org, ok := c.OrganizationsById[id]; ok {
		return org, nil
	}

	org, err := c.Context.OrgRepo.GetOrganizationById(id)
	if err != nil {
		return nil, err
	}

	if org != nil {
		c.OrganizationsByCode[org.Code] = org
		c.OrganizationsById[id] = org
	}

	return org, nil
}

func (c *BatchValidationCache) GetPatientByOrgCodeAndSubmitterPatientId(orgCode string, submitterPatientId string) (*types.Patient, error) {
	key := PatientKey{orgCode, submitterPatientId}
	if patient, ok := c.Patients[key]; ok {
		return patient, nil
	}

	patient, err := c.Context.PatientRepo.GetPatientByOrgCodeAndSubmitterPatientId(orgCode, submitterPatientId)
	if err != nil {
		return nil, err
	}

	if patient != nil {
		c.Patients[key] = patient
	}

	return patient, nil
}

func (c *BatchValidationCache) GetProjectByCode(code string) (*types.Project, error) {
	if project, ok := c.Projects[code]; ok {
		return project, nil
	}

	project, err := c.Context.ProjectRepo.GetProjectByCode(code)
	if err != nil {
		return nil, err
	}

	if project != nil {
		c.Projects[code] = project
	}

	return project, nil
}

func (c *BatchValidationCache) GetSampleById(id int) (*types.Sample, error) {
	if sample, ok := c.SamplesById[id]; ok {
		return sample, nil
	}

	sample, err := c.Context.SampleRepo.GetSampleById(id)
	if err != nil {
		return nil, err
	}

	if sample != nil {
		c.SamplesById[id] = sample
	}

	return sample, nil
}

func (c *BatchValidationCache) GetSampleByOrgCodeAndSubmitterSampleId(orgCode string, submitterSampleId string) (*types.Sample, error) {
	key := SampleKey{orgCode, submitterSampleId}
	if sample, ok := c.SamplesByKey[key]; ok {
		return sample, nil
	}

	sample, err := c.Context.SampleRepo.GetSampleByOrgCodeAndSubmitterSampleId(orgCode, submitterSampleId)
	if err != nil {
		return nil, err
	}

	if sample != nil {
		c.SamplesByKey[key] = sample
		c.SamplesById[sample.ID] = sample
	}

	return sample, nil
}

func (c *BatchValidationCache) GetSampleBySubmitterSampleId(organizationId int, submitterSampleId string) (*types.Sample, error) {
	org, err := c.GetOrganizationById(organizationId)
	if err != nil {
		return nil, fmt.Errorf("error retrieving organization for ID %d: %w", organizationId, err)
	}
	if org == nil {
		return nil, fmt.Errorf("no organization found for ID %d", organizationId)
	}

	return c.GetSampleByOrgCodeAndSubmitterSampleId(org.Code, submitterSampleId)
}

func (c *BatchValidationCache) GetSequencingExperimentByAliquot(aliquot string) ([]types.SequencingExperiment, error) {
	if seqExps, ok := c.SequencingExperimentsByAliquot[aliquot]; ok {
		return getCopy(seqExps), nil
	}

	seqExps, err := c.Context.SeqExpRepo.GetSequencingExperimentByAliquot(aliquot)
	if err != nil {
		return nil, err
	}

	c.SequencingExperimentsByAliquot[aliquot] = seqExps
	return getCopy(seqExps), nil
}

func (c *BatchValidationCache) GetSequencingExperimentByAliquotAndSubmitterSample(aliquot string, submitterSampleId string, organizationCode string) (*types.SequencingExperiment, error) {
	key := SequencingExperimentKey{organizationCode, submitterSampleId, aliquot}
	if seqExp, ok := c.SequencingExperimentsByKey[key]; ok {
		return seqExp, nil
	}

	seqExp, err := c.Context.SeqExpRepo.GetSequencingExperimentByAliquotAndSubmitterSample(aliquot, submitterSampleId, organizationCode)
	if err != nil {
		return nil, err
	}

	if seqExp != nil {
		c.SequencingExperimentsByKey[key] = seqExp
	}

	return seqExp, nil
}

func (c *BatchValidationCache) GetTaskContextBySequencingExperimentId(seqExpId int) ([]*types.TaskContext, error) {
	if tc, ok := c.TaskContext[seqExpId]; ok {
		return getCopy(tc), nil
	}

	tc, err := c.Context.TaskRepo.GetTaskContextBySequencingExperimentId(seqExpId)
	if err != nil {
		return nil, err
	}

	c.TaskContext[seqExpId] = tc
	return getCopy(tc), nil
}

func (c *BatchValidationCache) GetTaskHasDocumentByDocumentId(documentId int) ([]*types.TaskHasDocument, error) {
	if thd, ok := c.TaskHasDocuments[documentId]; ok {
		return getCopy(thd), nil
	}

	thd, err := c.Context.TaskRepo.GetTaskHasDocumentByDocumentId(documentId)
	if err != nil {
		return nil, err
	}

	c.TaskHasDocuments[documentId] = thd
	return getCopy(thd), nil
}

func (c *BatchValidationCache) GetValueSetCodes(valueSetType repository.ValueSetType) ([]string, error) {
	if codes, ok := c.ValueSets[valueSetType]; ok {
		return getCopy(codes), nil
	}

	codes, err := c.Context.ValueSetsRepo.GetCodes(valueSetType)
	if err != nil {
		return nil, fmt.Errorf("error retrieving codes for %s: %w", valueSetType, err)
	}

	c.ValueSets[valueSetType] = codes
	return getCopy(codes), nil
}
