# CaseFamilyHistory

A condition reported in a member's family, and who it was reported for

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**condition** | **str** |  | 
**family_member_code** | **str** |  | 

## Example

```python
from radiant_python.models.case_family_history import CaseFamilyHistory

# TODO update the JSON string below
json = "{}"
# create an instance of CaseFamilyHistory from a JSON string
case_family_history_instance = CaseFamilyHistory.from_json(json)
# print the JSON string representation of the object
print(CaseFamilyHistory.to_json())

# convert the object into a dict
case_family_history_dict = case_family_history_instance.to_dict()
# create an instance of CaseFamilyHistory from a dict
case_family_history_from_dict = CaseFamilyHistory.from_dict(case_family_history_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


