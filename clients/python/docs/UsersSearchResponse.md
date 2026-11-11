# UsersSearchResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**count** | **int** |  | 
**list** | [**List[UserResult]**](UserResult.md) |  | 

## Example

```python
from radiant_python.models.users_search_response import UsersSearchResponse

# TODO update the JSON string below
json = "{}"
# create an instance of UsersSearchResponse from a JSON string
users_search_response_instance = UsersSearchResponse.from_json(json)
# print the JSON string representation of the object
print(UsersSearchResponse.to_json())

# convert the object into a dict
users_search_response_dict = users_search_response_instance.to_dict()
# create an instance of UsersSearchResponse from a dict
users_search_response_from_dict = UsersSearchResponse.from_dict(users_search_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


