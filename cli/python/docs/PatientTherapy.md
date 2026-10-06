# PatientTherapy

Medical therapy of a patient

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**chemotherapy_agents** | **List[str]** |  | 
**chemotherapy_type** | **str** |  | [optional] 
**is_initial_treatment** | **bool** | null when Not Reported | [optional] 
**protocol_arm** | **str** |  | [optional] 
**protocol_name** | **str** |  | [optional] 
**protocol_name_and_arm** | **str** |  | [optional] 
**start** | [**PatientDayDate**](PatientDayDate.md) |  | 
**stop** | [**PatientDayDate**](PatientDayDate.md) |  | 

## Example

```python
from radiant_python.models.patient_therapy import PatientTherapy

# TODO update the JSON string below
json = "{}"
# create an instance of PatientTherapy from a JSON string
patient_therapy_instance = PatientTherapy.from_json(json)
# print the JSON string representation of the object
print(PatientTherapy.to_json())

# convert the object into a dict
patient_therapy_dict = patient_therapy_instance.to_dict()
# create an instance of PatientTherapy from a dict
patient_therapy_from_dict = PatientTherapy.from_dict(patient_therapy_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


