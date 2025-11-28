# VariantUninterpretedCasesSearchResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**count** | **int** |  | 
**list** | [**List[VariantUninterpretedCase]**](VariantUninterpretedCase.md) |  | 

## Example

```python
from openapi_client.models.variant_uninterpreted_cases_search_response import VariantUninterpretedCasesSearchResponse

# TODO update the JSON string below
json = "{}"
# create an instance of VariantUninterpretedCasesSearchResponse from a JSON string
variant_uninterpreted_cases_search_response_instance = VariantUninterpretedCasesSearchResponse.from_json(json)
# print the JSON string representation of the object
print(VariantUninterpretedCasesSearchResponse.to_json())

# convert the object into a dict
variant_uninterpreted_cases_search_response_dict = variant_uninterpreted_cases_search_response_instance.to_dict()
# create an instance of VariantUninterpretedCasesSearchResponse from a dict
variant_uninterpreted_cases_search_response_from_dict = VariantUninterpretedCasesSearchResponse.from_dict(variant_uninterpreted_cases_search_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


