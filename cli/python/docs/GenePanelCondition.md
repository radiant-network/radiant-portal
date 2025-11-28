# GenePanelCondition


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**inheritance_code** | **List[str]** |  | [optional] 
**panel_id** | **str** |  | [optional] 
**panel_name** | **str** |  | 

## Example

```python
from openapi_client.models.gene_panel_condition import GenePanelCondition

# TODO update the JSON string below
json = "{}"
# create an instance of GenePanelCondition from a JSON string
gene_panel_condition_instance = GenePanelCondition.from_json(json)
# print the JSON string representation of the object
print(GenePanelCondition.to_json())

# convert the object into a dict
gene_panel_condition_dict = gene_panel_condition_instance.to_dict()
# create an instance of GenePanelCondition from a dict
gene_panel_condition_from_dict = GenePanelCondition.from_dict(gene_panel_condition_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


