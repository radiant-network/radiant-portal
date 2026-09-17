# ListAssignmentCandidatesBody


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**case_ids** | **List[int]** |  | [optional] 
**limit** | **int** |  | [optional] 
**offset** | **int** |  | [optional] 
**page_index** | **int** |  | [optional] 
**search** | **str** |  | [optional] 

## Example

```python
from radiant_python.models.list_assignment_candidates_body import ListAssignmentCandidatesBody

# TODO update the JSON string below
json = "{}"
# create an instance of ListAssignmentCandidatesBody from a JSON string
list_assignment_candidates_body_instance = ListAssignmentCandidatesBody.from_json(json)
# print the JSON string representation of the object
print(ListAssignmentCandidatesBody.to_json())

# convert the object into a dict
list_assignment_candidates_body_dict = list_assignment_candidates_body_instance.to_dict()
# create an instance of ListAssignmentCandidatesBody from a dict
list_assignment_candidates_body_from_dict = ListAssignmentCandidatesBody.from_dict(list_assignment_candidates_body_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


