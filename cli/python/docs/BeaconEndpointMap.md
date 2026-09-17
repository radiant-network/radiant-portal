# BeaconEndpointMap


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**var_schema** | **str** |  | [optional] 
**endpoint_sets** | [**Dict[str, BeaconEndpointSet]**](BeaconEndpointSet.md) |  | [optional] 

## Example

```python
from radiant_python.models.beacon_endpoint_map import BeaconEndpointMap

# TODO update the JSON string below
json = "{}"
# create an instance of BeaconEndpointMap from a JSON string
beacon_endpoint_map_instance = BeaconEndpointMap.from_json(json)
# print the JSON string representation of the object
print(BeaconEndpointMap.to_json())

# convert the object into a dict
beacon_endpoint_map_dict = beacon_endpoint_map_instance.to_dict()
# create an instance of BeaconEndpointMap from a dict
beacon_endpoint_map_from_dict = BeaconEndpointMap.from_dict(beacon_endpoint_map_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


