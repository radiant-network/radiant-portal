# PatientListItem

A PCX patient in the patient list

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**age_at_initial_dx_days** | **int** |  | [optional] 
**age_at_vital_status_days** | **int** |  | [optional] 
**birth_year** | **int** |  | [optional] 
**can_read_phi** | **bool** |  | 
**case_count** | **int** | Portal cases, 0 outside the portal | 
**cns_integrated_diagnosis** | **str** | From the initial event | [optional] 
**cns_integrated_diagnosis_source** | **str** | Dataset of the diagnosis, e.g. CBTN or OpenPedCan | [optional] 
**family_name** | **str** | Placeholder when can_read_phi is false | 
**gender** | **str** |  | 
**given_name** | **str** | Placeholder when can_read_phi is false | 
**has_imaging** | **bool** |  | 
**organization_code** | **str** |  | 
**organization_name** | **str** |  | 
**patient_id** | **str** |  | 
**patient_id_type** | **str** |  | 
**patient_key** | **str** | Opaque key for the patient page URL, the same for every user | 
**radiant_patient_id** | **int** | Portal patient id, null outside the portal | [optional] 
**survival_days** | **int** | Vital status day minus initial diagnosis day | [optional] 
**vital_status** | **str** |  | 

## Example

```python
from radiant_python.models.patient_list_item import PatientListItem

# TODO update the JSON string below
json = "{}"
# create an instance of PatientListItem from a JSON string
patient_list_item_instance = PatientListItem.from_json(json)
# print the JSON string representation of the object
print(PatientListItem.to_json())

# convert the object into a dict
patient_list_item_dict = patient_list_item_instance.to_dict()
# create an instance of PatientListItem from a dict
patient_list_item_from_dict = PatientListItem.from_dict(patient_list_item_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


