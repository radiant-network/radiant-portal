# GenePanelUploadResult

Result of a gene panel upload. The file replaced all the uploaded gene panels of the tenant.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**genes** | **int** |  | [optional] 
**panels** | **int** |  | [optional] 
**warnings** | [**List[GenePanelUploadWarning]**](GenePanelUploadWarning.md) |  | [optional] 

## Example

```python
from radiant_python.models.gene_panel_upload_result import GenePanelUploadResult

# TODO update the JSON string below
json = "{}"
# create an instance of GenePanelUploadResult from a JSON string
gene_panel_upload_result_instance = GenePanelUploadResult.from_json(json)
# print the JSON string representation of the object
print(GenePanelUploadResult.to_json())

# convert the object into a dict
gene_panel_upload_result_dict = gene_panel_upload_result_instance.to_dict()
# create an instance of GenePanelUploadResult from a dict
gene_panel_upload_result_from_dict = GenePanelUploadResult.from_dict(gene_panel_upload_result_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


