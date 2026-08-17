# CreateUserRole

Role to grant to a user, with the organizations it applies at.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**org_codes** | **List[str]** |  | [optional] 
**role_code** | **str** |  | 

## Example

```python
from radiant_python.models.create_user_role import CreateUserRole

# TODO update the JSON string below
json = "{}"
# create an instance of CreateUserRole from a JSON string
create_user_role_instance = CreateUserRole.from_json(json)
# print the JSON string representation of the object
print(CreateUserRole.to_json())

# convert the object into a dict
create_user_role_dict = create_user_role_instance.to_dict()
# create an instance of CreateUserRole from a dict
create_user_role_from_dict = CreateUserRole.from_dict(create_user_role_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


