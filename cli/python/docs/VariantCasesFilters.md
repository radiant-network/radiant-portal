# VariantCasesFilters


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**analysis_catalog_code** | [**List[Aggregation]**](Aggregation.md) |  | 
**classification** | [**List[Aggregation]**](Aggregation.md) |  | 
**diagnosis_lab_code** | [**List[Aggregation]**](Aggregation.md) |  | 
**sex_code** | [**List[Aggregation]**](Aggregation.md) |  | 
**transmission_mode** | [**List[Aggregation]**](Aggregation.md) |  | 
**zygosity** | [**List[Aggregation]**](Aggregation.md) |  | 

## Example

```python
from radiant_python.models.variant_cases_filters import VariantCasesFilters

# TODO update the JSON string below
json = "{}"
# create an instance of VariantCasesFilters from a JSON string
variant_cases_filters_instance = VariantCasesFilters.from_json(json)
# print the JSON string representation of the object
print(VariantCasesFilters.to_json())

# convert the object into a dict
variant_cases_filters_dict = variant_cases_filters_instance.to_dict()
# create an instance of VariantCasesFilters from a dict
variant_cases_filters_from_dict = VariantCasesFilters.from_dict(variant_cases_filters_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


