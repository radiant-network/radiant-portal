# BeaconConfigurationResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**meta** | [**BeaconMeta**](BeaconMeta.md) |  | [optional] 
**response** | [**BeaconConfiguration**](BeaconConfiguration.md) |  | [optional] 

## Example

```python
from radiant_python.models.beacon_configuration_response import BeaconConfigurationResponse

# TODO update the JSON string below
json = "{}"
# create an instance of BeaconConfigurationResponse from a JSON string
beacon_configuration_response_instance = BeaconConfigurationResponse.from_json(json)
# print the JSON string representation of the object
print(BeaconConfigurationResponse.to_json())

# convert the object into a dict
beacon_configuration_response_dict = beacon_configuration_response_instance.to_dict()
# create an instance of BeaconConfigurationResponse from a dict
beacon_configuration_response_from_dict = BeaconConfigurationResponse.from_dict(beacon_configuration_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


