# VariantInterpretedCasesSearchResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**count** | **int** |  | 
**list** | [**List[VariantInterpretedCase]**](VariantInterpretedCase.md) |  | 

## Example

```python
from openapi_client.models.variant_interpreted_cases_search_response import VariantInterpretedCasesSearchResponse

# TODO update the JSON string below
json = "{}"
# create an instance of VariantInterpretedCasesSearchResponse from a JSON string
variant_interpreted_cases_search_response_instance = VariantInterpretedCasesSearchResponse.from_json(json)
# print the JSON string representation of the object
print(VariantInterpretedCasesSearchResponse.to_json())

# convert the object into a dict
variant_interpreted_cases_search_response_dict = variant_interpreted_cases_search_response_instance.to_dict()
# create an instance of VariantInterpretedCasesSearchResponse from a dict
variant_interpreted_cases_search_response_from_dict = VariantInterpretedCasesSearchResponse.from_dict(variant_interpreted_cases_search_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


