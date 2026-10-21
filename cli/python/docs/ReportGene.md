# ReportGene

A gene of the variant with its OMIM pheno

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**omim** | [**List[ReportOmim]**](ReportOmim.md) |  | 
**symbol** | **str** |  | 

## Example

```python
from radiant_python.models.report_gene import ReportGene

# TODO update the JSON string below
json = "{}"
# create an instance of ReportGene from a JSON string
report_gene_instance = ReportGene.from_json(json)
# print the JSON string representation of the object
print(ReportGene.to_json())

# convert the object into a dict
report_gene_dict = report_gene_instance.to_dict()
# create an instance of ReportGene from a dict
report_gene_from_dict = ReportGene.from_dict(report_gene_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


