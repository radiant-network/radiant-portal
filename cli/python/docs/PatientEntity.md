# PatientEntity

Data of the patient page

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**age_at_initial_dx_days** | **int** |  | [optional] 
**age_at_vital_status_days** | **int** |  | [optional] 
**birth_date** | **date** |  | [optional] 
**birth_year** | **int** |  | [optional] 
**can_read_phi** | **bool** |  | 
**case_count** | **int** | Portal cases, 0 outside the portal | 
**cases** | [**List[PatientCase]**](PatientCase.md) |  | 
**cns_integrated_diagnosis** | **str** | From the initial event | [optional] 
**data_type_cohort** | **str** |  | [optional] 
**diagnosis_type_cohort** | **str** |  | [optional] 
**ethnicity** | **str** |  | [optional] 
**events** | [**List[PatientEvent]**](PatientEvent.md) |  | 
**family_name** | **str** | Placeholder when can_read_phi is false | 
**gender** | **str** |  | 
**given_name** | **str** | Placeholder when can_read_phi is false | 
**has_imaging** | **bool** |  | 
**imaging** | [**List[PatientImagingSession]**](PatientImagingSession.md) |  | 
**initial_diagnosis_evidence_url** | **str** | BRIM link, format to be defined | [optional] 
**key_dates** | [**PatientKeyDates**](PatientKeyDates.md) |  | 
**organization_code** | **str** |  | 
**organization_name** | **str** |  | 
**patient_id** | **str** |  | 
**patient_id_type** | **str** |  | 
**patient_key** | **str** | Opaque key for the patient page URL, the same for every user | 
**postal_code** | **str** | Full with PHI access, 3 digits + XX otherwise | [optional] 
**race** | **str** |  | [optional] 
**radiant_patient_id** | **int** | Portal patient id, null outside the portal | [optional] 
**radiations** | [**List[PatientRadiation]**](PatientRadiation.md) |  | 
**surgeries** | [**List[PatientSurgery]**](PatientSurgery.md) |  | 
**survival_days** | **int** | Vital status day minus initial diagnosis day | [optional] 
**therapies** | [**List[PatientTherapy]**](PatientTherapy.md) |  | 
**treatment_summary** | [**PatientTreatmentSummary**](PatientTreatmentSummary.md) |  | [optional] 
**vital_status** | **str** |  | 
**vital_status_at** | [**PatientDayDate**](PatientDayDate.md) |  | 

## Example

```python
from radiant_python.models.patient_entity import PatientEntity

# TODO update the JSON string below
json = "{}"
# create an instance of PatientEntity from a JSON string
patient_entity_instance = PatientEntity.from_json(json)
# print the JSON string representation of the object
print(PatientEntity.to_json())

# convert the object into a dict
patient_entity_dict = patient_entity_instance.to_dict()
# create an instance of PatientEntity from a dict
patient_entity_from_dict = PatientEntity.from_dict(patient_entity_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


