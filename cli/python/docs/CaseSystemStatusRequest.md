# CaseSystemStatusRequest

Status changes the pipeline applies to cases. Only submitted -> processing and processing -> in_progress are allowed.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**cases** | [**List[CaseSystemStatusChange]**](CaseSystemStatusChange.md) |  | 

## Example

```python
from radiant_python.models.case_system_status_request import CaseSystemStatusRequest

# TODO update the JSON string below
json = "{}"
# create an instance of CaseSystemStatusRequest from a JSON string
case_system_status_request_instance = CaseSystemStatusRequest.from_json(json)
# print the JSON string representation of the object
print(CaseSystemStatusRequest.to_json())

# convert the object into a dict
case_system_status_request_dict = case_system_status_request_instance.to_dict()
# create an instance of CaseSystemStatusRequest from a dict
case_system_status_request_from_dict = CaseSystemStatusRequest.from_dict(case_system_status_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


