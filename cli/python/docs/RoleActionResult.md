# RoleActionResult

Action granted by a role

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**code** | **str** |  | 
**description** | **str** |  | 
**name** | **str** |  | 
**scope** | **str** |  | 

## Example

```python
from radiant_python.models.role_action_result import RoleActionResult

# TODO update the JSON string below
json = "{}"
# create an instance of RoleActionResult from a JSON string
role_action_result_instance = RoleActionResult.from_json(json)
# print the JSON string representation of the object
print(RoleActionResult.to_json())

# convert the object into a dict
role_action_result_dict = role_action_result_instance.to_dict()
# create an instance of RoleActionResult from a dict
role_action_result_from_dict = RoleActionResult.from_dict(role_action_result_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


