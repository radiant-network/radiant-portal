# VariantSearchResult

Result of a search by variant identifier in a run

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**matched_field** | **str** |  | [optional] 
**normalized_input** | **str** |  | [optional] 
**status** | **str** |  | 
**variants** | [**List[VariantSearchHit]**](VariantSearchHit.md) |  | 

## Example

```python
from radiant_python.models.variant_search_result import VariantSearchResult

# TODO update the JSON string below
json = "{}"
# create an instance of VariantSearchResult from a JSON string
variant_search_result_instance = VariantSearchResult.from_json(json)
# print the JSON string representation of the object
print(VariantSearchResult.to_json())

# convert the object into a dict
variant_search_result_dict = variant_search_result_instance.to_dict()
# create an instance of VariantSearchResult from a dict
variant_search_result_from_dict = VariantSearchResult.from_dict(variant_search_result_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


