# CaseFilters


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**case_analysis** | [**List[Aggregation]**](Aggregation.md) |  | 
**diagnosis_lab** | [**List[Aggregation]**](Aggregation.md) |  | 
**ordering_organization** | [**List[Aggregation]**](Aggregation.md) |  | 
**priority** | [**List[Aggregation]**](Aggregation.md) |  | 
**project** | [**List[Aggregation]**](Aggregation.md) |  | 
**status** | [**List[Aggregation]**](Aggregation.md) |  | 

## Example

```python
from openapi_client.models.case_filters import CaseFilters

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


