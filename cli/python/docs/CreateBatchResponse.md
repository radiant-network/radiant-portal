# CreateBatchResponse

CreateBatchResponse represents the response returned when creating a new batch

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**batch_type** | **str** |  | [optional] 
**created_on** | **str** |  | [optional] 
**dry_run** | **bool** |  | [optional] 
**id** | **str** |  | [optional] 
**status** | **str** |  | [optional] 
**username** | **str** |  | [optional] 

## Example

```python
from radiant_python.models.create_batch_response import CreateBatchResponse

# TODO update the JSON string below
json = "{}"
# create an instance of CreateBatchResponse from a JSON string
create_batch_response_instance = CreateBatchResponse.from_json(json)
# print the JSON string representation of the object
print(CreateBatchResponse.to_json())

# convert the object into a dict
create_batch_response_dict = create_batch_response_instance.to_dict()
# create an instance of CreateBatchResponse from a dict
create_batch_response_from_dict = CreateBatchResponse.from_dict(create_batch_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


