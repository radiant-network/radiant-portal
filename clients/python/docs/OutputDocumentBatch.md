# OutputDocumentBatch


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**data_category_code** | **str** |  | 
**data_type_code** | **str** |  | 
**format_code** | **str** |  | 
**hash** | **str** |  | [optional] 
**name** | **str** |  | 
**size** | **int** |  | 
**url** | **str** |  | 

## Example

```python
from radiant_python.models.output_document_batch import OutputDocumentBatch

# TODO update the JSON string below
json = "{}"
# create an instance of OutputDocumentBatch from a JSON string
output_document_batch_instance = OutputDocumentBatch.from_json(json)
# print the JSON string representation of the object
print(OutputDocumentBatch.to_json())

# convert the object into a dict
output_document_batch_dict = output_document_batch_instance.to_dict()
# create an instance of OutputDocumentBatch from a dict
output_document_batch_from_dict = OutputDocumentBatch.from_dict(output_document_batch_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


