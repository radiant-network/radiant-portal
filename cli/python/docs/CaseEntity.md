# CaseEntity

Data for Case Entity Page

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**analysis_catalog_code** | **str** |  | [optional] 
**analysis_catalog_name** | **str** |  | [optional] 
**assays** | [**List[CaseAssay]**](CaseAssay.md) |  | 
**case_category_code** | **str** |  | 
**case_category_name** | **str** |  | 
**case_id** | **int** |  | 
**case_type** | **str** |  | [optional] 
**created_on** | **str** |  | 
**diagnosis_lab_code** | **str** |  | [optional] 
**diagnosis_lab_name** | **str** |  | [optional] 
**members** | [**List[CasePatientClinicalInformation]**](CasePatientClinicalInformation.md) |  | 
**note** | **str** |  | [optional] 
**ordering_organization_code** | **str** |  | [optional] 
**ordering_organization_name** | **str** |  | [optional] 
**panel_code** | **str** |  | [optional] 
**panel_name** | **str** |  | [optional] 
**prescriber** | **str** |  | [optional] 
**primary_condition_id** | **str** |  | [optional] 
**primary_condition_name** | **str** |  | [optional] 
**priority_code** | **str** |  | [optional] 
**project_code** | **str** |  | [optional] 
**project_name** | **str** |  | [optional] 
**status_code** | **str** |  | 
**tasks** | [**List[CaseTask]**](CaseTask.md) |  | 
**updated_on** | **str** |  | 

## Example

```python
from radiant_python.models.case_entity import CaseEntity

# TODO update the JSON string below
json = "{}"
# create an instance of CaseEntity from a JSON string
case_entity_instance = CaseEntity.from_json(json)
# print the JSON string representation of the object
print(CaseEntity.to_json())

# convert the object into a dict
case_entity_dict = case_entity_instance.to_dict()
# create an instance of CaseEntity from a dict
case_entity_from_dict = CaseEntity.from_dict(case_entity_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


