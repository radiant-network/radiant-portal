# PatchCaseBatchBody


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**cases** | [**List[CaseBatchPatch]**](CaseBatchPatch.md) |  | 

## Example

```python
from radiant_python.models.patch_case_batch_body import PatchCaseBatchBody

# TODO update the JSON string below
json = "{}"
# create an instance of PatchCaseBatchBody from a JSON string
patch_case_batch_body_instance = PatchCaseBatchBody.from_json(json)
# print the JSON string representation of the object
print(PatchCaseBatchBody.to_json())

# convert the object into a dict
patch_case_batch_body_dict = patch_case_batch_body_instance.to_dict()
# create an instance of PatchCaseBatchBody from a dict
patch_case_batch_body_from_dict = PatchCaseBatchBody.from_dict(patch_case_batch_body_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


