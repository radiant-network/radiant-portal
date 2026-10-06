# PatientStatistics

Statistics on every patient the caller can see, regardless of the list filters

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**by_age_bucket** | [**List[Aggregation]**](Aggregation.md) | Keys 0-4, 5-9, 10-14, 15-19, 20+ | 
**by_diagnosis** | [**List[Aggregation]**](Aggregation.md) |  | 
**by_organization** | [**List[PatientOrganizationVitalCount]**](PatientOrganizationVitalCount.md) |  | 
**imaging_count** | **int** |  | 
**survival** | [**List[PatientSurvival]**](PatientSurvival.md) | Input of the Kaplan-Meier | 
**total** | **int** |  | 
**with_cases_count** | **int** |  | 

## Example

```python
from radiant_python.models.patient_statistics import PatientStatistics

# TODO update the JSON string below
json = "{}"
# create an instance of PatientStatistics from a JSON string
patient_statistics_instance = PatientStatistics.from_json(json)
# print the JSON string representation of the object
print(PatientStatistics.to_json())

# convert the object into a dict
patient_statistics_dict = patient_statistics_instance.to_dict()
# create an instance of PatientStatistics from a dict
patient_statistics_from_dict = PatientStatistics.from_dict(patient_statistics_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


