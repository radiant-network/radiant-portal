# BeaconServiceOrganization


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **str** |  | [optional] 
**url** | **str** |  | [optional] 

## Example

```python
from radiant_python.models.beacon_service_organization import BeaconServiceOrganization

# TODO update the JSON string below
json = "{}"
# create an instance of BeaconServiceOrganization from a JSON string
beacon_service_organization_instance = BeaconServiceOrganization.from_json(json)
# print the JSON string representation of the object
print(BeaconServiceOrganization.to_json())

# convert the object into a dict
beacon_service_organization_dict = beacon_service_organization_instance.to_dict()
# create an instance of BeaconServiceOrganization from a dict
beacon_service_organization_from_dict = BeaconServiceOrganization.from_dict(beacon_service_organization_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


