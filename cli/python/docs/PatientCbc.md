# PatientCbc

Latest result of each CBC analyte. Each analyte is its own latest, so they may come from different draws.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**anc** | [**PatientLabResult**](PatientLabResult.md) |  | 
**hemoglobin** | [**PatientLabResult**](PatientLabResult.md) |  | 
**platelets** | [**PatientLabResult**](PatientLabResult.md) |  | 
**wbc** | [**PatientLabResult**](PatientLabResult.md) |  | 

## Example

```python
from radiant_python.models.patient_cbc import PatientCbc

# TODO update the JSON string below
json = "{}"
# create an instance of PatientCbc from a JSON string
patient_cbc_instance = PatientCbc.from_json(json)
# print the JSON string representation of the object
print(PatientCbc.to_json())

# convert the object into a dict
patient_cbc_dict = patient_cbc_instance.to_dict()
# create an instance of PatientCbc from a dict
patient_cbc_from_dict = PatientCbc.from_dict(patient_cbc_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


