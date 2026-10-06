# PatientImagingSession

Imaging session of a patient

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**anatomical_site** | **str** |  | [optional] 
**var_date** | **date** |  | [optional] 
**day** | **int** |  | [optional] 
**flywheel_url** | **str** |  | [optional] 
**imaging_modality** | **str** |  | [optional] 
**session_id** | **str** |  | 
**session_name** | **str** |  | 

## Example

```python
from radiant_python.models.patient_imaging_session import PatientImagingSession

# TODO update the JSON string below
json = "{}"
# create an instance of PatientImagingSession from a JSON string
patient_imaging_session_instance = PatientImagingSession.from_json(json)
# print the JSON string representation of the object
print(PatientImagingSession.to_json())

# convert the object into a dict
patient_imaging_session_dict = patient_imaging_session_instance.to_dict()
# create an instance of PatientImagingSession from a dict
patient_imaging_session_from_dict = PatientImagingSession.from_dict(patient_imaging_session_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


