# PatientCsf

Latest result of each CSF component. Each component is its own latest, so they may come from different punctures.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**cell_free_dna** | [**PatientDayDate**](PatientDayDate.md) |  | 
**cytology** | [**PatientCsfCytology**](PatientCsfCytology.md) |  | 
**glucose** | [**PatientCsfResult**](PatientCsfResult.md) |  | 
**protein** | [**PatientCsfResult**](PatientCsfResult.md) |  | 
**rbc** | [**PatientCsfResult**](PatientCsfResult.md) |  | 
**wbc** | [**PatientCsfResult**](PatientCsfResult.md) |  | 

## Example

```python
from radiant_python.models.patient_csf import PatientCsf

# TODO update the JSON string below
json = "{}"
# create an instance of PatientCsf from a JSON string
patient_csf_instance = PatientCsf.from_json(json)
# print the JSON string representation of the object
print(PatientCsf.to_json())

# convert the object into a dict
patient_csf_dict = patient_csf_instance.to_dict()
# create an instance of PatientCsf from a dict
patient_csf_from_dict = PatientCsf.from_dict(patient_csf_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


