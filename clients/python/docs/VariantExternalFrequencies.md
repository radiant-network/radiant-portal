# VariantExternalFrequencies


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**external_frequencies** | [**List[ExternalFrequencies]**](ExternalFrequencies.md) |  | 
**locus** | **str** |  | 

## Example

```python
from radiant_python.models.variant_external_frequencies import VariantExternalFrequencies

# TODO update the JSON string below
json = "{}"
# create an instance of VariantExternalFrequencies from a JSON string
variant_external_frequencies_instance = VariantExternalFrequencies.from_json(json)
# print the JSON string representation of the object
print(VariantExternalFrequencies.to_json())

# convert the object into a dict
variant_external_frequencies_dict = variant_external_frequencies_instance.to_dict()
# create an instance of VariantExternalFrequencies from a dict
variant_external_frequencies_from_dict = VariantExternalFrequencies.from_dict(variant_external_frequencies_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


