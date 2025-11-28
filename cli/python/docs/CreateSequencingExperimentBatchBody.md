# CreateSequencingExperimentBatchBody

CreateSequencingExperimentBatchBody represents the body required to create a sequencing experiment batch

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**sequencing_experiments** | [**List[SequencingExperimentBatch]**](SequencingExperimentBatch.md) |  | 

## Example

```python
from openapi_client.models.create_sequencing_experiment_batch_body import CreateSequencingExperimentBatchBody

# TODO update the JSON string below
json = "{}"
# create an instance of CreateSequencingExperimentBatchBody from a JSON string
create_sequencing_experiment_batch_body_instance = CreateSequencingExperimentBatchBody.from_json(json)
# print the JSON string representation of the object
print(CreateSequencingExperimentBatchBody.to_json())

# convert the object into a dict
create_sequencing_experiment_batch_body_dict = create_sequencing_experiment_batch_body_instance.to_dict()
# create an instance of CreateSequencingExperimentBatchBody from a dict
create_sequencing_experiment_batch_body_from_dict = CreateSequencingExperimentBatchBody.from_dict(create_sequencing_experiment_batch_body_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


