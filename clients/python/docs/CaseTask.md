# CaseTask


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**created_on** | **str** |  | 
**id** | **int** |  | 
**patients** | **List[str]** |  | 
**type_code** | **str** |  | 
**type_name** | **str** |  | 

## Example

```python
from radiant_python.models.case_task import CaseTask

# TODO update the JSON string below
json = "{}"
# create an instance of CaseTask from a JSON string
case_task_instance = CaseTask.from_json(json)
# print the JSON string representation of the object
print(CaseTask.to_json())

# convert the object into a dict
case_task_dict = case_task_instance.to_dict()
# create an instance of CaseTask from a dict
case_task_from_dict = CaseTask.from_dict(case_task_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


