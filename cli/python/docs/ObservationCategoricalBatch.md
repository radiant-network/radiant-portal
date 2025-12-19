# ObservationCategoricalBatch


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**code** | **str** |  | 
**interpretation_code** | **str** |  | 
**note** | **str** |  | [optional] 
**onset_code** | **str** |  | 
**system** | **str** |  | 
**value** | **str** |  | 

## Example

```python
from radiant_python.models.observation_categorical_batch import ObservationCategoricalBatch

# TODO update the JSON string below
json = "{}"
# create an instance of ObservationCategoricalBatch from a JSON string
observation_categorical_batch_instance = ObservationCategoricalBatch.from_json(json)
# print the JSON string representation of the object
print(ObservationCategoricalBatch.to_json())

# convert the object into a dict
observation_categorical_batch_dict = observation_categorical_batch_instance.to_dict()
# create an instance of ObservationCategoricalBatch from a dict
observation_categorical_batch_from_dict = ObservationCategoricalBatch.from_dict(observation_categorical_batch_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


