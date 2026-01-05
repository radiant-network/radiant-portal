# ObservationTextBatch


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**code** | **str** |  | 
**value** | **str** |  | 

## Example

```python
from radiant_python.models.observation_text_batch import ObservationTextBatch

# TODO update the JSON string below
json = "{}"
# create an instance of ObservationTextBatch from a JSON string
observation_text_batch_instance = ObservationTextBatch.from_json(json)
# print the JSON string representation of the object
print(ObservationTextBatch.to_json())

# convert the object into a dict
observation_text_batch_dict = observation_text_batch_instance.to_dict()
# create an instance of ObservationTextBatch from a dict
observation_text_batch_from_dict = ObservationTextBatch.from_dict(observation_text_batch_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


