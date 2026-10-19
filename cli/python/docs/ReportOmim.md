# ReportOmim

An OMIM phenotype of a gene.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**inheritance_code** | **List[str]** |  | [optional] 
**name** | **str** |  | 
**phenotype_id** | **str** |  | 

## Example

```python
from radiant_python.models.report_omim import ReportOmim

# TODO update the JSON string below
json = "{}"
# create an instance of ReportOmim from a JSON string
report_omim_instance = ReportOmim.from_json(json)
# print the JSON string representation of the object
print(ReportOmim.to_json())

# convert the object into a dict
report_omim_dict = report_omim_instance.to_dict()
# create an instance of ReportOmim from a dict
report_omim_from_dict = ReportOmim.from_dict(report_omim_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


