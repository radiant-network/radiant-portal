# VariantInternalFrequencies


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**split_rows** | [**List[InternalFrequenciesSplitBy]**](InternalFrequenciesSplitBy.md) |  | 
**total_frequencies** | [**InternalFrequencies**](InternalFrequencies.md) |  | 

## Example

```python
from radiant_python.models.variant_internal_frequencies import VariantInternalFrequencies

# TODO update the JSON string below
json = "{}"
# create an instance of VariantInternalFrequencies from a JSON string
variant_internal_frequencies_instance = VariantInternalFrequencies.from_json(json)
# print the JSON string representation of the object
print(VariantInternalFrequencies.to_json())

# convert the object into a dict
variant_internal_frequencies_dict = variant_internal_frequencies_instance.to_dict()
# create an instance of VariantInternalFrequencies from a dict
variant_internal_frequencies_from_dict = VariantInternalFrequencies.from_dict(variant_internal_frequencies_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


