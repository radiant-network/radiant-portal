# ValueSetItem

A value-set option: the stored code and its English label.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**code** | **str** |  | [optional] 
**name** | **str** |  | [optional] 

## Example

```python
from radiant_python.models.value_set_item import ValueSetItem

# TODO update the JSON string below
json = "{}"
# create an instance of ValueSetItem from a JSON string
value_set_item_instance = ValueSetItem.from_json(json)
# print the JSON string representation of the object
print(ValueSetItem.to_json())

# convert the object into a dict
value_set_item_dict = value_set_item_instance.to_dict()
# create an instance of ValueSetItem from a dict
value_set_item_from_dict = ValueSetItem.from_dict(value_set_item_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


