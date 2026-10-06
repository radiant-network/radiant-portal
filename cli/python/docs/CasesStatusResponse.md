# CasesStatusResponse

Outcome of each requested status change, in request order.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**cases** | [**List[CaseStatusChangeResult]**](CaseStatusChangeResult.md) |  | 

## Example

```python
from radiant_python.models.cases_status_response import CasesStatusResponse

# TODO update the JSON string below
json = "{}"
# create an instance of CasesStatusResponse from a JSON string
cases_status_response_instance = CasesStatusResponse.from_json(json)
# print the JSON string representation of the object
print(CasesStatusResponse.to_json())

# convert the object into a dict
cases_status_response_dict = cases_status_response_instance.to_dict()
# create an instance of CasesStatusResponse from a dict
cases_status_response_from_dict = CasesStatusResponse.from_dict(cases_status_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


