# BeaconOrganization


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**address** | **str** |  | [optional] 
**contact_url** | **str** |  | [optional] 
**description** | **str** |  | [optional] 
**id** | **str** |  | [optional] 
**logo_url** | **str** |  | [optional] 
**name** | **str** |  | [optional] 
**welcome_url** | **str** |  | [optional] 

## Example

```python
from radiant_python.models.beacon_organization import BeaconOrganization

# TODO update the JSON string below
json = "{}"
# create an instance of BeaconOrganization from a JSON string
beacon_organization_instance = BeaconOrganization.from_json(json)
# print the JSON string representation of the object
print(BeaconOrganization.to_json())

# convert the object into a dict
beacon_organization_dict = beacon_organization_instance.to_dict()
# create an instance of BeaconOrganization from a dict
beacon_organization_from_dict = BeaconOrganization.from_dict(beacon_organization_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


