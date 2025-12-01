# VariantHeader


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**assembly_version** | **str** |  | [optional] 
**hgvsg** | **str** |  | 
**source** | **List[str]** |  | [optional] 

## Example

```python
from radiant_python.models.variant_header import VariantHeader

# TODO update the JSON string below
json = "{}"
# create an instance of VariantHeader from a JSON string
variant_header_instance = VariantHeader.from_json(json)
# print the JSON string representation of the object
print(VariantHeader.to_json())

# convert the object into a dict
variant_header_dict = variant_header_instance.to_dict()
# create an instance of VariantHeader from a dict
variant_header_from_dict = VariantHeader.from_dict(variant_header_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


