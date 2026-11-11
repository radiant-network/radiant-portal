# PatientTreatmentSummary

Initial treatment summary of a patient

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**first_chemo_ever** | [**PatientDayDate**](PatientDayDate.md) |  | 
**first_event** | [**PatientDayDate**](PatientDayDate.md) |  | 
**first_methotrexate_ever** | [**PatientDayDate**](PatientDayDate.md) |  | 
**first_radiation_ever** | [**PatientDayDate**](PatientDayDate.md) |  | 
**had_initial_chemo** | **bool** |  | 
**had_initial_methotrexate** | **bool** |  | 
**had_initial_radiation** | **bool** |  | 
**initial_chemo** | [**PatientDayDate**](PatientDayDate.md) |  | 
**initial_dx** | [**PatientDayDate**](PatientDayDate.md) |  | 
**initial_radiation** | [**PatientDayDate**](PatientDayDate.md) |  | 
**initial_treatment_order** | **str** |  | [optional] 

## Example

```python
from radiant_python.models.patient_treatment_summary import PatientTreatmentSummary

# TODO update the JSON string below
json = "{}"
# create an instance of PatientTreatmentSummary from a JSON string
patient_treatment_summary_instance = PatientTreatmentSummary.from_json(json)
# print the JSON string representation of the object
print(PatientTreatmentSummary.to_json())

# convert the object into a dict
patient_treatment_summary_dict = patient_treatment_summary_instance.to_dict()
# create an instance of PatientTreatmentSummary from a dict
patient_treatment_summary_from_dict = PatientTreatmentSummary.from_dict(patient_treatment_summary_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


