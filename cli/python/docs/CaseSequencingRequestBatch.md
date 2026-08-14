# CaseSequencingRequestBatch


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**patient_organization_code** | **str** |  | 
**service_code** | **str** |  | 
**status_code** | **str** |  | 
**submitter_patient_id** | **str** |  | 
**submitter_sequencing_request_id** | **str** |  | 

## Example

```python
from radiant_python.models.case_sequencing_request_batch import CaseSequencingRequestBatch

# TODO update the JSON string below
json = "{}"
# create an instance of CaseSequencingRequestBatch from a JSON string
case_sequencing_request_batch_instance = CaseSequencingRequestBatch.from_json(json)
# print the JSON string representation of the object
print(CaseSequencingRequestBatch.to_json())

# convert the object into a dict
case_sequencing_request_batch_dict = case_sequencing_request_batch_instance.to_dict()
# create an instance of CaseSequencingRequestBatch from a dict
case_sequencing_request_batch_from_dict = CaseSequencingRequestBatch.from_dict(case_sequencing_request_batch_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


