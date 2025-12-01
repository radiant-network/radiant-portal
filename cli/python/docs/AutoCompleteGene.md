# AutoCompleteGene


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**highlight** | [**Term**](Term.md) |  | [optional] 
**source** | [**Term**](Term.md) |  | [optional] 

## Example

```python
from radiant_python.models.auto_complete_gene import AutoCompleteGene

# TODO update the JSON string below
json = "{}"
# create an instance of AutoCompleteGene from a JSON string
auto_complete_gene_instance = AutoCompleteGene.from_json(json)
# print the JSON string representation of the object
print(AutoCompleteGene.to_json())

# convert the object into a dict
auto_complete_gene_dict = auto_complete_gene_instance.to_dict()
# create an instance of AutoCompleteGene from a dict
auto_complete_gene_from_dict = AutoCompleteGene.from_dict(auto_complete_gene_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


