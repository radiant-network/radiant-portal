# BatchMessage


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**code** | **str** |  | [optional] 
**message** | **str** |  | [optional] 
**path** | **str** |  | [optional] 

## Example

```python
from openapi_client.models.batch_message import BatchMessage

# TODO update the JSON string below
json = "{}"
# create an instance of BatchMessage from a JSON string
batch_message_instance = BatchMessage.from_json(json)
# print the JSON string representation of the object
print(BatchMessage.to_json())

# convert the object into a dict
batch_message_dict = batch_message_instance.to_dict()
# create an instance of BatchMessage from a dict
batch_message_from_dict = BatchMessage.from_dict(batch_message_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


