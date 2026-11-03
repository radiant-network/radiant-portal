# PatientExternalRecords

Organizations linked to the patient through the health information network (TEFCA or Carequality), and the documents retrieved from them

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**document_class_count** | **int** | Distinct document classes across the organizations | 
**document_count** | **int** |  | 
**organization_count** | **int** |  | 
**organizations** | [**List[PatientExchangeOrganization]**](PatientExchangeOrganization.md) | Most documents first, then by name | 

## Example

```python
from radiant_python.models.patient_external_records import PatientExternalRecords

# TODO update the JSON string below
json = "{}"
# create an instance of PatientExternalRecords from a JSON string
patient_external_records_instance = PatientExternalRecords.from_json(json)
# print the JSON string representation of the object
print(PatientExternalRecords.to_json())

# convert the object into a dict
patient_external_records_dict = patient_external_records_instance.to_dict()
# create an instance of PatientExternalRecords from a dict
patient_external_records_from_dict = PatientExternalRecords.from_dict(patient_external_records_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


