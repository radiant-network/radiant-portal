# PatientImaging

Imaging sessions of a patient

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**sessions** | [**List[PatientImagingSession]**](PatientImagingSession.md) |  | 

## Example

```python
from radiant_python.models.patient_imaging import PatientImaging

# TODO update the JSON string below
json = "{}"
# create an instance of PatientImaging from a JSON string
patient_imaging_instance = PatientImaging.from_json(json)
# print the JSON string representation of the object
print(PatientImaging.to_json())

# convert the object into a dict
patient_imaging_dict = patient_imaging_instance.to_dict()
# create an instance of PatientImaging from a dict
patient_imaging_from_dict = PatientImaging.from_dict(patient_imaging_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


