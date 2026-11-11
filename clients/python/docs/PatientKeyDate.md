# PatientKeyDate

Key date of the patient sidebar, with the source it comes from

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**var_date** | **date** |  | [optional] 
**day** | **int** |  | [optional] 
**source** | **str** |  | 

## Example

```python
from radiant_python.models.patient_key_date import PatientKeyDate

# TODO update the JSON string below
json = "{}"
# create an instance of PatientKeyDate from a JSON string
patient_key_date_instance = PatientKeyDate.from_json(json)
# print the JSON string representation of the object
print(PatientKeyDate.to_json())

# convert the object into a dict
patient_key_date_dict = patient_key_date_instance.to_dict()
# create an instance of PatientKeyDate from a dict
patient_key_date_from_dict = PatientKeyDate.from_dict(patient_key_date_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


