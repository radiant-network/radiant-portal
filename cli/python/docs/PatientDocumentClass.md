# PatientDocumentClass

Documents of one class retrieved from an organization, with its document types

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**document_count** | **int** |  | 
**name** | **str** |  | 
**types** | [**List[PatientDocumentType]**](PatientDocumentType.md) | Most documents first, then by name; empty when the class&#39;s only type has its own name | 

## Example

```python
from radiant_python.models.patient_document_class import PatientDocumentClass

# TODO update the JSON string below
json = "{}"
# create an instance of PatientDocumentClass from a JSON string
patient_document_class_instance = PatientDocumentClass.from_json(json)
# print the JSON string representation of the object
print(PatientDocumentClass.to_json())

# convert the object into a dict
patient_document_class_dict = patient_document_class_instance.to_dict()
# create an instance of PatientDocumentClass from a dict
patient_document_class_from_dict = PatientDocumentClass.from_dict(patient_document_class_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


