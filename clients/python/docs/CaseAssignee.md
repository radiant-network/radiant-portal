# CaseAssignee

User assigned to a case, as shown in the cases list and on the case entity page. Name and email are the attributes the identity registry holds for them, and are absent for an account that never filled them in.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**email** | **str** |  | [optional] 
**first_name** | **str** |  | [optional] 
**last_name** | **str** |  | [optional] 
**user_id** | **str** |  | 

## Example

```python
from radiant_python.models.case_assignee import CaseAssignee

# TODO update the JSON string below
json = "{}"
# create an instance of CaseAssignee from a JSON string
case_assignee_instance = CaseAssignee.from_json(json)
# print the JSON string representation of the object
print(CaseAssignee.to_json())

# convert the object into a dict
case_assignee_dict = case_assignee_instance.to_dict()
# create an instance of CaseAssignee from a dict
case_assignee_from_dict = CaseAssignee.from_dict(case_assignee_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


