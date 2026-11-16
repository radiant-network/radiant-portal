# VariantSearchHit

A variant of the run matching the searched identifier

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**aa_change** | **str** |  | [optional] 
**clinvar_id** | **str** |  | [optional] 
**hgvsg** | **str** |  | 
**locus** | **str** |  | 
**rsnumber** | **str** |  | [optional] 
**symbol** | **str** |  | [optional] 

## Example

```python
from radiant_python.models.variant_search_hit import VariantSearchHit

# TODO update the JSON string below
json = "{}"
# create an instance of VariantSearchHit from a JSON string
variant_search_hit_instance = VariantSearchHit.from_json(json)
# print the JSON string representation of the object
print(VariantSearchHit.to_json())

# convert the object into a dict
variant_search_hit_dict = variant_search_hit_instance.to_dict()
# create an instance of VariantSearchHit from a dict
variant_search_hit_from_dict = VariantSearchHit.from_dict(variant_search_hit_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


