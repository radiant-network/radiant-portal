# CaseSystemStatusChange

One case status change, applied only if the case is still in one of expected_status_codes.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**case_id** | **int** |  | 
**expected_status_codes** | **List[str]** |  | 
**status_code** | **str** |  | 

## Example

```python
from radiant_python.models.case_system_status_change import CaseSystemStatusChange

# TODO update the JSON string below
json = "{}"
# create an instance of CaseSystemStatusChange from a JSON string
case_system_status_change_instance = CaseSystemStatusChange.from_json(json)
# print the JSON string representation of the object
print(CaseSystemStatusChange.to_json())

# convert the object into a dict
case_system_status_change_dict = case_system_status_change_instance.to_dict()
# create an instance of CaseSystemStatusChange from a dict
case_system_status_change_from_dict = CaseSystemStatusChange.from_dict(case_system_status_change_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


