# ExternalFrequencies


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**ac** | **int** |  | [optional] 
**af** | **float** |  | [optional] 
**an** | **int** |  | [optional] 
**cohort** | **str** |  | 
**hom** | **int** |  | [optional] 

## Example

```python
from radiant_python.models.external_frequencies import ExternalFrequencies

# TODO update the JSON string below
json = "{}"
# create an instance of ExternalFrequencies from a JSON string
external_frequencies_instance = ExternalFrequencies.from_json(json)
# print the JSON string representation of the object
print(ExternalFrequencies.to_json())

# convert the object into a dict
external_frequencies_dict = external_frequencies_instance.to_dict()
# create an instance of ExternalFrequencies from a dict
external_frequencies_from_dict = ExternalFrequencies.from_dict(external_frequencies_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


