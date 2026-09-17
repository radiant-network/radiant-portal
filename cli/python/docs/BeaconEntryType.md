# BeaconEntryType


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**default_schema** | [**BeaconSchemaDef**](BeaconSchemaDef.md) |  | [optional] 
**description** | **str** |  | [optional] 
**id** | **str** |  | [optional] 
**name** | **str** |  | [optional] 
**non_filtered_queries_allowed** | **bool** |  | [optional] 
**ontology_term_for_this_type** | [**BeaconOntologyTerm**](BeaconOntologyTerm.md) |  | [optional] 
**part_of_specification** | **str** |  | [optional] 

## Example

```python
from radiant_python.models.beacon_entry_type import BeaconEntryType

# TODO update the JSON string below
json = "{}"
# create an instance of BeaconEntryType from a JSON string
beacon_entry_type_instance = BeaconEntryType.from_json(json)
# print the JSON string representation of the object
print(BeaconEntryType.to_json())

# convert the object into a dict
beacon_entry_type_dict = beacon_entry_type_instance.to_dict()
# create an instance of BeaconEntryType from a dict
beacon_entry_type_from_dict = BeaconEntryType.from_dict(beacon_entry_type_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


