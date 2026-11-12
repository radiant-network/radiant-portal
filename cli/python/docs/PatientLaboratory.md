# PatientLaboratory

Latest CBC, performance status and CSF of a patient

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**cbc** | [**PatientCbc**](PatientCbc.md) |  | [optional] 
**csf** | [**PatientCsf**](PatientCsf.md) |  | [optional] 
**performance_status** | [**List[PatientPerformanceScore]**](PatientPerformanceScore.md) |  | 

## Example

```python
from radiant_python.models.patient_laboratory import PatientLaboratory

# TODO update the JSON string below
json = "{}"
# create an instance of PatientLaboratory from a JSON string
patient_laboratory_instance = PatientLaboratory.from_json(json)
# print the JSON string representation of the object
print(PatientLaboratory.to_json())

# convert the object into a dict
patient_laboratory_dict = patient_laboratory_instance.to_dict()
# create an instance of PatientLaboratory from a dict
patient_laboratory_from_dict = PatientLaboratory.from_dict(patient_laboratory_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


