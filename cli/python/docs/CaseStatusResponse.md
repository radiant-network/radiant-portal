# CaseStatusResponse

A case's status after a successful change.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**case_id** | **int** |  | [optional] 
**status_code** | **str** |  | [optional] 

## Example

```python
from radiant_python.models.case_status_response import CaseStatusResponse

# TODO update the JSON string below
json = "{}"
# create an instance of CaseStatusResponse from a JSON string
case_status_response_instance = CaseStatusResponse.from_json(json)
# print the JSON string representation of the object
print(CaseStatusResponse.to_json())

# convert the object into a dict
case_status_response_dict = case_status_response_instance.to_dict()
# create an instance of CaseStatusResponse from a dict
case_status_response_from_dict = CaseStatusResponse.from_dict(case_status_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


