# PatientTumorBoard

Tumor board sessions of a patient, and whether the caller can download the patient's presentation deck

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**has_deck** | **bool** | false without PHI access | 
**sessions** | [**List[PatientTumorBoardSession]**](PatientTumorBoardSession.md) | Most recent first | 

## Example

```python
from radiant_python.models.patient_tumor_board import PatientTumorBoard

# TODO update the JSON string below
json = "{}"
# create an instance of PatientTumorBoard from a JSON string
patient_tumor_board_instance = PatientTumorBoard.from_json(json)
# print the JSON string representation of the object
print(PatientTumorBoard.to_json())

# convert the object into a dict
patient_tumor_board_dict = patient_tumor_board_instance.to_dict()
# create an instance of PatientTumorBoard from a dict
patient_tumor_board_from_dict = PatientTumorBoard.from_dict(patient_tumor_board_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


