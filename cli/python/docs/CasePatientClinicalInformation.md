# CasePatientClinicalInformation

Patient clinical information to display in Case Entity

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**affected_status_code** | **str** |  | 
**date_of_birth** | **str** |  | [optional] 
**ethnicity_codes** | **List[str]** | TODO | [optional] 
**non_observed_phenotypes** | [**List[Term]**](Term.md) |  | [optional] 
**observed_phenotypes** | [**List[Term]**](Term.md) |  | [optional] 
**organization_code** | **str** |  | [optional] 
**organization_name** | **str** |  | [optional] 
**patient_id** | **int** |  | 
**relationship_to_proband** | **str** |  | 
**sex_code** | **str** |  | 
**submitter_patient_id** | **str** |  | [optional] 

## Example

```python
from radiant_python.models.case_patient_clinical_information import CasePatientClinicalInformation

# TODO update the JSON string below
json = "{}"
# create an instance of CasePatientClinicalInformation from a JSON string
case_patient_clinical_information_instance = CasePatientClinicalInformation.from_json(json)
# print the JSON string representation of the object
print(CasePatientClinicalInformation.to_json())

# convert the object into a dict
case_patient_clinical_information_dict = case_patient_clinical_information_instance.to_dict()
# create an instance of CasePatientClinicalInformation from a dict
case_patient_clinical_information_from_dict = CasePatientClinicalInformation.from_dict(case_patient_clinical_information_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


