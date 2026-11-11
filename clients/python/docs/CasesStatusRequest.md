# CasesStatusRequest

Status changes to apply to cases. A change between two user statuses needs can_edit_case at the case's lab. A change involving a system status (draft, submitted, processing) needs can_ingest_data there, and is limited to submitted -> processing and processing -> in_progress.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**cases** | [**List[CaseStatusChange]**](CaseStatusChange.md) |  | 

## Example

```python
from radiant_python.models.cases_status_request import CasesStatusRequest

# TODO update the JSON string below
json = "{}"
# create an instance of CasesStatusRequest from a JSON string
cases_status_request_instance = CasesStatusRequest.from_json(json)
# print the JSON string representation of the object
print(CasesStatusRequest.to_json())

# convert the object into a dict
cases_status_request_dict = cases_status_request_instance.to_dict()
# create an instance of CasesStatusRequest from a dict
cases_status_request_from_dict = CasesStatusRequest.from_dict(cases_status_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


