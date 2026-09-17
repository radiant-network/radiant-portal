# CaseGroupRequest

Payload to create a case group, or overwrite the case list of an existing one (same name in the tenant). An empty case_ids list is accepted and empties the group.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**case_ids** | **List[int]** |  | 
**name** | **str** |  | 

## Example

```python
from radiant_python.models.case_group_request import CaseGroupRequest

# TODO update the JSON string below
json = "{}"
# create an instance of CaseGroupRequest from a JSON string
case_group_request_instance = CaseGroupRequest.from_json(json)
# print the JSON string representation of the object
print(CaseGroupRequest.to_json())

# convert the object into a dict
case_group_request_dict = case_group_request_instance.to_dict()
# create an instance of CaseGroupRequest from a dict
case_group_request_from_dict = CaseGroupRequest.from_dict(case_group_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


