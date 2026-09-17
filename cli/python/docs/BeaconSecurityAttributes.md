# BeaconSecurityAttributes


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**default_granularity** | **str** |  | [optional] 
**description** | **str** |  | [optional] 
**security_levels** | **List[str]** |  | [optional] 

## Example

```python
from radiant_python.models.beacon_security_attributes import BeaconSecurityAttributes

# TODO update the JSON string below
json = "{}"
# create an instance of BeaconSecurityAttributes from a JSON string
beacon_security_attributes_instance = BeaconSecurityAttributes.from_json(json)
# print the JSON string representation of the object
print(BeaconSecurityAttributes.to_json())

# convert the object into a dict
beacon_security_attributes_dict = beacon_security_attributes_instance.to_dict()
# create an instance of BeaconSecurityAttributes from a dict
beacon_security_attributes_from_dict = BeaconSecurityAttributes.from_dict(beacon_security_attributes_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


