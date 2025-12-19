# CaseTaskBatch


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**aliquot** | **str** |  | [optional] 
**genome_build** | **str** |  | [optional] 
**input_documents** | [**List[InputDocumentBatch]**](InputDocumentBatch.md) |  | [optional] 
**output_documents** | [**List[OutputDocumentBatch]**](OutputDocumentBatch.md) |  | 
**pipeline_name** | **str** |  | [optional] 
**pipeline_version** | **str** |  | 
**type_code** | **str** |  | 

## Example

```python
from radiant_python.models.case_task_batch import CaseTaskBatch

# TODO update the JSON string below
json = "{}"
# create an instance of CaseTaskBatch from a JSON string
case_task_batch_instance = CaseTaskBatch.from_json(json)
# print the JSON string representation of the object
print(CaseTaskBatch.to_json())

# convert the object into a dict
case_task_batch_dict = case_task_batch_instance.to_dict()
# create an instance of CaseTaskBatch from a dict
case_task_batch_from_dict = CaseTaskBatch.from_dict(case_task_batch_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


