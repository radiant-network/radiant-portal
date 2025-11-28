# OmimGenePanel


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**inheritance_code** | **List[str]** |  | [optional] 
**omim_phenotype_id** | **str** |  | [optional] 
**panel** | **str** |  | [optional] 

## Example

```python
from openapi_client.models.omim_gene_panel import OmimGenePanel

# TODO update the JSON string below
json = "{}"
# create an instance of OmimGenePanel from a JSON string
omim_gene_panel_instance = OmimGenePanel.from_json(json)
# print the JSON string representation of the object
print(OmimGenePanel.to_json())

# convert the object into a dict
omim_gene_panel_dict = omim_gene_panel_instance.to_dict()
# create an instance of OmimGenePanel from a dict
omim_gene_panel_from_dict = OmimGenePanel.from_dict(omim_gene_panel_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


