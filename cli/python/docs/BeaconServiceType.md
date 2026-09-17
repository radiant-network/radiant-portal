# BeaconServiceType


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**artifact** | **str** |  | [optional] 
**group** | **str** |  | [optional] 
**version** | **str** |  | [optional] 

## Example

```python
from radiant_python.models.beacon_service_type import BeaconServiceType

# TODO update the JSON string below
json = "{}"
# create an instance of BeaconServiceType from a JSON string
beacon_service_type_instance = BeaconServiceType.from_json(json)
# print the JSON string representation of the object
print(BeaconServiceType.to_json())

# convert the object into a dict
beacon_service_type_dict = beacon_service_type_instance.to_dict()
# create an instance of BeaconServiceType from a dict
beacon_service_type_from_dict = BeaconServiceType.from_dict(beacon_service_type_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


