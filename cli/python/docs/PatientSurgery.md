# PatientSurgery

Surgery of a patient

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**var_date** | **date** |  | [optional] 
**day** | **int** |  | [optional] 
**extent_of_tumor_resection** | **str** |  | [optional] 
**is_initial_treatment** | **bool** | null when Not Reported | [optional] 

## Example

```python
from radiant_python.models.patient_surgery import PatientSurgery

# TODO update the JSON string below
json = "{}"
# create an instance of PatientSurgery from a JSON string
patient_surgery_instance = PatientSurgery.from_json(json)
# print the JSON string representation of the object
print(PatientSurgery.to_json())

# convert the object into a dict
patient_surgery_dict = patient_surgery_instance.to_dict()
# create an instance of PatientSurgery from a dict
patient_surgery_from_dict = PatientSurgery.from_dict(patient_surgery_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


