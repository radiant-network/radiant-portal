# PatientDose

Radiation dose, raw from the source (Gy, cGy or CGE), not normalized

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**unit** | **str** |  | [optional] 
**value** | **str** |  | [optional] 

## Example

```python
from radiant_python.models.patient_dose import PatientDose

# TODO update the JSON string below
json = "{}"
# create an instance of PatientDose from a JSON string
patient_dose_instance = PatientDose.from_json(json)
# print the JSON string representation of the object
print(PatientDose.to_json())

# convert the object into a dict
patient_dose_dict = patient_dose_instance.to_dict()
# create an instance of PatientDose from a dict
patient_dose_from_dict = PatientDose.from_dict(patient_dose_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


