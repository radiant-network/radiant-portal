# PatientTreatments

Surgeries, radiations and medical therapies of a patient

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**radiations** | [**List[PatientRadiation]**](PatientRadiation.md) |  | 
**surgeries** | [**List[PatientSurgery]**](PatientSurgery.md) |  | 
**therapies** | [**List[PatientTherapy]**](PatientTherapy.md) |  | 
**trial_enrollments** | [**List[PatientTrialEnrollment]**](PatientTrialEnrollment.md) | Most recent first | 

## Example

```python
from radiant_python.models.patient_treatments import PatientTreatments

# TODO update the JSON string below
json = "{}"
# create an instance of PatientTreatments from a JSON string
patient_treatments_instance = PatientTreatments.from_json(json)
# print the JSON string representation of the object
print(PatientTreatments.to_json())

# convert the object into a dict
patient_treatments_dict = patient_treatments_instance.to_dict()
# create an instance of PatientTreatments from a dict
patient_treatments_from_dict = PatientTreatments.from_dict(patient_treatments_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


