package batchval

import (
	"fmt"

	"github.com/radiant-network/radiant-api/internal/repository"
	"github.com/radiant-network/radiant-api/internal/types"
)

type ValidationCache struct {
	Context *BatchValidationContext

	// Value Sets (Static Lookups)
	ValueSets map[repository.ValueSetType][]string

	// Referenced Entities (Indexed by their natural keys)
	Organizations     map[string]*types.Organization           // Key: code
	OrganizationsById map[int]*types.Organization              // Key: ID
	Projects          map[string]*types.Project                // Key: code
	Patients          map[string]*types.Patient                // Key: org_code + submitter_id
	Samples           map[int]*types.Sample                    // Key: ID
	SeqExps           map[string][]*types.SequencingExperiment // Key: aliquot

	// Task Metadata
	TaskTypes map[string]*types.TaskType // Key: code
}

func NewValidationCache(context *BatchValidationContext) *ValidationCache {
	return &ValidationCache{
		Context:           context,
		ValueSets:         make(map[repository.ValueSetType][]string),
		Organizations:     make(map[string]*types.Organization),
		OrganizationsById: make(map[int]*types.Organization),
		Projects:          make(map[string]*types.Project),
		Patients:          make(map[string]*types.Patient),
		Samples:           make(map[int]*types.Sample),
		SeqExps:           make(map[string][]*types.SequencingExperiment),
		TaskTypes:         make(map[string]*types.TaskType),
	}
}

func (c *ValidationCache) GetOrganizationByCode(code string) (*types.Organization, error) {
	if org, ok := c.Organizations[code]; ok {
		return org, nil
	}

	org, err := c.Context.OrgRepo.GetOrganizationByCode(code)
	if err != nil {
		return nil, err
	}

	if org != nil {
		c.Organizations[code] = org
		c.OrganizationsById[org.ID] = org
	}

	return org, nil
}

func (c *ValidationCache) GetOrganizationById(id int) (*types.Organization, error) {
	if org, ok := c.OrganizationsById[id]; ok {
		return org, nil
	}

	org, err := c.Context.OrgRepo.GetOrganizationById(id)
	if err != nil {
		return nil, err
	}

	if org != nil {
		c.Organizations[org.Code] = org
		c.OrganizationsById[id] = org
	}

	return org, nil
}

func (c *ValidationCache) GetSampleById(id int) (*types.Sample, error) {
	if sample, ok := c.Samples[id]; ok {
		return sample, nil
	}

	sample, err := c.Context.SampleRepo.GetSampleById(id)
	if err != nil {
		return nil, err
	}

	if sample != nil {
		c.Samples[id] = sample
	}

	return sample, nil
}

func (c *ValidationCache) GetSampleBySubmitterSampleId(organizationId int, submitterSampleId string) (*types.Sample, error) {
	for _, sample := range c.Samples {
		if sample.OrganizationId == organizationId && sample.SubmitterSampleId == submitterSampleId {
			return sample, nil
		}
	}

	sample, err := c.Context.SampleRepo.GetSampleBySubmitterSampleId(organizationId, submitterSampleId)
	if err != nil {
		return nil, err
	}

	if sample != nil {
		c.Samples[sample.ID] = sample
	}

	return sample, nil
}

func (c *ValidationCache) GetSequencingExperimentByAliquot(aliquot string) ([]*types.SequencingExperiment, error) {
	if exps, ok := c.SeqExps[aliquot]; ok {
		return exps, nil
	}

	repoExps, err := c.Context.SeqExpRepo.GetSequencingExperimentByAliquot(aliquot)
	if err != nil {
		return nil, err
	}

	var result []*types.SequencingExperiment
	for i := range repoExps {
		result = append(result, &repoExps[i])
	}

	c.SeqExps[aliquot] = result
	return result, nil
}

func (c *ValidationCache) GetValueSetCodes(valueSetType repository.ValueSetType) ([]string, error) {
	if codes, ok := c.ValueSets[valueSetType]; ok {
		return codes, nil
	}

	codes, err := c.Context.ValueSetsRepo.GetCodes(valueSetType)
	if err != nil {
		return nil, fmt.Errorf("error retrieving codes for %s: %w", valueSetType, err)
	}

	c.ValueSets[valueSetType] = codes
	return codes, nil
}
