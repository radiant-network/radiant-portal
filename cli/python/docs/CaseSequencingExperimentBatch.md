# CaseSequencingExperimentBatch


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**aliquot** | **str** |  | 
**sample_organization_code** | **str** |  | 
**submitter_sample_id** | **str** |  | 

## Example

```python
from radiant_python.models.case_sequencing_experiment_batch import CaseSequencingExperimentBatch

# TODO update the JSON string below
json = "{}"
# create an instance of CaseSequencingExperimentBatch from a JSON string
case_sequencing_experiment_batch_instance = CaseSequencingExperimentBatch.from_json(json)
# print the JSON string representation of the object
print(CaseSequencingExperimentBatch.to_json())

# convert the object into a dict
case_sequencing_experiment_batch_dict = case_sequencing_experiment_batch_instance.to_dict()
# create an instance of CaseSequencingExperimentBatch from a dict
case_sequencing_experiment_batch_from_dict = CaseSequencingExperimentBatch.from_dict(case_sequencing_experiment_batch_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


