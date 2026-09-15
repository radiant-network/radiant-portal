# UpdateCaseStatusInput

A case status change applied by a user.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**status_code** | **str** |  | [optional] 

## Example

```python
from radiant_python.models.update_case_status_input import UpdateCaseStatusInput

# TODO update the JSON string below
json = "{}"
# create an instance of UpdateCaseStatusInput from a JSON string
update_case_status_input_instance = UpdateCaseStatusInput.from_json(json)
# print the JSON string representation of the object
print(UpdateCaseStatusInput.to_json())

# convert the object into a dict
update_case_status_input_dict = update_case_status_input_instance.to_dict()
# create an instance of UpdateCaseStatusInput from a dict
update_case_status_input_from_dict = UpdateCaseStatusInput.from_dict(update_case_status_input_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


