# ListBodyWithSqon

Body of a list request

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**additional_fields** | **List[str]** |  | [optional] 
**limit** | **int** |  | [optional] 
**offset** | **int** |  | [optional] 
**page_index** | **int** |  | [optional] 
**sort** | [**List[SortBody]**](SortBody.md) |  | [optional] 
**sqon** | [**Sqon**](Sqon.md) |  | [optional] 

## Example

```python
from radiant_python.models.list_body_with_sqon import ListBodyWithSqon

# TODO update the JSON string below
json = "{}"
# create an instance of ListBodyWithSqon from a JSON string
list_body_with_sqon_instance = ListBodyWithSqon.from_json(json)
# print the JSON string representation of the object
print(ListBodyWithSqon.to_json())

# convert the object into a dict
list_body_with_sqon_dict = list_body_with_sqon_instance.to_dict()
# create an instance of ListBodyWithSqon from a dict
list_body_with_sqon_from_dict = ListBodyWithSqon.from_dict(list_body_with_sqon_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


