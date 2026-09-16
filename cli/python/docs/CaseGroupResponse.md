# CaseGroupResponse

A named set of cases within a tenant.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**case_ids** | **List[int]** |  | 
**name** | **str** |  | 
**tenant_code** | **str** |  | 

## Example

```python
from radiant_python.models.case_group_response import CaseGroupResponse

# TODO update the JSON string below
json = "{}"
# create an instance of CaseGroupResponse from a JSON string
case_group_response_instance = CaseGroupResponse.from_json(json)
# print the JSON string representation of the object
print(CaseGroupResponse.to_json())

# convert the object into a dict
case_group_response_dict = case_group_response_instance.to_dict()
# create an instance of CaseGroupResponse from a dict
case_group_response_from_dict = CaseGroupResponse.from_dict(case_group_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


