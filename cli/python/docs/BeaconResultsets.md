# BeaconResultsets


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**result_sets** | [**List[BeaconResultSet]**](BeaconResultSet.md) |  | [optional] 

## Example

```python
from radiant_python.models.beacon_resultsets import BeaconResultsets

# TODO update the JSON string below
json = "{}"
# create an instance of BeaconResultsets from a JSON string
beacon_resultsets_instance = BeaconResultsets.from_json(json)
# print the JSON string representation of the object
print(BeaconResultsets.to_json())

# convert the object into a dict
beacon_resultsets_dict = beacon_resultsets_instance.to_dict()
# create an instance of BeaconResultsets from a dict
beacon_resultsets_from_dict = BeaconResultsets.from_dict(beacon_resultsets_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


