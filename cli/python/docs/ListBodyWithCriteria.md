# ListBodyWithCriteria

Body of a list request with search criteria

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**additional_fields** | **List[str]** |  | [optional] 
**limit** | **int** |  | [optional] 
**offset** | **int** |  | [optional] 
**page_index** | **int** |  | [optional] 
**search_criteria** | [**List[SearchCriterion]**](SearchCriterion.md) |  | [optional] 
**sort** | [**List[SortBody]**](SortBody.md) |  | [optional] 

## Example

```python
from radiant_python.models.list_body_with_criteria import ListBodyWithCriteria

# TODO update the JSON string below
json = "{}"
# create an instance of ListBodyWithCriteria from a JSON string
list_body_with_criteria_instance = ListBodyWithCriteria.from_json(json)
# print the JSON string representation of the object
print(ListBodyWithCriteria.to_json())

# convert the object into a dict
list_body_with_criteria_dict = list_body_with_criteria_instance.to_dict()
# create an instance of ListBodyWithCriteria from a dict
list_body_with_criteria_from_dict = ListBodyWithCriteria.from_dict(list_body_with_criteria_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


