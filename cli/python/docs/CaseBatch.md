# CaseBatch


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**analysis_code** | **str** |  | [optional] 
**category_code** | **str** |  | 
**diagnostic_lab_code** | **str** |  | [optional] 
**note** | **str** |  | [optional] 
**ordering_organization_code** | **str** |  | [optional] 
**ordering_physician** | **str** |  | [optional] 
**patients** | [**List[CasePatientBatch]**](CasePatientBatch.md) |  | 
**primary_condition_code_system** | **str** |  | [optional] 
**primary_condition_value** | **str** |  | [optional] 
**priority_code** | **str** |  | [optional] 
**project_code** | **str** |  | 
**resolution_status_code** | **str** |  | [optional] 
**sequencing_experiments** | [**List[CaseSequencingExperimentBatch]**](CaseSequencingExperimentBatch.md) |  | 
**status_code** | **str** |  | 
**submitter_case_id** | **str** |  | 
**tasks** | [**List[CaseTaskBatch]**](CaseTaskBatch.md) |  | 
**type** | **str** |  | 

## Example

```python
from radiant_python.models.case_batch import CaseBatch

# TODO update the JSON string below
json = "{}"
# create an instance of CaseBatch from a JSON string
case_batch_instance = CaseBatch.from_json(json)
# print the JSON string representation of the object
print(CaseBatch.to_json())

# convert the object into a dict
case_batch_dict = case_batch_instance.to_dict()
# create an instance of CaseBatch from a dict
case_batch_from_dict = CaseBatch.from_dict(case_batch_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


