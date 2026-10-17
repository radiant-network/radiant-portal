# ReportVariant

Variant level data of the report.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**alternate** | **str** |  | [optional] 
**chromosome** | **str** |  | [optional] 
**clinvar_id** | **str** |  | [optional] 
**clinvar_interpretation** | **List[str]** |  | [optional] 
**gnomad** | [**ReportGnomad**](ReportGnomad.md) |  | [optional] 
**hgvsg** | **str** |  | [optional] 
**locus_id** | **str** |  | 
**reference** | **str** |  | [optional] 
**rsnumber** | **str** |  | [optional] 
**start** | **int** |  | [optional] 
**symbol** | **str** |  | [optional] 

## Example

```python
from radiant_python.models.report_variant import ReportVariant

# TODO update the JSON string below
json = "{}"
# create an instance of ReportVariant from a JSON string
report_variant_instance = ReportVariant.from_json(json)
# print the JSON string representation of the object
print(ReportVariant.to_json())

# convert the object into a dict
report_variant_dict = report_variant_instance.to_dict()
# create an instance of ReportVariant from a dict
report_variant_from_dict = ReportVariant.from_dict(report_variant_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


