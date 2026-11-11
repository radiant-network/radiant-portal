# RoleResult

Role of a tenant, with the actions it grants, the number of users holding it and the number of organizations it is assigned at

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**actions** | [**List[RoleActionResult]**](RoleActionResult.md) |  | 
**assigned_orgs_count** | **int** |  | [optional] 
**assigned_users_count** | **int** |  | [optional] 
**code** | **str** |  | 
**description** | **str** |  | [optional] 
**is_default** | **bool** |  | [optional] 
**name** | **str** |  | 
**scope** | **str** |  | 

## Example

```python
from radiant_python.models.role_result import RoleResult

# TODO update the JSON string below
json = "{}"
# create an instance of RoleResult from a JSON string
role_result_instance = RoleResult.from_json(json)
# print the JSON string representation of the object
print(RoleResult.to_json())

# convert the object into a dict
role_result_dict = role_result_instance.to_dict()
# create an instance of RoleResult from a dict
role_result_from_dict = RoleResult.from_dict(role_result_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


