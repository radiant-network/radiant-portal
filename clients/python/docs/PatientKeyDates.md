# PatientKeyDates

Key dates of the patient sidebar

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**initial_diagnosis** | [**PatientKeyDate**](PatientKeyDate.md) |  | 
**latest_encounter** | [**PatientKeyDate**](PatientKeyDate.md) |  | 

## Example

```python
from radiant_python.models.patient_key_dates import PatientKeyDates

# TODO update the JSON string below
json = "{}"
# create an instance of PatientKeyDates from a JSON string
patient_key_dates_instance = PatientKeyDates.from_json(json)
# print the JSON string representation of the object
print(PatientKeyDates.to_json())

# convert the object into a dict
patient_key_dates_dict = patient_key_dates_instance.to_dict()
# create an instance of PatientKeyDates from a dict
patient_key_dates_from_dict = PatientKeyDates.from_dict(patient_key_dates_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


