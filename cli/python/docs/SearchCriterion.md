# SearchCriterion


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**var_field** | **str** |  | [optional] 
**operator** | **str** |  | [optional] 
**value** | **List[object]** |  | [optional] 

## Example

```python
from openapi_client.models.search_criterion import SearchCriterion

# TODO update the JSON string below
json = "{}"
# create an instance of SearchCriterion from a JSON string
search_criterion_instance = SearchCriterion.from_json(json)
# print the JSON string representation of the object
print(SearchCriterion.to_json())

# convert the object into a dict
search_criterion_dict = search_criterion_instance.to_dict()
# create an instance of SearchCriterion from a dict
search_criterion_from_dict = SearchCriterion.from_dict(search_criterion_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


