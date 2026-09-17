# BeaconInfoResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**meta** | [**BeaconMeta**](BeaconMeta.md) |  | [optional] 
**response** | [**BeaconInfo**](BeaconInfo.md) |  | [optional] 

## Example

```python
from radiant_python.models.beacon_info_response import BeaconInfoResponse

# TODO update the JSON string below
json = "{}"
# create an instance of BeaconInfoResponse from a JSON string
beacon_info_response_instance = BeaconInfoResponse.from_json(json)
# print the JSON string representation of the object
print(BeaconInfoResponse.to_json())

# convert the object into a dict
beacon_info_response_dict = beacon_info_response_instance.to_dict()
# create an instance of BeaconInfoResponse from a dict
beacon_info_response_from_dict = BeaconInfoResponse.from_dict(beacon_info_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


