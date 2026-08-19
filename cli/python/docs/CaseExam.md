# CaseExam

Paraclinical exam observation to display in Case Entity

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**coding_system** | **str** |  | [optional] 
**exam_code** | **str** |  | 
**interpretation_code** | **str** |  | [optional] 
**name** | **str** |  | [optional] 
**value** | **str** |  | [optional] 
**value_name** | **str** |  | [optional] 

## Example

```python
from radiant_python.models.case_exam import CaseExam

# TODO update the JSON string below
json = "{}"
# create an instance of CaseExam from a JSON string
case_exam_instance = CaseExam.from_json(json)
# print the JSON string representation of the object
print(CaseExam.to_json())

# convert the object into a dict
case_exam_dict = case_exam_instance.to_dict()
# create an instance of CaseExam from a dict
case_exam_from_dict = CaseExam.from_dict(case_exam_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


