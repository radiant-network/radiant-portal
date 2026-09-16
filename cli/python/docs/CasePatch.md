# CasePatch

Case fields to change. Omitted fields are left untouched.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**status_code** | **str** |  | [optional] 

## Example

```python
from radiant_python.models.case_patch import CasePatch

# TODO update the JSON string below
json = "{}"
# create an instance of CasePatch from a JSON string
case_patch_instance = CasePatch.from_json(json)
# print the JSON string representation of the object
print(CasePatch.to_json())

# convert the object into a dict
case_patch_dict = case_patch_instance.to_dict()
# create an instance of CasePatch from a dict
case_patch_from_dict = CasePatch.from_dict(case_patch_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


