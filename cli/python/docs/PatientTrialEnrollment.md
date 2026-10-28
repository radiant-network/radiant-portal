# PatientTrialEnrollment

Treatment protocol arm the patient was enrolled on, its medical therapies merged

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**chemotherapy_agents** | **List[str]** |  | 
**is_initial_treatment** | **bool** |  | 
**protocol_arm** | **str** | null when Not Applicable | [optional] 
**protocol_name** | **str** |  | 
**start** | [**PatientDayDate**](PatientDayDate.md) |  | 
**stop** | [**PatientDayDate**](PatientDayDate.md) |  | 

## Example

```python
from radiant_python.models.patient_trial_enrollment import PatientTrialEnrollment

# TODO update the JSON string below
json = "{}"
# create an instance of PatientTrialEnrollment from a JSON string
patient_trial_enrollment_instance = PatientTrialEnrollment.from_json(json)
# print the JSON string representation of the object
print(PatientTrialEnrollment.to_json())

# convert the object into a dict
patient_trial_enrollment_dict = patient_trial_enrollment_instance.to_dict()
# create an instance of PatientTrialEnrollment from a dict
patient_trial_enrollment_from_dict = PatientTrialEnrollment.from_dict(patient_trial_enrollment_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


