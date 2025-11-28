# DocumentResult


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**case_id** | **int** |  | 
**created_on** | **str** |  | 
**data_type_code** | **str** |  | 
**diagnosis_lab_code** | **str** |  | [optional] 
**diagnosis_lab_name** | **str** |  | [optional] 
**document_id** | **int** |  | 
**format_code** | **str** |  | 
**hash** | **str** |  | [optional] 
**name** | **str** |  | 
**patient_id** | **int** |  | 
**relationship_to_proband_code** | **str** |  | 
**run_alias** | **str** |  | [optional] 
**seq_id** | **int** |  | [optional] 
**size** | **int** |  | 
**submitter_sample_id** | **str** |  | [optional] 
**task_id** | **int** |  | 

## Example

```python
from openapi_client.models.document_result import DocumentResult

# TODO update the JSON string below
json = "{}"
# create an instance of DocumentResult from a JSON string
document_result_instance = DocumentResult.from_json(json)
# print the JSON string representation of the object
print(DocumentResult.to_json())

# convert the object into a dict
document_result_dict = document_result_instance.to_dict()
# create an instance of DocumentResult from a dict
document_result_from_dict = DocumentResult.from_dict(document_result_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


