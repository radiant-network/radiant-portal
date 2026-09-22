# UpdateCaseAssignmentsRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**user_ids** | **List[str]** |  | 

## Example

```python
from radiant_python.models.update_case_assignments_request import UpdateCaseAssignmentsRequest

# TODO update the JSON string below
json = "{}"
# create an instance of UpdateCaseAssignmentsRequest from a JSON string
update_case_assignments_request_instance = UpdateCaseAssignmentsRequest.from_json(json)
# print the JSON string representation of the object
print(UpdateCaseAssignmentsRequest.to_json())

# convert the object into a dict
update_case_assignments_request_dict = update_case_assignments_request_instance.to_dict()
# create an instance of UpdateCaseAssignmentsRequest from a dict
update_case_assignments_request_from_dict = UpdateCaseAssignmentsRequest.from_dict(update_case_assignments_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


