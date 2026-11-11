# ComphetGene

ComphetGene is the number of compound heterozygous partners of a variant in one gene

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**nb** | **int** |  | 
**symbol** | **str** |  | 

## Example

```python
from radiant_python.models.comphet_gene import ComphetGene

# TODO update the JSON string below
json = "{}"
# create an instance of ComphetGene from a JSON string
comphet_gene_instance = ComphetGene.from_json(json)
# print the JSON string representation of the object
print(ComphetGene.to_json())

# convert the object into a dict
comphet_gene_dict = comphet_gene_instance.to_dict()
# create an instance of ComphetGene from a dict
comphet_gene_from_dict = ComphetGene.from_dict(comphet_gene_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


