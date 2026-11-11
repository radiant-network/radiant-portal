# PatientRadiation

Radiation course of a patient

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**craniospinal_dose** | [**PatientDose**](PatientDose.md) |  | 
**focal_boost_dose** | [**PatientDose**](PatientDose.md) |  | [optional] 
**is_initial_treatment** | **bool** | null when Not Reported | [optional] 
**site** | **str** |  | [optional] 
**site_other** | **str** |  | [optional] 
**start** | [**PatientDayDate**](PatientDayDate.md) |  | 
**stop** | [**PatientDayDate**](PatientDayDate.md) |  | 
**total_primary_dose** | [**PatientDose**](PatientDose.md) |  | 
**type** | **str** |  | [optional] 
**type_other** | **str** |  | [optional] 

## Example

```python
from radiant_python.models.patient_radiation import PatientRadiation

# TODO update the JSON string below
json = "{}"
# create an instance of PatientRadiation from a JSON string
patient_radiation_instance = PatientRadiation.from_json(json)
# print the JSON string representation of the object
print(PatientRadiation.to_json())

# convert the object into a dict
patient_radiation_dict = patient_radiation_instance.to_dict()
# create an instance of PatientRadiation from a dict
patient_radiation_from_dict = PatientRadiation.from_dict(patient_radiation_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


