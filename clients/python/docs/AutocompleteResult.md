# AutocompleteResult


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**type** | **str** |  | 
**value** | **str** |  | 

## Example

```python
from radiant_python.models.autocomplete_result import AutocompleteResult

# TODO update the JSON string below
json = "{}"
# create an instance of AutocompleteResult from a JSON string
autocomplete_result_instance = AutocompleteResult.from_json(json)
# print the JSON string representation of the object
print(AutocompleteResult.to_json())

# convert the object into a dict
autocomplete_result_dict = autocomplete_result_instance.to_dict()
# create an instance of AutocompleteResult from a dict
autocomplete_result_from_dict = AutocompleteResult.from_dict(autocomplete_result_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


