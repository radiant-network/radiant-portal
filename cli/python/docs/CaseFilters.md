# CaseFilters


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**analysis_catalog_code** | [**List[FiltersValue]**](FiltersValue.md) |  | 
**case_category_code** | [**List[FiltersValue]**](FiltersValue.md) |  | 
**case_type_code** | [**List[FiltersValue]**](FiltersValue.md) |  | 
**diagnosis_lab_code** | [**List[FiltersValue]**](FiltersValue.md) |  | 
**life_status_code** | [**List[FiltersValue]**](FiltersValue.md) |  | 
**ordering_organization_code** | [**List[FiltersValue]**](FiltersValue.md) |  | 
**panel_code** | [**List[FiltersValue]**](FiltersValue.md) |  | 
**priority_code** | [**List[FiltersValue]**](FiltersValue.md) |  | 
**project_code** | [**List[FiltersValue]**](FiltersValue.md) |  | 
**resolution_status_code** | [**List[FiltersValue]**](FiltersValue.md) |  | 
**status_code** | [**List[FiltersValue]**](FiltersValue.md) |  | 

## Example

```python
from radiant_python.models.case_filters import CaseFilters

# TODO update the JSON string below
json = "{}"
# create an instance of CaseFilters from a JSON string
case_filters_instance = CaseFilters.from_json(json)
# print the JSON string representation of the object
print(CaseFilters.to_json())

# convert the object into a dict
case_filters_dict = case_filters_instance.to_dict()
# create an instance of CaseFilters from a dict
case_filters_from_dict = CaseFilters.from_dict(case_filters_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


