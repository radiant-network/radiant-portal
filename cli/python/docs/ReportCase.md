# ReportCase

Case context of the report: identifiers printed in the file name and the sheet.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**case_id** | **int** |  | 
**genome_build** | **str** |  | [optional] 
**is_proband** | **bool** |  | 
**seq_id** | **int** |  | 
**submitter_patient_id** | **str** |  | [optional] 
**submitter_sample_id** | **str** |  | [optional] 
**task_id** | **int** |  | 

## Example

```python
from radiant_python.models.report_case import ReportCase

# TODO update the JSON string below
json = "{}"
# create an instance of ReportCase from a JSON string
report_case_instance = ReportCase.from_json(json)
# print the JSON string representation of the object
print(ReportCase.to_json())

# convert the object into a dict
report_case_dict = report_case_instance.to_dict()
# create an instance of ReportCase from a dict
report_case_from_dict = ReportCase.from_dict(report_case_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


