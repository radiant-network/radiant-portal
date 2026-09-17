# BeaconEndpointSet


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**entry_type** | **str** |  | [optional] 
**root_url** | **str** |  | [optional] 
**single_entry_url** | **str** |  | [optional] 

## Example

```python
from radiant_python.models.beacon_endpoint_set import BeaconEndpointSet

# TODO update the JSON string below
json = "{}"
# create an instance of BeaconEndpointSet from a JSON string
beacon_endpoint_set_instance = BeaconEndpointSet.from_json(json)
# print the JSON string representation of the object
print(BeaconEndpointSet.to_json())

# convert the object into a dict
beacon_endpoint_set_dict = beacon_endpoint_set_instance.to_dict()
# create an instance of BeaconEndpointSet from a dict
beacon_endpoint_set_from_dict = BeaconEndpointSet.from_dict(beacon_endpoint_set_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


