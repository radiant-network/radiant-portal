# UserResult

Line representing a user in the tenant users list, with the roles granted to them in that tenant

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**email** | **str** |  | [optional] 
**first_name** | **str** |  | [optional] 
**last_name** | **str** |  | [optional] 
**roles** | [**List[UserRoleResult]**](UserRoleResult.md) |  | 
**user_id** | **str** |  | 

## Example

```python
from radiant_python.models.user_result import UserResult

# TODO update the JSON string below
json = "{}"
# create an instance of UserResult from a JSON string
user_result_instance = UserResult.from_json(json)
# print the JSON string representation of the object
print(UserResult.to_json())

# convert the object into a dict
user_result_dict = user_result_instance.to_dict()
# create an instance of UserResult from a dict
user_result_from_dict = UserResult.from_dict(user_result_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


