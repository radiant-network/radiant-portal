# CaseGroupEmailReport

Outcome of the notification for one diagnosis laboratory of the group.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**case_count** | **int** |  | [optional] 
**context** | [**CaseGroupEmailContext**](CaseGroupEmailContext.md) |  | [optional] 
**document_count** | **int** |  | [optional] 
**error** | **str** |  | [optional] 
**organization_code** | **str** |  | 
**recipients** | **List[str]** |  | 
**status** | **str** |  | 
**template** | **str** |  | [optional] 

## Example

```python
from radiant_python.models.case_group_email_report import CaseGroupEmailReport

# TODO update the JSON string below
json = "{}"
# create an instance of CaseGroupEmailReport from a JSON string
case_group_email_report_instance = CaseGroupEmailReport.from_json(json)
# print the JSON string representation of the object
print(CaseGroupEmailReport.to_json())

# convert the object into a dict
case_group_email_report_dict = case_group_email_report_instance.to_dict()
# create an instance of CaseGroupEmailReport from a dict
case_group_email_report_from_dict = CaseGroupEmailReport.from_dict(case_group_email_report_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


