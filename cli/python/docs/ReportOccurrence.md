# ReportOccurrence

Occurrence level data of the report (germline call of the sequencing).

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**ad_alt** | **int** |  | [optional] 
**ad_ratio** | **float** |  | [optional] 
**ad_total** | **int** |  | [optional] 
**father_zygosity** | **str** |  | [optional] 
**mother_zygosity** | **str** |  | [optional] 
**parental_origin** | **str** |  | [optional] 
**transmission_mode** | **str** |  | [optional] 
**zygosity** | **str** |  | [optional] 

## Example

```python
from radiant_python.models.report_occurrence import ReportOccurrence

# TODO update the JSON string below
json = "{}"
# create an instance of ReportOccurrence from a JSON string
report_occurrence_instance = ReportOccurrence.from_json(json)
# print the JSON string representation of the object
print(ReportOccurrence.to_json())

# convert the object into a dict
report_occurrence_dict = report_occurrence_instance.to_dict()
# create an instance of ReportOccurrence from a dict
report_occurrence_from_dict = ReportOccurrence.from_dict(report_occurrence_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


