# GeneResult


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**ensembl_gene_id** | **str** |  | [optional] 
**symbol** | **str** |  | [optional] 

## Example

```python
from radiant_python.models.gene_result import GeneResult

# TODO update the JSON string below
json = "{}"
# create an instance of GeneResult from a JSON string
gene_result_instance = GeneResult.from_json(json)
# print the JSON string representation of the object
print(GeneResult.to_json())

# convert the object into a dict
gene_result_dict = gene_result_instance.to_dict()
# create an instance of GeneResult from a dict
gene_result_from_dict = GeneResult.from_dict(gene_result_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


