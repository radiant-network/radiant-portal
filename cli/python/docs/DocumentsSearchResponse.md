# DocumentsSearchResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**count** | **int** |  | 
**list** | [**List[DocumentResult]**](DocumentResult.md) |  | 

## Example

```python
from radiant_python.models.documents_search_response import DocumentsSearchResponse

# TODO update the JSON string below
json = "{}"
# create an instance of DocumentsSearchResponse from a JSON string
documents_search_response_instance = DocumentsSearchResponse.from_json(json)
# print the JSON string representation of the object
print(DocumentsSearchResponse.to_json())

# convert the object into a dict
documents_search_response_dict = documents_search_response_instance.to_dict()
# create an instance of DocumentsSearchResponse from a dict
documents_search_response_from_dict = DocumentsSearchResponse.from_dict(documents_search_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


