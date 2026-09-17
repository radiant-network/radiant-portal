# BeaconConfiguration


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**var_schema** | **str** |  | [optional] 
**entry_types** | [**Dict[str, BeaconEntryType]**](BeaconEntryType.md) |  | [optional] 
**maturity_attributes** | [**BeaconMaturityAttributes**](BeaconMaturityAttributes.md) |  | [optional] 
**security_attributes** | [**BeaconSecurityAttributes**](BeaconSecurityAttributes.md) |  | [optional] 

## Example

```python
from radiant_python.models.beacon_configuration import BeaconConfiguration

# TODO update the JSON string below
json = "{}"
# create an instance of BeaconConfiguration from a JSON string
beacon_configuration_instance = BeaconConfiguration.from_json(json)
# print the JSON string representation of the object
print(BeaconConfiguration.to_json())

# convert the object into a dict
beacon_configuration_dict = beacon_configuration_instance.to_dict()
# create an instance of BeaconConfiguration from a dict
beacon_configuration_from_dict = BeaconConfiguration.from_dict(beacon_configuration_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


