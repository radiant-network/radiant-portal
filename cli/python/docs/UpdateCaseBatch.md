# UpdateCaseBatch


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**analysis_code** | **str** |  | 
**category_code** | **str** |  | 
**diagnostic_lab_code** | **str** |  | 
**note** | **str** |  | [optional] 
**ordering_organization_code** | **str** |  | 
**ordering_physician** | **str** |  | [optional] 
**patients** | [**List[CasePatientBatch]**](CasePatientBatch.md) |  | 
**primary_condition_code_system** | **str** |  | [optional] 
**primary_condition_value** | **str** |  | [optional] 
**priority_code** | **str** |  | [optional] 
**project_code** | **str** |  | 
**resolution_status_code** | **str** |  | [optional] 
**sequencing_experiments** | [**List[CaseSequencingExperimentBatch]**](CaseSequencingExperimentBatch.md) |  | [optional] 
**status_code** | **str** |  | 
**submitter_case_id** | **str** |  | 
**tasks** | [**List[CaseTaskBatch]**](CaseTaskBatch.md) |  | [optional] 
**type** | **str** |  | 

## Example

```python
from radiant_python.models.update_case_batch import UpdateCaseBatch

# TODO update the JSON string below
json = "{}"
# create an instance of UpdateCaseBatch from a JSON string
update_case_batch_instance = UpdateCaseBatch.from_json(json)
# print the JSON string representation of the object
print(UpdateCaseBatch.to_json())

# convert the object into a dict
update_case_batch_dict = update_case_batch_instance.to_dict()
# create an instance of UpdateCaseBatch from a dict
update_case_batch_from_dict = UpdateCaseBatch.from_dict(update_case_batch_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


