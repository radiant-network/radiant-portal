# PatientEvent

Disease event of a patient

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**cns_diagnosis_category** | **str** |  | [optional] 
**cns_integrated_diagnosis** | **str** |  | [optional] 
**var_date** | **date** |  | [optional] 
**day** | **int** |  | [optional] 
**event_type** | **str** |  | 
**metastasis** | **str** | Yes, No or Not Applicable, as in the source | [optional] 
**metastasis_location_other** | **str** |  | [optional] 
**metastasis_locations** | **List[str]** |  | 
**tumor_location_other** | **str** |  | [optional] 
**tumor_locations** | **List[str]** |  | 

## Example

```python
from radiant_python.models.patient_event import PatientEvent

# TODO update the JSON string below
json = "{}"
# create an instance of PatientEvent from a JSON string
patient_event_instance = PatientEvent.from_json(json)
# print the JSON string representation of the object
print(PatientEvent.to_json())

# convert the object into a dict
patient_event_dict = patient_event_instance.to_dict()
# create an instance of PatientEvent from a dict
patient_event_from_dict = PatientEvent.from_dict(patient_event_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


