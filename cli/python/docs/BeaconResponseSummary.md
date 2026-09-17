# BeaconResponseSummary


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**exists** | **bool** |  | [optional] 
**num_total_results** | **int** |  | [optional] 

## Example

```python
from radiant_python.models.beacon_response_summary import BeaconResponseSummary

# TODO update the JSON string below
json = "{}"
# create an instance of BeaconResponseSummary from a JSON string
beacon_response_summary_instance = BeaconResponseSummary.from_json(json)
# print the JSON string representation of the object
print(BeaconResponseSummary.to_json())

# convert the object into a dict
beacon_response_summary_dict = beacon_response_summary_instance.to_dict()
# create an instance of BeaconResponseSummary from a dict
beacon_response_summary_from_dict = BeaconResponseSummary.from_dict(beacon_response_summary_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


