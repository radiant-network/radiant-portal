# ReportGnomad

gnomAD joint frequency of the variant; absent when the variant is not in gnomAD.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**ac** | **int** |  | 
**af** | **float** |  | 
**an** | **int** |  | 
**hom** | **int** |  | 

## Example

```python
from radiant_python.models.report_gnomad import ReportGnomad

# TODO update the JSON string below
json = "{}"
# create an instance of ReportGnomad from a JSON string
report_gnomad_instance = ReportGnomad.from_json(json)
# print the JSON string representation of the object
print(ReportGnomad.to_json())

# convert the object into a dict
report_gnomad_dict = report_gnomad_instance.to_dict()
# create an instance of ReportGnomad from a dict
report_gnomad_from_dict = ReportGnomad.from_dict(report_gnomad_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


