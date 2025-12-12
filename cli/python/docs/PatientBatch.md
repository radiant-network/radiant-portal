# PatientBatch


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**date_of_birth** | **date** |  | 
**first_name** | **str** |  | [optional] 
**jhn** | **str** |  | [optional] 
**last_name** | **str** |  | [optional] 
**life_status_code** | **str** |  | 
**patient_organization_code** | **str** |  | 
**sex_code** | **str** |  | 
**submitter_patient_id** | **str** |  | 
**submitter_patient_id_type** | **str** |  | 

## Example

```python
from radiant_python.models.patient_batch import PatientBatch

# TODO update the JSON string below
json = "{}"
# create an instance of PatientBatch from a JSON string
patient_batch_instance = PatientBatch.from_json(json)
# print the JSON string representation of the object
print(PatientBatch.to_json())

# convert the object into a dict
patient_batch_dict = patient_batch_instance.to_dict()
# create an instance of PatientBatch from a dict
patient_batch_from_dict = PatientBatch.from_dict(patient_batch_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


