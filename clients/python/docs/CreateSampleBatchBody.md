# CreateSampleBatchBody

CreateSampleBatchBody represents the body required to create a sample batch

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**samples** | [**List[SampleBatch]**](SampleBatch.md) |  | 

## Example

```python
from radiant_python.models.create_sample_batch_body import CreateSampleBatchBody

# TODO update the JSON string below
json = "{}"
# create an instance of CreateSampleBatchBody from a JSON string
create_sample_batch_body_instance = CreateSampleBatchBody.from_json(json)
# print the JSON string representation of the object
print(CreateSampleBatchBody.to_json())

# convert the object into a dict
create_sample_batch_body_dict = create_sample_batch_body_instance.to_dict()
# create an instance of CreateSampleBatchBody from a dict
create_sample_batch_body_from_dict = CreateSampleBatchBody.from_dict(create_sample_batch_body_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


