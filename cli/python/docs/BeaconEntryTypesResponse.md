# BeaconEntryTypesResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**meta** | [**BeaconMeta**](BeaconMeta.md) |  | [optional] 
**response** | [**BeaconEntryTypes**](BeaconEntryTypes.md) |  | [optional] 

## Example

```python
from radiant_python.models.beacon_entry_types_response import BeaconEntryTypesResponse

# TODO update the JSON string below
json = "{}"
# create an instance of BeaconEntryTypesResponse from a JSON string
beacon_entry_types_response_instance = BeaconEntryTypesResponse.from_json(json)
# print the JSON string representation of the object
print(BeaconEntryTypesResponse.to_json())

# convert the object into a dict
beacon_entry_types_response_dict = beacon_entry_types_response_instance.to_dict()
# create an instance of BeaconEntryTypesResponse from a dict
beacon_entry_types_response_from_dict = BeaconEntryTypesResponse.from_dict(beacon_entry_types_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


