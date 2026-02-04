# InternalFrequenciesSplitBy


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**frequencies** | [**InternalFrequencies**](InternalFrequencies.md) |  | 
**split_value** | **str** |  | 

## Example

```python
from radiant_python.models.internal_frequencies_split_by import InternalFrequenciesSplitBy

# TODO update the JSON string below
json = "{}"
# create an instance of InternalFrequenciesSplitBy from a JSON string
internal_frequencies_split_by_instance = InternalFrequenciesSplitBy.from_json(json)
# print the JSON string representation of the object
print(InternalFrequenciesSplitBy.to_json())

# convert the object into a dict
internal_frequencies_split_by_dict = internal_frequencies_split_by_instance.to_dict()
# create an instance of InternalFrequenciesSplitBy from a dict
internal_frequencies_split_by_from_dict = InternalFrequenciesSplitBy.from_dict(internal_frequencies_split_by_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


