# BeaconReceivedRequestSummary


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**api_version** | **str** |  | [optional] 
**filters** | **List[str]** |  | [optional] 
**include_resultset_responses** | **str** |  | [optional] 
**pagination** | [**BeaconPagination**](BeaconPagination.md) |  | [optional] 
**request_parameters** | **Dict[str, object]** |  | [optional] 
**requested_granularity** | **str** |  | [optional] 
**requested_schemas** | [**List[BeaconSchemaReference]**](BeaconSchemaReference.md) |  | [optional] 
**test_mode** | **bool** |  | [optional] 

## Example

```python
from radiant_python.models.beacon_received_request_summary import BeaconReceivedRequestSummary

# TODO update the JSON string below
json = "{}"
# create an instance of BeaconReceivedRequestSummary from a JSON string
beacon_received_request_summary_instance = BeaconReceivedRequestSummary.from_json(json)
# print the JSON string representation of the object
print(BeaconReceivedRequestSummary.to_json())

# convert the object into a dict
beacon_received_request_summary_dict = beacon_received_request_summary_instance.to_dict()
# create an instance of BeaconReceivedRequestSummary from a dict
beacon_received_request_summary_from_dict = BeaconReceivedRequestSummary.from_dict(beacon_received_request_summary_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


