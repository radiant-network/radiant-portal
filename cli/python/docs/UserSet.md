# UserSet


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**active** | **bool** |  | [optional] 
**id** | **str** |  | [optional] 
**ids** | **List[str]** |  | [optional] 
**name** | **str** |  | [optional] 
**type** | **str** |  | [optional] 
**updated_at** | **str** |  | [optional] 
**user_id** | **str** |  | [optional] 

## Example

```python
from openapi_client.models.user_set import UserSet

# TODO update the JSON string below
json = "{}"
# create an instance of UserSet from a JSON string
user_set_instance = UserSet.from_json(json)
# print the JSON string representation of the object
print(UserSet.to_json())

# convert the object into a dict
user_set_dict = user_set_instance.to_dict()
# create an instance of UserSet from a dict
user_set_from_dict = UserSet.from_dict(user_set_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


