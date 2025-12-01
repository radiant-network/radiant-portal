# LeafContent


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**var_field** | **str** |  | [optional] 
**value** | **List[object]** |  | [optional] 

## Example

```python
from radiant_python.models.leaf_content import LeafContent

# TODO update the JSON string below
json = "{}"
# create an instance of LeafContent from a JSON string
leaf_content_instance = LeafContent.from_json(json)
# print the JSON string representation of the object
print(LeafContent.to_json())

# convert the object into a dict
leaf_content_dict = leaf_content_instance.to_dict()
# create an instance of LeafContent from a dict
leaf_content_from_dict = LeafContent.from_dict(leaf_content_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


