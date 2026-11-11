# CaseStatusChangeResult

updated is false when the case was no longer in an expected status; it is then left unchanged and current_status_code tells what it is. current_status_code may be any case status, including a tenant's own.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**case_id** | **int** |  | 
**current_status_code** | **str** |  | 
**updated** | **bool** |  | 

## Example

```python
from radiant_python.models.case_status_change_result import CaseStatusChangeResult

# TODO update the JSON string below
json = "{}"
# create an instance of CaseStatusChangeResult from a JSON string
case_status_change_result_instance = CaseStatusChangeResult.from_json(json)
# print the JSON string representation of the object
print(CaseStatusChangeResult.to_json())

# convert the object into a dict
case_status_change_result_dict = case_status_change_result_instance.to_dict()
# create an instance of CaseStatusChangeResult from a dict
case_status_change_result_from_dict = CaseStatusChangeResult.from_dict(case_status_change_result_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


