# PatientExchangeOrganization

Organization linked to a patient through TEFCA or Carequality. Linked with no document means nothing was retrieved from it.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**document_classes** | [**List[PatientDocumentClass]**](PatientDocumentClass.md) | Most documents first, then by name | 
**document_count** | **int** |  | 
**name** | **str** |  | 
**network** | **str** | null when documents came from an organization the patient is not linked to | [optional] 

## Example

```python
from radiant_python.models.patient_exchange_organization import PatientExchangeOrganization

# TODO update the JSON string below
json = "{}"
# create an instance of PatientExchangeOrganization from a JSON string
patient_exchange_organization_instance = PatientExchangeOrganization.from_json(json)
# print the JSON string representation of the object
print(PatientExchangeOrganization.to_json())

# convert the object into a dict
patient_exchange_organization_dict = patient_exchange_organization_instance.to_dict()
# create an instance of PatientExchangeOrganization from a dict
patient_exchange_organization_from_dict = PatientExchangeOrganization.from_dict(patient_exchange_organization_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


