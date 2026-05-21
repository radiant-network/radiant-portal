# ClinvarVariantConditions


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**clinvar_id** | **str** |  | [optional] 
**conditions** | [**List[ClinvarRCV]**](ClinvarRCV.md) |  | [optional] 

## Example

```python
from radiant_python.models.clinvar_variant_conditions import ClinvarVariantConditions

# TODO update the JSON string below
json = "{}"
# create an instance of ClinvarVariantConditions from a JSON string
clinvar_variant_conditions_instance = ClinvarVariantConditions.from_json(json)
# print the JSON string representation of the object
print(ClinvarVariantConditions.to_json())

# convert the object into a dict
clinvar_variant_conditions_dict = clinvar_variant_conditions_instance.to_dict()
# create an instance of ClinvarVariantConditions from a dict
clinvar_variant_conditions_from_dict = ClinvarVariantConditions.from_dict(clinvar_variant_conditions_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


