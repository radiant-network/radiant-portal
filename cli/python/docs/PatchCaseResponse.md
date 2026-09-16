# PatchCaseResponse

A case after a successful patch, echoing the fields that were applied.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**case_id** | **int** |  | [optional] 
**status_code** | **str** |  | [optional] 

## Example

```python
from radiant_python.models.patch_case_response import PatchCaseResponse

# TODO update the JSON string below
json = "{}"
# create an instance of PatchCaseResponse from a JSON string
patch_case_response_instance = PatchCaseResponse.from_json(json)
# print the JSON string representation of the object
print(PatchCaseResponse.to_json())

# convert the object into a dict
patch_case_response_dict = patch_case_response_instance.to_dict()
# create an instance of PatchCaseResponse from a dict
patch_case_response_from_dict = PatchCaseResponse.from_dict(patch_case_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


