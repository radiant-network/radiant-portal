# CaseLookupResult

Line represented a case in case list

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**case_id** | **int** |  | [optional] 
**project_code** | **str** |  | [optional] 
**status_code** | **str** |  | [optional] 
**submitter_case_id** | **str** |  | [optional] 

## Example

```python
from radiant_python.models.case_lookup_result import CaseLookupResult

# TODO update the JSON string below
json = "{}"
# create an instance of CaseLookupResult from a JSON string
case_lookup_result_instance = CaseLookupResult.from_json(json)
# print the JSON string representation of the object
print(CaseLookupResult.to_json())

# convert the object into a dict
case_lookup_result_dict = case_lookup_result_instance.to_dict()
# create an instance of CaseLookupResult from a dict
case_lookup_result_from_dict = CaseLookupResult.from_dict(case_lookup_result_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


