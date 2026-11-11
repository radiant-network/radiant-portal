# CasePatientBatch


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**affected_status_code** | **str** |  | 
**family_history** | [**List[FamilyHistoryBatch]**](FamilyHistoryBatch.md) |  | [optional] 
**observations_categorical** | [**List[ObservationCategoricalBatch]**](ObservationCategoricalBatch.md) |  | [optional] 
**observations_text** | [**List[ObservationTextBatch]**](ObservationTextBatch.md) |  | [optional] 
**patient_organization_code** | **str** |  | 
**relation_to_proband_code** | **str** |  | 
**submitter_patient_id** | **str** |  | 

## Example

```python
from radiant_python.models.case_patient_batch import CasePatientBatch

# TODO update the JSON string below
json = "{}"
# create an instance of CasePatientBatch from a JSON string
case_patient_batch_instance = CasePatientBatch.from_json(json)
# print the JSON string representation of the object
print(CasePatientBatch.to_json())

# convert the object into a dict
case_patient_batch_dict = case_patient_batch_instance.to_dict()
# create an instance of CasePatientBatch from a dict
case_patient_batch_from_dict = CasePatientBatch.from_dict(case_patient_batch_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


