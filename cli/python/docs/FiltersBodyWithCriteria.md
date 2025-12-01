# FiltersBodyWithCriteria


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**search_criteria** | [**List[SearchCriterion]**](SearchCriterion.md) |  | [optional] 

## Example

```python
from radiant_python.models.filters_body_with_criteria import FiltersBodyWithCriteria

# TODO update the JSON string below
json = "{}"
# create an instance of FiltersBodyWithCriteria from a JSON string
filters_body_with_criteria_instance = FiltersBodyWithCriteria.from_json(json)
# print the JSON string representation of the object
print(FiltersBodyWithCriteria.to_json())

# convert the object into a dict
filters_body_with_criteria_dict = filters_body_with_criteria_instance.to_dict()
# create an instance of FiltersBodyWithCriteria from a dict
filters_body_with_criteria_from_dict = FiltersBodyWithCriteria.from_dict(filters_body_with_criteria_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


