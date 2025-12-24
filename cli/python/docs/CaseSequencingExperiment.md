# CaseSequencingExperiment

Sequencing experiment to display in a Case

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**affected_status_code** | **str** |  | 
**experimental_strategy_code** | **str** |  | 
**has_variants** | **bool** |  | 
**histology_code** | **str** |  | [optional] 
**patient_id** | **int** |  | 
**relationship_to_proband** | **str** |  | 
**sample_id** | **int** |  | 
**sample_submitter_id** | **str** |  | [optional] 
**sample_type_code** | **str** |  | [optional] 
**seq_id** | **int** |  | 
**status_code** | **str** |  | 
**updated_on** | **str** |  | 

## Example

```python
from radiant_python.models.case_sequencing_experiment import CaseSequencingExperiment

# TODO update the JSON string below
json = "{}"
# create an instance of CaseSequencingExperiment from a JSON string
case_sequencing_experiment_instance = CaseSequencingExperiment.from_json(json)
# print the JSON string representation of the object
print(CaseSequencingExperiment.to_json())

# convert the object into a dict
case_sequencing_experiment_dict = case_sequencing_experiment_instance.to_dict()
# create an instance of CaseSequencingExperiment from a dict
case_sequencing_experiment_from_dict = CaseSequencingExperiment.from_dict(case_sequencing_experiment_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


