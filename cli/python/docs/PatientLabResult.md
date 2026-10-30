# PatientLabResult

Result of one analyte, raw from the source: units are not normalized (ANC comes in /uL and x10E9/L)

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**unit** | **str** |  | [optional] 
**value** | **float** |  | [optional] 

## Example

```python
from radiant_python.models.patient_lab_result import PatientLabResult

# TODO update the JSON string below
json = "{}"
# create an instance of PatientLabResult from a JSON string
patient_lab_result_instance = PatientLabResult.from_json(json)
# print the JSON string representation of the object
print(PatientLabResult.to_json())

# convert the object into a dict
patient_lab_result_dict = patient_lab_result_instance.to_dict()
# create an instance of PatientLabResult from a dict
patient_lab_result_from_dict = PatientLabResult.from_dict(patient_lab_result_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


