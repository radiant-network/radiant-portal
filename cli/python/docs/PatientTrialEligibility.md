# PatientTrialEligibility

Eligibility verdict of a patient for one clinical trial. reasoning and brim_url are PHI: null without PHI access.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**brim_url** | **str** | Re-identifies the patient in BRIM | [optional] 
**confidence** | **str** | BRIM&#39;s score, as BRIM writes it | [optional] 
**generated_verdict** | **str** | As BRIM produced it, before review | [optional] 
**loaded_at** | **str** | When the BRIM export was loaded, not a clinical date | 
**reasoning** | **str** | Quotes the patient&#39;s notes | [optional] 
**review_status** | **str** | null when not reviewed | [optional] 
**variable_name** | **str** | The BRIM variable assessed, naming the trial | 
**verdict** | **str** | After any human review edit, the operative value | 

## Example

```python
from radiant_python.models.patient_trial_eligibility import PatientTrialEligibility

# TODO update the JSON string below
json = "{}"
# create an instance of PatientTrialEligibility from a JSON string
patient_trial_eligibility_instance = PatientTrialEligibility.from_json(json)
# print the JSON string representation of the object
print(PatientTrialEligibility.to_json())

# convert the object into a dict
patient_trial_eligibility_dict = patient_trial_eligibility_instance.to_dict()
# create an instance of PatientTrialEligibility from a dict
patient_trial_eligibility_from_dict = PatientTrialEligibility.from_dict(patient_trial_eligibility_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


