# BeaconMapResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**meta** | [**BeaconMeta**](BeaconMeta.md) |  | [optional] 
**response** | [**BeaconEndpointMap**](BeaconEndpointMap.md) |  | [optional] 

## Example

```python
from radiant_python.models.beacon_map_response import BeaconMapResponse

# TODO update the JSON string below
json = "{}"
# create an instance of BeaconMapResponse from a JSON string
beacon_map_response_instance = BeaconMapResponse.from_json(json)
# print the JSON string representation of the object
print(BeaconMapResponse.to_json())

# convert the object into a dict
beacon_map_response_dict = beacon_map_response_instance.to_dict()
# create an instance of BeaconMapResponse from a dict
beacon_map_response_from_dict = BeaconMapResponse.from_dict(beacon_map_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


