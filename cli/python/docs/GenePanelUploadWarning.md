# GenePanelUploadWarning

A gene row of the file that the upload skipped, or kept with the Ensembl gene name.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**line** | **int** |  | [optional] 
**message** | **str** |  | [optional] 
**symbol** | **str** |  | [optional] 

## Example

```python
from radiant_python.models.gene_panel_upload_warning import GenePanelUploadWarning

# TODO update the JSON string below
json = "{}"
# create an instance of GenePanelUploadWarning from a JSON string
gene_panel_upload_warning_instance = GenePanelUploadWarning.from_json(json)
# print the JSON string representation of the object
print(GenePanelUploadWarning.to_json())

# convert the object into a dict
gene_panel_upload_warning_dict = gene_panel_upload_warning_instance.to_dict()
# create an instance of GenePanelUploadWarning from a dict
gene_panel_upload_warning_from_dict = GenePanelUploadWarning.from_dict(gene_panel_upload_warning_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


