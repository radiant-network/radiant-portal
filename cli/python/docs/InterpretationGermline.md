# InterpretationGermline


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**case_id** | **str** |  | [optional] 
**classification** | **str** |  | [optional] 
**classification_criterias** | **List[str]** |  | [optional] 
**condition** | **str** |  | [optional] 
**condition_name** | **str** |  | [optional] 
**created_at** | **str** |  | [optional] 
**created_by** | **str** |  | [optional] 
**created_by_name** | **str** |  | [optional] 
**id** | **str** |  | [optional] 
**interpretation** | **str** |  | [optional] 
**locus_id** | **str** |  | [optional] 
**metadata** | [**InterpretationMetadata**](InterpretationMetadata.md) |  | [optional] 
**pubmed** | [**List[InterpretationPubmed]**](InterpretationPubmed.md) |  | [optional] 
**sequencing_id** | **str** |  | [optional] 
**transcript_id** | **str** |  | [optional] 
**transmission_modes** | **List[str]** |  | [optional] 
**updated_at** | **str** |  | [optional] 
**updated_by** | **str** |  | [optional] 
**updated_by_name** | **str** |  | [optional] 

## Example

```python
from radiant_python.models.interpretation_germline import InterpretationGermline

# TODO update the JSON string below
json = "{}"
# create an instance of InterpretationGermline from a JSON string
interpretation_germline_instance = InterpretationGermline.from_json(json)
# print the JSON string representation of the object
print(InterpretationGermline.to_json())

# convert the object into a dict
interpretation_germline_dict = interpretation_germline_instance.to_dict()
# create an instance of InterpretationGermline from a dict
interpretation_germline_from_dict = InterpretationGermline.from_dict(interpretation_germline_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


