# NotifyCaseGroupResponse

Report of a case group notification: the group and one entry per diagnosis laboratory.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**emails** | [**List[CaseGroupEmailReport]**](CaseGroupEmailReport.md) |  | 
**group** | [**CaseGroupResponse**](CaseGroupResponse.md) |  | 

## Example

```python
from radiant_python.models.notify_case_group_response import NotifyCaseGroupResponse

# TODO update the JSON string below
json = "{}"
# create an instance of NotifyCaseGroupResponse from a JSON string
notify_case_group_response_instance = NotifyCaseGroupResponse.from_json(json)
# print the JSON string representation of the object
print(NotifyCaseGroupResponse.to_json())

# convert the object into a dict
notify_case_group_response_dict = notify_case_group_response_instance.to_dict()
# create an instance of NotifyCaseGroupResponse from a dict
notify_case_group_response_from_dict = NotifyCaseGroupResponse.from_dict(notify_case_group_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


