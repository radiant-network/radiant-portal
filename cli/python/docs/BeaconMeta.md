# BeaconMeta


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**api_version** | **str** |  | [optional] 
**beacon_id** | **str** |  | [optional] 
**received_request_summary** | [**BeaconReceivedRequestSummary**](BeaconReceivedRequestSummary.md) |  | [optional] 
**returned_granularity** | **str** |  | [optional] 
**returned_schemas** | [**List[BeaconSchemaReference]**](BeaconSchemaReference.md) |  | [optional] 

## Example

```python
from radiant_python.models.beacon_meta import BeaconMeta

# TODO update the JSON string below
json = "{}"
# create an instance of BeaconMeta from a JSON string
beacon_meta_instance = BeaconMeta.from_json(json)
# print the JSON string representation of the object
print(BeaconMeta.to_json())

# convert the object into a dict
beacon_meta_dict = beacon_meta_instance.to_dict()
# create an instance of BeaconMeta from a dict
beacon_meta_from_dict = BeaconMeta.from_dict(beacon_meta_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


