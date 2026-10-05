# CaseSystemStatusResult

updated is false when the case was no longer in an expected status; it is then left unchanged and current_status_code tells what it is. current_status_code may be any case status, including a tenant's own.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**case_id** | **int** |  | 
**current_status_code** | **str** |  | 
**updated** | **bool** |  | 

## Example

```python
from radiant_python.models.case_system_status_result import CaseSystemStatusResult

# TODO update the JSON string below
json = "{}"
# create an instance of CaseSystemStatusResult from a JSON string
case_system_status_result_instance = CaseSystemStatusResult.from_json(json)
# print the JSON string representation of the object
print(CaseSystemStatusResult.to_json())

# convert the object into a dict
case_system_status_result_dict = case_system_status_result_instance.to_dict()
# create an instance of CaseSystemStatusResult from a dict
case_system_status_result_from_dict = CaseSystemStatusResult.from_dict(case_system_status_result_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


