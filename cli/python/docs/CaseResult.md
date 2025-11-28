# CaseResult

Line represented a case in case list

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**analysis_catalog_code** | **str** |  | [optional] 
**analysis_catalog_name** | **str** |  | [optional] 
**case_id** | **int** |  | 
**case_type** | **str** |  | [optional] 
**created_on** | **str** |  | 
**diagnosis_lab_code** | **str** |  | [optional] 
**diagnosis_lab_name** | **str** |  | [optional] 
**has_variants** | **bool** |  | 
**ordering_organization_code** | **str** |  | [optional] 
**ordering_organization_name** | **str** |  | [optional] 
**organization_code** | **str** |  | [optional] 
**organization_name** | **str** |  | [optional] 
**prescriber** | **str** |  | [optional] 
**primary_condition_id** | **str** |  | [optional] 
**primary_condition_name** | **str** |  | [optional] 
**priority_code** | **str** |  | [optional] 
**proband_id** | **int** |  | [optional] 
**project_code** | **str** |  | [optional] 
**project_name** | **str** |  | [optional] 
**status_code** | **str** |  | 
**submitter_proband_id** | **str** |  | [optional] 
**updated_on** | **str** |  | 

## Example

```python
from openapi_client.models.case_result import CaseResult

# TODO update the JSON string below
json = "{}"
# create an instance of CaseResult from a JSON string
case_result_instance = CaseResult.from_json(json)
# print the JSON string representation of the object
print(CaseResult.to_json())

# convert the object into a dict
case_result_dict = case_result_instance.to_dict()
# create an instance of CaseResult from a dict
case_result_from_dict = CaseResult.from_dict(case_result_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


