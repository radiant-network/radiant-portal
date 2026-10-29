# PatientCbc

Most recent CBC panel. All its analytes come from that panel, so they share its day and date.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**anc** | [**PatientLabResult**](PatientLabResult.md) |  | 
**var_date** | **date** |  | [optional] 
**day** | **int** |  | [optional] 
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


