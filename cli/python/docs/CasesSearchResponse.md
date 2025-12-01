# CasesSearchResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**count** | **int** |  | 
**list** | [**List[CaseResult]**](CaseResult.md) |  | 

## Example

```python
from radiant_python.models.cases_search_response import CasesSearchResponse

# TODO update the JSON string below
json = "{}"
# create an instance of CasesSearchResponse from a JSON string
cases_search_response_instance = CasesSearchResponse.from_json(json)
# print the JSON string representation of the object
print(CasesSearchResponse.to_json())

# convert the object into a dict
cases_search_response_dict = cases_search_response_instance.to_dict()
# create an instance of CasesSearchResponse from a dict
cases_search_response_from_dict = CasesSearchResponse.from_dict(cases_search_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


