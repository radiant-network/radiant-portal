# SortBody


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**var_field** | **str** |  | [optional] 
**order** | **str** |  | [optional] 

## Example

```python
from radiant_python.models.sort_body import SortBody

# TODO update the JSON string below
json = "{}"
# create an instance of SortBody from a JSON string
sort_body_instance = SortBody.from_json(json)
# print the JSON string representation of the object
print(SortBody.to_json())

# convert the object into a dict
sort_body_dict = sort_body_instance.to_dict()
# create an instance of SortBody from a dict
sort_body_from_dict = SortBody.from_dict(sort_body_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


