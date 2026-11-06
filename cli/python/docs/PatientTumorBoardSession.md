# PatientTumorBoardSession

Tumor board session of a patient. The date is PHI, like every date of the patient view.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**consensus** | **str** |  | [optional] 
**var_date** | **date** |  | [optional] 
**day** | **int** |  | [optional] 
**diagnosis** | **str** |  | [optional] 
**has_report** | **bool** | false without PHI access | 
**reason** | **str** |  | [optional] 
**recommendations** | **List[str]** |  | 
**session_id** | **int** |  | 
**status** | **str** |  | [optional] 

## Example

```python
from radiant_python.models.patient_tumor_board_session import PatientTumorBoardSession

# TODO update the JSON string below
json = "{}"
# create an instance of PatientTumorBoardSession from a JSON string
patient_tumor_board_session_instance = PatientTumorBoardSession.from_json(json)
# print the JSON string representation of the object
print(PatientTumorBoardSession.to_json())

# convert the object into a dict
patient_tumor_board_session_dict = patient_tumor_board_session_instance.to_dict()
# create an instance of PatientTumorBoardSession from a dict
patient_tumor_board_session_from_dict = PatientTumorBoardSession.from_dict(patient_tumor_board_session_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


