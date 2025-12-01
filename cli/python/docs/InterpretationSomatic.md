# InterpretationSomatic


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**case_id** | **str** |  | [optional] 
**clinical_utility** | **str** |  | [optional] 
**created_at** | **str** |  | [optional] 
**created_by** | **str** |  | [optional] 
**created_by_name** | **str** |  | [optional] 
**id** | **str** |  | [optional] 
**interpretation** | **str** |  | [optional] 
**locus_id** | **str** |  | [optional] 
**metadata** | [**InterpretationMetadata**](InterpretationMetadata.md) |  | [optional] 
**oncogenicity** | **str** |  | [optional] 
**oncogenicity_classification_criterias** | **List[str]** |  | [optional] 
**pubmed** | [**List[InterpretationPubmed]**](InterpretationPubmed.md) |  | [optional] 
**sequencing_id** | **str** |  | [optional] 
**transcript_id** | **str** |  | [optional] 
**tumoral_type** | **str** |  | [optional] 
**updated_at** | **str** |  | [optional] 
**updated_by** | **str** |  | [optional] 
**updated_by_name** | **str** |  | [optional] 

## Example

```python
from radiant_python.models.interpretation_somatic import InterpretationSomatic

# TODO update the JSON string below
json = "{}"
# create an instance of InterpretationSomatic from a JSON string
interpretation_somatic_instance = InterpretationSomatic.from_json(json)
# print the JSON string representation of the object
print(InterpretationSomatic.to_json())

# convert the object into a dict
interpretation_somatic_dict = interpretation_somatic_instance.to_dict()
# create an instance of InterpretationSomatic from a dict
interpretation_somatic_from_dict = InterpretationSomatic.from_dict(interpretation_somatic_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


