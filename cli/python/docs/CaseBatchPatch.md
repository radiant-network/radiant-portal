# CaseBatchPatch


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**diagnostic_lab_code** | **str** |  | [optional] 
**project_code** | **str** |  | 
**sequencing_experiments** | [**List[CaseSequencingExperimentBatch]**](CaseSequencingExperimentBatch.md) |  | [optional] 
**submitter_case_id** | **str** |  | 
**tasks** | [**List[CaseTaskBatch]**](CaseTaskBatch.md) |  | [optional] 

## Example

```python
from radiant_python.models.case_batch_patch import CaseBatchPatch

# TODO update the JSON string below
json = "{}"
# create an instance of CaseBatchPatch from a JSON string
case_batch_patch_instance = CaseBatchPatch.from_json(json)
# print the JSON string representation of the object
print(CaseBatchPatch.to_json())

# convert the object into a dict
case_batch_patch_dict = case_batch_patch_instance.to_dict()
# create an instance of CaseBatchPatch from a dict
case_batch_patch_from_dict = CaseBatchPatch.from_dict(case_batch_patch_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


