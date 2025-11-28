# VariantConsequence


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**biotype** | **str** |  | [optional] 
**gnomad_loeuf** | **float** |  | [optional] 
**gnomad_pli** | **float** |  | [optional] 
**is_picked** | **bool** |  | [optional] 
**spliceai_ds** | **float** |  | [optional] 
**spliceai_type** | **List[str]** |  | [optional] 
**symbol** | **str** |  | [optional] 
**transcripts** | [**List[Transcript]**](Transcript.md) |  | [optional] 

## Example

```python
from openapi_client.models.variant_consequence import VariantConsequence

# TODO update the JSON string below
json = "{}"
# create an instance of VariantConsequence from a JSON string
variant_consequence_instance = VariantConsequence.from_json(json)
# print the JSON string representation of the object
print(VariantConsequence.to_json())

# convert the object into a dict
variant_consequence_dict = variant_consequence_instance.to_dict()
# create an instance of VariantConsequence from a dict
variant_consequence_from_dict = VariantConsequence.from_dict(variant_consequence_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


