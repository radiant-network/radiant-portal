# BeaconOntologyTerm


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **str** |  | [optional] 
**label** | **str** |  | [optional] 

## Example

```python
from radiant_python.models.beacon_ontology_term import BeaconOntologyTerm

# TODO update the JSON string below
json = "{}"
# create an instance of BeaconOntologyTerm from a JSON string
beacon_ontology_term_instance = BeaconOntologyTerm.from_json(json)
# print the JSON string representation of the object
print(BeaconOntologyTerm.to_json())

# convert the object into a dict
beacon_ontology_term_dict = beacon_ontology_term_instance.to_dict()
# create an instance of BeaconOntologyTerm from a dict
beacon_ontology_term_from_dict = BeaconOntologyTerm.from_dict(beacon_ontology_term_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


