# PaginationConfig


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**page_size** | **int** |  | [optional] 

## Example

```python
from radiant_python.models.pagination_config import PaginationConfig

# TODO update the JSON string below
json = "{}"
# create an instance of PaginationConfig from a JSON string
pagination_config_instance = PaginationConfig.from_json(json)
# print the JSON string representation of the object
print(PaginationConfig.to_json())

# convert the object into a dict
pagination_config_dict = pagination_config_instance.to_dict()
# create an instance of PaginationConfig from a dict
pagination_config_from_dict = PaginationConfig.from_dict(pagination_config_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


