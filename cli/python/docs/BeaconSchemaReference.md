# BeaconSchemaReference


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**entity_type** | **str** |  | [optional] 
**var_schema** | **str** |  | [optional] 

## Example

```python
from radiant_python.models.beacon_schema_reference import BeaconSchemaReference

# TODO update the JSON string below
json = "{}"
# create an instance of BeaconSchemaReference from a JSON string
beacon_schema_reference_instance = BeaconSchemaReference.from_json(json)
# print the JSON string representation of the object
print(BeaconSchemaReference.to_json())

# convert the object into a dict
beacon_schema_reference_dict = beacon_schema_reference_instance.to_dict()
# create an instance of BeaconSchemaReference from a dict
beacon_schema_reference_from_dict = BeaconSchemaReference.from_dict(beacon_schema_reference_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


