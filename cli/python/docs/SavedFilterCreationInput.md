# SavedFilterCreationInput


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **str** |  | 
**queries** | [**List[Sqon]**](Sqon.md) |  | 
**type** | [**SavedFilterType**](SavedFilterType.md) |  | 

## Example

```python
from radiant_python.models.saved_filter_creation_input import SavedFilterCreationInput

# TODO update the JSON string below
json = "{}"
# create an instance of SavedFilterCreationInput from a JSON string
saved_filter_creation_input_instance = SavedFilterCreationInput.from_json(json)
# print the JSON string representation of the object
print(SavedFilterCreationInput.to_json())

# convert the object into a dict
saved_filter_creation_input_dict = saved_filter_creation_input_instance.to_dict()
# create an instance of SavedFilterCreationInput from a dict
saved_filter_creation_input_from_dict = SavedFilterCreationInput.from_dict(saved_filter_creation_input_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


