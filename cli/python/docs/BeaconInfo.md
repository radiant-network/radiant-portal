# BeaconInfo


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**alternative_url** | **str** |  | [optional] 
**api_version** | **str** |  | [optional] 
**description** | **str** |  | [optional] 
**environment** | **str** |  | [optional] 
**id** | **str** |  | [optional] 
**info** | **Dict[str, object]** |  | [optional] 
**name** | **str** |  | [optional] 
**organization** | [**BeaconOrganization**](BeaconOrganization.md) |  | [optional] 
**version** | **str** |  | [optional] 
**welcome_url** | **str** |  | [optional] 

## Example

```python
from radiant_python.models.beacon_info import BeaconInfo

# TODO update the JSON string below
json = "{}"
# create an instance of BeaconInfo from a JSON string
beacon_info_instance = BeaconInfo.from_json(json)
# print the JSON string representation of the object
print(BeaconInfo.to_json())

# convert the object into a dict
beacon_info_dict = beacon_info_instance.to_dict()
# create an instance of BeaconInfo from a dict
beacon_info_from_dict = BeaconInfo.from_dict(beacon_info_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


