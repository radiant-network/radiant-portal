# PatientSurvival

Survival time of one patient, for the Kaplan-Meier

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**cns_integrated_diagnosis** | **str** |  | [optional] 
**days** | **int** |  | 
**event** | **bool** | true when deceased | 
**organization_code** | **str** |  | 

## Example

```python
from radiant_python.models.patient_survival import PatientSurvival

# TODO update the JSON string below
json = "{}"
# create an instance of PatientSurvival from a JSON string
patient_survival_instance = PatientSurvival.from_json(json)
# print the JSON string representation of the object
print(PatientSurvival.to_json())

# convert the object into a dict
patient_survival_dict = patient_survival_instance.to_dict()
# create an instance of PatientSurvival from a dict
patient_survival_from_dict = PatientSurvival.from_dict(patient_survival_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


