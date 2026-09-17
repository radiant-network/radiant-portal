# BeaconError


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**error_code** | **int** |  | [optional] 
**error_message** | **str** |  | [optional] 

## Example

```python
from radiant_python.models.beacon_error import BeaconError

# TODO update the JSON string below
json = "{}"
# create an instance of BeaconError from a JSON string
beacon_error_instance = BeaconError.from_json(json)
# print the JSON string representation of the object
print(BeaconError.to_json())

# convert the object into a dict
beacon_error_dict = beacon_error_instance.to_dict()
# create an instance of BeaconError from a dict
beacon_error_from_dict = BeaconError.from_dict(beacon_error_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


