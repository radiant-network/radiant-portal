# CaseSequencingRequest

Sequencing service requested for a case member, whether or not it has been delivered yet

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**affected_status_code** | **str** |  | 
**created_on** | **str** |  | 
**id** | **int** |  | 
**patient_id** | **int** |  | 
**relationship_to_proband** | **str** |  | 
**service_code** | **str** |  | 
**service_name** | **str** |  | [optional] 
**status_code** | **str** |  | 
**submitter_sequencing_request_id** | **str** |  | 
**updated_on** | **str** |  | 

## Example

```python
from radiant_python.models.case_sequencing_request import CaseSequencingRequest

# TODO update the JSON string below
json = "{}"
# create an instance of CaseSequencingRequest from a JSON string
case_sequencing_request_instance = CaseSequencingRequest.from_json(json)
# print the JSON string representation of the object
print(CaseSequencingRequest.to_json())

# convert the object into a dict
case_sequencing_request_dict = case_sequencing_request_instance.to_dict()
# create an instance of CaseSequencingRequest from a dict
case_sequencing_request_from_dict = CaseSequencingRequest.from_dict(case_sequencing_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


