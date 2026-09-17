# BeaconSchemaDef


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **str** |  | [optional] 
**name** | **str** |  | [optional] 
**reference_to_schema_definition** | **str** |  | [optional] 
**schema_version** | **str** |  | [optional] 

## Example

```python
from radiant_python.models.beacon_schema_def import BeaconSchemaDef

# TODO update the JSON string below
json = "{}"
# create an instance of BeaconSchemaDef from a JSON string
beacon_schema_def_instance = BeaconSchemaDef.from_json(json)
# print the JSON string representation of the object
print(BeaconSchemaDef.to_json())

# convert the object into a dict
beacon_schema_def_dict = beacon_schema_def_instance.to_dict()
# create an instance of BeaconSchemaDef from a dict
beacon_schema_def_from_dict = BeaconSchemaDef.from_dict(beacon_schema_def_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


