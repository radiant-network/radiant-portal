# InterpretationPubmed


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**citation** | **str** |  | [optional] 
**citation_id** | **str** |  | [optional] 

## Example

```python
from radiant_python.models.interpretation_pubmed import InterpretationPubmed

# TODO update the JSON string below
json = "{}"
# create an instance of InterpretationPubmed from a JSON string
interpretation_pubmed_instance = InterpretationPubmed.from_json(json)
# print the JSON string representation of the object
print(InterpretationPubmed.to_json())

# convert the object into a dict
interpretation_pubmed_dict = interpretation_pubmed_instance.to_dict()
# create an instance of InterpretationPubmed from a dict
interpretation_pubmed_from_dict = InterpretationPubmed.from_dict(interpretation_pubmed_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


