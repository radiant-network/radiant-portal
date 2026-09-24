# CaseGroupEmailContext

Values the tenant template was rendered with, echoed so a pipeline log explains the email.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**analysis_codes** | **List[str]** |  | 
**case_ids** | **List[int]** |  | 
**has_stat** | **bool** |  | [optional] 
**manifest_filename** | **str** |  | [optional] 

## Example

```python
from radiant_python.models.case_group_email_context import CaseGroupEmailContext

# TODO update the JSON string below
json = "{}"
# create an instance of CaseGroupEmailContext from a JSON string
case_group_email_context_instance = CaseGroupEmailContext.from_json(json)
# print the JSON string representation of the object
print(CaseGroupEmailContext.to_json())

# convert the object into a dict
case_group_email_context_dict = case_group_email_context_instance.to_dict()
# create an instance of CaseGroupEmailContext from a dict
case_group_email_context_from_dict = CaseGroupEmailContext.from_dict(case_group_email_context_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


