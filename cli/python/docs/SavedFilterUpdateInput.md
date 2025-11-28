# SavedFilterUpdateInput


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**favorite** | **bool** |  | 
**name** | **str** |  | 
**queries** | [**List[Sqon]**](Sqon.md) |  | 

## Example

```python
from openapi_client.models.saved_filter_update_input import SavedFilterUpdateInput

# TODO update the JSON string below
json = "{}"
# create an instance of SavedFilterUpdateInput from a JSON string
saved_filter_update_input_instance = SavedFilterUpdateInput.from_json(json)
# print the JSON string representation of the object
print(SavedFilterUpdateInput.to_json())

# convert the object into a dict
saved_filter_update_input_dict = saved_filter_update_input_instance.to_dict()
# create an instance of SavedFilterUpdateInput from a dict
saved_filter_update_input_from_dict = SavedFilterUpdateInput.from_dict(saved_filter_update_input_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


