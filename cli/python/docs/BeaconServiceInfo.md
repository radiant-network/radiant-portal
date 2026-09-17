# BeaconServiceInfo


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**contact_url** | **str** |  | [optional] 
**description** | **str** |  | [optional] 
**documentation_url** | **str** |  | [optional] 
**environment** | **str** |  | [optional] 
**id** | **str** |  | [optional] 
**name** | **str** |  | [optional] 
**organization** | [**BeaconServiceOrganization**](BeaconServiceOrganization.md) |  | [optional] 
**type** | [**BeaconServiceType**](BeaconServiceType.md) |  | [optional] 
**version** | **str** |  | [optional] 

## Example

```python
from radiant_python.models.beacon_service_info import BeaconServiceInfo

# TODO update the JSON string below
json = "{}"
# create an instance of BeaconServiceInfo from a JSON string
beacon_service_info_instance = BeaconServiceInfo.from_json(json)
# print the JSON string representation of the object
print(BeaconServiceInfo.to_json())

# convert the object into a dict
beacon_service_info_dict = beacon_service_info_instance.to_dict()
# create an instance of BeaconServiceInfo from a dict
beacon_service_info_from_dict = BeaconServiceInfo.from_dict(beacon_service_info_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


