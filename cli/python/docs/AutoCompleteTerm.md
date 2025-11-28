# AutoCompleteTerm


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**highlight** | [**Term**](Term.md) |  | [optional] 
**source** | [**Term**](Term.md) |  | [optional] 

## Example

```python
from openapi_client.models.auto_complete_term import AutoCompleteTerm

# TODO update the JSON string below
json = "{}"
# create an instance of AutoCompleteTerm from a JSON string
auto_complete_term_instance = AutoCompleteTerm.from_json(json)
# print the JSON string representation of the object
print(AutoCompleteTerm.to_json())

# convert the object into a dict
auto_complete_term_dict = auto_complete_term_instance.to_dict()
# create an instance of AutoCompleteTerm from a dict
auto_complete_term_from_dict = AutoCompleteTerm.from_dict(auto_complete_term_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


