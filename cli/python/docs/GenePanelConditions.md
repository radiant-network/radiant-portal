# GenePanelConditions


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**conditions** | **Dict[str, List[GenePanelCondition]]** |  | 
**count_hpo** | **int** |  | 
**count_omim** | **int** |  | 
**count_orphanet** | **int** |  | 

## Example

```python
from openapi_client.models.gene_panel_conditions import GenePanelConditions

# TODO update the JSON string below
json = "{}"
# create an instance of GenePanelConditions from a JSON string
gene_panel_conditions_instance = GenePanelConditions.from_json(json)
# print the JSON string representation of the object
print(GenePanelConditions.to_json())

# convert the object into a dict
gene_panel_conditions_dict = gene_panel_conditions_instance.to_dict()
# create an instance of GenePanelConditions from a dict
gene_panel_conditions_from_dict = GenePanelConditions.from_dict(gene_panel_conditions_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


