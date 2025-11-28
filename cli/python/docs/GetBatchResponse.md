# GetBatchResponse

GetBatchResponse represents the response returned when retrieving a batch

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**batch_type** | **str** |  | [optional] 
**created_on** | **str** |  | [optional] 
**dry_run** | **bool** |  | [optional] 
**finished_on** | **str** |  | [optional] 
**id** | **str** |  | [optional] 
**report** | [**BatchReport**](BatchReport.md) |  | [optional] 
**started_on** | **str** |  | [optional] 
**status** | **str** |  | [optional] 
**summary** | [**BatchSummary**](BatchSummary.md) |  | [optional] 
**username** | **str** |  | [optional] 

## Example

```python
from openapi_client.models.get_batch_response import GetBatchResponse

# TODO update the JSON string below
json = "{}"
# create an instance of GetBatchResponse from a JSON string
get_batch_response_instance = GetBatchResponse.from_json(json)
# print the JSON string representation of the object
print(GetBatchResponse.to_json())

# convert the object into a dict
get_batch_response_dict = get_batch_response_instance.to_dict()
# create an instance of GetBatchResponse from a dict
get_batch_response_from_dict = GetBatchResponse.from_dict(get_batch_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


