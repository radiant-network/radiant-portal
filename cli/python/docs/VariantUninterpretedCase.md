# VariantUninterpretedCase


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**affected_status** | **str** |  | [optional] 
**analysis_catalog_code** | **str** |  | [optional] 
**analysis_catalog_name** | **str** |  | [optional] 
**case_id** | **int** |  | 
**created_on** | **str** |  | 
**diagnosis_lab_code** | **str** |  | [optional] 
**diagnosis_lab_name** | **str** |  | [optional] 
**exomiser_acmg_classification** | **str** |  | [optional] 
**exomiser_acmg_evidence** | **List[str]** |  | [optional] 
**filter_is_pass** | **bool** |  | [optional] 
**observed_phenotypes** | [**List[Term]**](Term.md) |  | [optional] 
**patient_id** | **int** |  | 
**primary_condition_id** | **str** |  | [optional] 
**primary_condition_name** | **str** |  | [optional] 
**relationship_to_proband** | **str** |  | [optional] 
**seq_id** | **int** |  | 
**status_code** | **str** |  | 
**submitter_sample_id** | **str** |  | [optional] 
**updated_on** | **str** |  | 
**zygosity** | **str** |  | 

## Example

```python
from radiant_python.models.variant_uninterpreted_case import VariantUninterpretedCase

# TODO update the JSON string below
json = "{}"
# create an instance of VariantUninterpretedCase from a JSON string
variant_uninterpreted_case_instance = VariantUninterpretedCase.from_json(json)
# print the JSON string representation of the object
print(VariantUninterpretedCase.to_json())

# convert the object into a dict
variant_uninterpreted_case_dict = variant_uninterpreted_case_instance.to_dict()
# create an instance of VariantUninterpretedCase from a dict
variant_uninterpreted_case_from_dict = VariantUninterpretedCase.from_dict(variant_uninterpreted_case_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


