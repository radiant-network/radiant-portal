# DocumentFilters


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**data_type_code** | [**List[FiltersValue]**](FiltersValue.md) |  | 
**diagnosis_lab_code** | [**List[FiltersValue]**](FiltersValue.md) |  | [optional] 
**format_code** | [**List[FiltersValue]**](FiltersValue.md) |  | 
**project_code** | [**List[FiltersValue]**](FiltersValue.md) |  | [optional] 
**relationship_to_proband_code** | [**List[FiltersValue]**](FiltersValue.md) |  | 

## Example

```python
from radiant_python.models.document_filters import DocumentFilters

# TODO update the JSON string below
json = "{}"
# create an instance of DocumentFilters from a JSON string
document_filters_instance = DocumentFilters.from_json(json)
# print the JSON string representation of the object
print(DocumentFilters.to_json())

# convert the object into a dict
document_filters_dict = document_filters_instance.to_dict()
# create an instance of DocumentFilters from a dict
document_filters_from_dict = DocumentFilters.from_dict(document_filters_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


