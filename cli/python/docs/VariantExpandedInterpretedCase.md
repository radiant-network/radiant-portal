# VariantExpandedInterpretedCase


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**classification_criterias** | **List[str]** |  | 
**gene_symbol** | **str** |  | 
**inheritances** | **List[str]** |  | 
**interpretation** | **str** |  | 
**interpreter_name** | **str** |  | 
**patient_id** | **int** |  | 
**patient_sex_code** | **str** |  | 
**pubmed_ids** | **List[str]** |  | 

## Example

```python
from radiant_python.models.variant_expanded_interpreted_case import VariantExpandedInterpretedCase

# TODO update the JSON string below
json = "{}"
# create an instance of VariantExpandedInterpretedCase from a JSON string
variant_expanded_interpreted_case_instance = VariantExpandedInterpretedCase.from_json(json)
# print the JSON string representation of the object
print(VariantExpandedInterpretedCase.to_json())

# convert the object into a dict
variant_expanded_interpreted_case_dict = variant_expanded_interpreted_case_instance.to_dict()
# create an instance of VariantExpandedInterpretedCase from a dict
variant_expanded_interpreted_case_from_dict = VariantExpandedInterpretedCase.from_dict(variant_expanded_interpreted_case_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


