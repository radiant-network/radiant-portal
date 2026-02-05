# InternalFrequencies


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**hom_affected** | **int** |  | [optional] 
**hom_all** | **int** |  | [optional] 
**hom_non_affected** | **int** |  | [optional] 
**pc_affected** | **int** |  | [optional] 
**pc_all** | **int** |  | [optional] 
**pc_non_affected** | **int** |  | [optional] 
**pf_affected** | **float** |  | [optional] 
**pf_all** | **float** |  | [optional] 
**pf_non_affected** | **float** |  | [optional] 
**pn_affected** | **int** |  | [optional] 
**pn_all** | **int** |  | [optional] 
**pn_non_affected** | **int** |  | [optional] 

## Example

```python
from radiant_python.models.internal_frequencies import InternalFrequencies

# TODO update the JSON string below
json = "{}"
# create an instance of InternalFrequencies from a JSON string
internal_frequencies_instance = InternalFrequencies.from_json(json)
# print the JSON string representation of the object
print(InternalFrequencies.to_json())

# convert the object into a dict
internal_frequencies_dict = internal_frequencies_instance.to_dict()
# create an instance of InternalFrequencies from a dict
internal_frequencies_from_dict = InternalFrequencies.from_dict(internal_frequencies_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


