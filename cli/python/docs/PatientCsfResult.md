# PatientCsfResult

Latest result of one CSF component. Read display: the comparator is load-bearing (\"<1.0\" is undetectable).

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**comparator** | **str** |  | [optional] 
**var_date** | **date** |  | [optional] 
**day** | **int** |  | [optional] 
**display** | **str** | Comparator, value and unit | [optional] 
**unit** | **str** |  | [optional] 
**value** | **float** |  | [optional] 

## Example

```python
from radiant_python.models.patient_csf_result import PatientCsfResult

# TODO update the JSON string below
json = "{}"
# create an instance of PatientCsfResult from a JSON string
patient_csf_result_instance = PatientCsfResult.from_json(json)
# print the JSON string representation of the object
print(PatientCsfResult.to_json())

# convert the object into a dict
patient_csf_result_dict = patient_csf_result_instance.to_dict()
# create an instance of PatientCsfResult from a dict
patient_csf_result_from_dict = PatientCsfResult.from_dict(patient_csf_result_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


