# PatientPerformanceScore

Lansky or Karnofsky score. The date is when the result was released, not when it was assessed.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**var_date** | **date** |  | [optional] 
**day** | **int** |  | [optional] 
**scale** | **str** |  | 
**score** | **int** |  | 
**score_text** | **str** | As recorded, e.g. \&quot;90 - Minor restrictions in strenuous physical activity\&quot; | [optional] 

## Example

```python
from radiant_python.models.patient_performance_score import PatientPerformanceScore

# TODO update the JSON string below
json = "{}"
# create an instance of PatientPerformanceScore from a JSON string
patient_performance_score_instance = PatientPerformanceScore.from_json(json)
# print the JSON string representation of the object
print(PatientPerformanceScore.to_json())

# convert the object into a dict
patient_performance_score_dict = patient_performance_score_instance.to_dict()
# create an instance of PatientPerformanceScore from a dict
patient_performance_score_from_dict = PatientPerformanceScore.from_dict(patient_performance_score_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


