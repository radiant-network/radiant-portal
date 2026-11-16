# VariantSearchBody

Body of a search by variant identifier: a locus, an HGVSg, an rsID or a ClinVar variation ID

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**input** | **str** |  | 

## Example

```python
from radiant_python.models.variant_search_body import VariantSearchBody

# TODO update the JSON string below
json = "{}"
# create an instance of VariantSearchBody from a JSON string
variant_search_body_instance = VariantSearchBody.from_json(json)
# print the JSON string representation of the object
print(VariantSearchBody.to_json())

# convert the object into a dict
variant_search_body_dict = variant_search_body_instance.to_dict()
# create an instance of VariantSearchBody from a dict
variant_search_body_from_dict = VariantSearchBody.from_dict(variant_search_body_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


