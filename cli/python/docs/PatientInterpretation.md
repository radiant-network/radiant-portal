# PatientInterpretation

Germline or somatic interpretation recorded on one of the patient's portal cases

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**aa_change** | **str** | On the interpreted transcript | [optional] 
**analysis_catalog_code** | **str** |  | [optional] 
**analysis_catalog_name** | **str** |  | [optional] 
**case_id** | **int** |  | 
**classification** | **str** | Germline: LOINC answer code; somatic: oncogenicity, as the case module records them | [optional] 
**hgvsg** | **str** |  | [optional] 
**locus_id** | **str** |  | 
**origin** | **str** |  | 
**sequencing_id** | **int** |  | 
**symbol** | **str** | Gene of the interpreted transcript | [optional] 
**updated_at** | **str** | Last interpretation date | 

## Example

```python
from radiant_python.models.patient_interpretation import PatientInterpretation

# TODO update the JSON string below
json = "{}"
# create an instance of PatientInterpretation from a JSON string
patient_interpretation_instance = PatientInterpretation.from_json(json)
# print the JSON string representation of the object
print(PatientInterpretation.to_json())

# convert the object into a dict
patient_interpretation_dict = patient_interpretation_instance.to_dict()
# create an instance of PatientInterpretation from a dict
patient_interpretation_from_dict = PatientInterpretation.from_dict(patient_interpretation_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


