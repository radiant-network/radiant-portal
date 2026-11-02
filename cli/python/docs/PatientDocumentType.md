# PatientDocumentType

Number of documents of one type within a document class

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**document_count** | **int** |  | 
**name** | **str** |  | 

## Example

```python
from radiant_python.models.patient_document_type import PatientDocumentType

# TODO update the JSON string below
json = "{}"
# create an instance of PatientDocumentType from a JSON string
patient_document_type_instance = PatientDocumentType.from_json(json)
# print the JSON string representation of the object
print(PatientDocumentType.to_json())

# convert the object into a dict
patient_document_type_dict = patient_document_type_instance.to_dict()
# create an instance of PatientDocumentType from a dict
patient_document_type_from_dict = PatientDocumentType.from_dict(patient_document_type_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


