# SequencingExperimentBatch


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**aliquot** | **str** |  | 
**capture_kit** | **str** |  | [optional] 
**experimental_strategy_code** | **str** |  | 
**platform_code** | **str** |  | 
**run_alias** | **str** |  | [optional] 
**run_date** | **datetime** |  | [optional] 
**sample_organization_code** | **str** |  | 
**sequencing_lab_code** | **str** |  | 
**sequencing_read_technology_code** | **str** |  | 
**status_code** | **str** |  | 
**submitter_sample_id** | **str** |  | 

## Example

```python
from radiant_python.models.sequencing_experiment_batch import SequencingExperimentBatch

# TODO update the JSON string below
json = "{}"
# create an instance of SequencingExperimentBatch from a JSON string
sequencing_experiment_batch_instance = SequencingExperimentBatch.from_json(json)
# print the JSON string representation of the object
print(SequencingExperimentBatch.to_json())

# convert the object into a dict
sequencing_experiment_batch_dict = sequencing_experiment_batch_instance.to_dict()
# create an instance of SequencingExperimentBatch from a dict
sequencing_experiment_batch_from_dict = SequencingExperimentBatch.from_dict(sequencing_experiment_batch_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


