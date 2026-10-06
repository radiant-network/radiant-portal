# PatientDayDate

Age in days, and the calendar date when the caller can read PHI

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**var_date** | **date** |  | [optional] 
**day** | **int** |  | [optional] 

## Example

```python
from radiant_python.models.patient_day_date import PatientDayDate

# TODO update the JSON string below
json = "{}"
# create an instance of PatientDayDate from a JSON string
patient_day_date_instance = PatientDayDate.from_json(json)
# print the JSON string representation of the object
print(PatientDayDate.to_json())

# convert the object into a dict
patient_day_date_dict = patient_day_date_instance.to_dict()
# create an instance of PatientDayDate from a dict
patient_day_date_from_dict = PatientDayDate.from_dict(patient_day_date_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


