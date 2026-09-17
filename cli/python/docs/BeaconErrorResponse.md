# BeaconErrorResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**error** | [**BeaconError**](BeaconError.md) |  | [optional] 
**meta** | [**BeaconMeta**](BeaconMeta.md) |  | [optional] 

## Example

```python
from radiant_python.models.beacon_error_response import BeaconErrorResponse

# TODO update the JSON string below
json = "{}"
# create an instance of BeaconErrorResponse from a JSON string
beacon_error_response_instance = BeaconErrorResponse.from_json(json)
# print the JSON string representation of the object
print(BeaconErrorResponse.to_json())

# convert the object into a dict
beacon_error_response_dict = beacon_error_response_instance.to_dict()
# create an instance of BeaconErrorResponse from a dict
beacon_error_response_from_dict = BeaconErrorResponse.from_dict(beacon_error_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


