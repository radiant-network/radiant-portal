# VariantInterpretedCase


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**affected_status** | **str** |  | [optional] 
**analysis_catalog_code** | **str** |  | [optional] 
**analysis_catalog_name** | **str** |  | [optional] 
**case_id** | **int** |  | 
**classification** | **str** |  | 
**condition_id** | **str** |  | 
**condition_name** | **str** |  | 
**diagnosis_lab_code** | **str** |  | [optional] 
**diagnosis_lab_name** | **str** |  | [optional] 
**interpretation_updated_on** | **str** |  | 
**observed_phenotypes** | [**List[Term]**](Term.md) |  | [optional] 
**patient_id** | **int** |  | 
**relationship_to_proband** | **str** |  | [optional] 
**seq_id** | **int** |  | 
**status_code** | **str** |  | 
**submitter_sample_id** | **str** |  | [optional] 
**transcript_id** | **str** |  | 
**zygosity** | **str** |  | 

## Example

```python
from radiant_python.models.variant_interpreted_case import VariantInterpretedCase

# TODO update the JSON string below
json = "{}"
# create an instance of VariantInterpretedCase from a JSON string
variant_interpreted_case_instance = VariantInterpretedCase.from_json(json)
# print the JSON string representation of the object
print(VariantInterpretedCase.to_json())

# convert the object into a dict
variant_interpreted_case_dict = variant_interpreted_case_instance.to_dict()
# create an instance of VariantInterpretedCase from a dict
variant_interpreted_case_from_dict = VariantInterpretedCase.from_dict(variant_interpreted_case_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


