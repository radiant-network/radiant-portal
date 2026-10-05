# CaseStatusChange

One case status change, applied only if the case is still in one of expected_status_codes.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**case_id** | **int** |  | 
**expected_status_codes** | **List[str]** |  | 
**status_code** | **str** |  | 

## Example

```python
from radiant_python.models.case_status_change import CaseStatusChange

# TODO update the JSON string below
json = "{}"
# create an instance of CaseStatusChange from a JSON string
case_status_change_instance = CaseStatusChange.from_json(json)
# print the JSON string representation of the object
print(CaseStatusChange.to_json())

# convert the object into a dict
case_status_change_dict = case_status_change_instance.to_dict()
# create an instance of CaseStatusChange from a dict
case_status_change_from_dict = CaseStatusChange.from_dict(case_status_change_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


