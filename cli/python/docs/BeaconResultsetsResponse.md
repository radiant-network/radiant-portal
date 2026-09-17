# BeaconResultsetsResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**meta** | [**BeaconMeta**](BeaconMeta.md) |  | [optional] 
**response** | [**BeaconResultsets**](BeaconResultsets.md) |  | [optional] 
**response_summary** | [**BeaconResponseSummary**](BeaconResponseSummary.md) |  | [optional] 

## Example

```python
from radiant_python.models.beacon_resultsets_response import BeaconResultsetsResponse

# TODO update the JSON string below
json = "{}"
# create an instance of BeaconResultsetsResponse from a JSON string
beacon_resultsets_response_instance = BeaconResultsetsResponse.from_json(json)
# print the JSON string representation of the object
print(BeaconResultsetsResponse.to_json())

# convert the object into a dict
beacon_resultsets_response_dict = beacon_resultsets_response_instance.to_dict()
# create an instance of BeaconResultsetsResponse from a dict
beacon_resultsets_response_from_dict = BeaconResultsetsResponse.from_dict(beacon_resultsets_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


