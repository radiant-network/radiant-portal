# CaseSystemStatusResponse

Outcome of each requested status change, in request order.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**cases** | [**List[CaseSystemStatusResult]**](CaseSystemStatusResult.md) |  | 

## Example

```python
from radiant_python.models.case_system_status_response import CaseSystemStatusResponse

# TODO update the JSON string below
json = "{}"
# create an instance of CaseSystemStatusResponse from a JSON string
case_system_status_response_instance = CaseSystemStatusResponse.from_json(json)
# print the JSON string representation of the object
print(CaseSystemStatusResponse.to_json())

# convert the object into a dict
case_system_status_response_dict = case_system_status_response_instance.to_dict()
# create an instance of CaseSystemStatusResponse from a dict
case_system_status_response_from_dict = CaseSystemStatusResponse.from_dict(case_system_status_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


