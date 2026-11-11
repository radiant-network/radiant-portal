# CreatePatientBatchBody

CreatePatientBatchBody represents the body required to create a patient batch

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**patients** | [**List[PatientBatch]**](PatientBatch.md) |  | 

## Example

```python
from radiant_python.models.create_patient_batch_body import CreatePatientBatchBody

# TODO update the JSON string below
json = "{}"
# create an instance of CreatePatientBatchBody from a JSON string
create_patient_batch_body_instance = CreatePatientBatchBody.from_json(json)
# print the JSON string representation of the object
print(CreatePatientBatchBody.to_json())

# convert the object into a dict
create_patient_batch_body_dict = create_patient_batch_body_instance.to_dict()
# create an instance of CreatePatientBatchBody from a dict
create_patient_batch_body_from_dict = CreatePatientBatchBody.from_dict(create_patient_batch_body_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


