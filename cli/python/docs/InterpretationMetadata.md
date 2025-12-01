# InterpretationMetadata


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**analysis_id** | **str** |  | [optional] 
**patient_id** | **str** |  | [optional] 
**variant_hash** | **str** |  | [optional] 

## Example

```python
from radiant_python.models.interpretation_metadata import InterpretationMetadata

# TODO update the JSON string below
json = "{}"
# create an instance of InterpretationMetadata from a JSON string
interpretation_metadata_instance = InterpretationMetadata.from_json(json)
# print the JSON string representation of the object
print(InterpretationMetadata.to_json())

# convert the object into a dict
interpretation_metadata_dict = interpretation_metadata_instance.to_dict()
# create an instance of InterpretationMetadata from a dict
interpretation_metadata_from_dict = InterpretationMetadata.from_dict(interpretation_metadata_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


