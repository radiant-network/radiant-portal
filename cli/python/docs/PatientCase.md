# PatientCase

Portal case the patient is part of

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**analysis_catalog_code** | **str** |  | [optional] 
**case_id** | **int** |  | 
**case_type_code** | **str** |  | 
**diagnosis_lab_code** | **str** |  | 
**priority_code** | **str** |  | [optional] 
**relationship** | **str** | proband, or the relationship_to_proband code | 
**status_code** | **str** |  | 
**updated_on** | **str** |  | 

## Example

```python
from radiant_python.models.patient_case import PatientCase

# TODO update the JSON string below
json = "{}"
# create an instance of PatientCase from a JSON string
patient_case_instance = PatientCase.from_json(json)
# print the JSON string representation of the object
print(PatientCase.to_json())

# convert the object into a dict
patient_case_dict = patient_case_instance.to_dict()
# create an instance of PatientCase from a dict
patient_case_from_dict = PatientCase.from_dict(patient_case_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


