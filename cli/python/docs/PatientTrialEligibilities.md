# PatientTrialEligibilities

Clinical trial eligibility verdicts of a patient, extracted from the patient's notes by BRIM

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**assessments** | [**List[PatientTrialEligibility]**](PatientTrialEligibility.md) | Most recently loaded first | 

## Example

```python
from radiant_python.models.patient_trial_eligibilities import PatientTrialEligibilities

# TODO update the JSON string below
json = "{}"
# create an instance of PatientTrialEligibilities from a JSON string
patient_trial_eligibilities_instance = PatientTrialEligibilities.from_json(json)
# print the JSON string representation of the object
print(PatientTrialEligibilities.to_json())

# convert the object into a dict
patient_trial_eligibilities_dict = patient_trial_eligibilities_instance.to_dict()
# create an instance of PatientTrialEligibilities from a dict
patient_trial_eligibilities_from_dict = PatientTrialEligibilities.from_dict(patient_trial_eligibilities_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


