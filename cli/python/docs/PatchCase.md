# PatchCase

Case fields to change. Omitted fields are left untouched.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**status_code** | **str** | Target status. Only user-applied codes are accepted — &#x60;submitted&#x60; and &#x60;processing&#x60; are system-applied and rejected here. | [optional] 

## Example

```python
from radiant_python.models.patch_case import PatchCase

# TODO update the JSON string below
json = "{}"
# create an instance of PatchCase from a JSON string
patch_case_instance = PatchCase.from_json(json)
# print the JSON string representation of the object
print(PatchCase.to_json())

# convert the object into a dict
patch_case_dict = patch_case_instance.to_dict()
# create an instance of PatchCase from a dict
patch_case_from_dict = PatchCase.from_dict(patch_case_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


