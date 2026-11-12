# PatientCsfCytology

Latest CSF cytology, with the finding derived from the report

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**var_date** | **date** |  | [optional] 
**day** | **int** |  | [optional] 
**evidence_tier** | **str** | How the report was attributed to CSF | [optional] 
**malignant_cells** | **str** |  | [optional] 
**multi_specimen_report** | **bool** | The finding may pertain to a non-CSF specimen | [optional] 
**test_name** | **str** |  | [optional] 

## Example

```python
from radiant_python.models.patient_csf_cytology import PatientCsfCytology

# TODO update the JSON string below
json = "{}"
# create an instance of PatientCsfCytology from a JSON string
patient_csf_cytology_instance = PatientCsfCytology.from_json(json)
# print the JSON string representation of the object
print(PatientCsfCytology.to_json())

# convert the object into a dict
patient_csf_cytology_dict = patient_csf_cytology_instance.to_dict()
# create an instance of PatientCsfCytology from a dict
patient_csf_cytology_from_dict = PatientCsfCytology.from_dict(patient_csf_cytology_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


