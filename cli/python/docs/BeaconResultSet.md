# BeaconResultSet


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**exists** | **bool** |  | [optional] 
**id** | **str** |  | [optional] 
**results** | **List[object]** |  | [optional] 
**results_count** | **int** |  | [optional] 
**set_type** | **str** |  | [optional] 

## Example

```python
from radiant_python.models.beacon_result_set import BeaconResultSet

# TODO update the JSON string below
json = "{}"
# create an instance of BeaconResultSet from a JSON string
beacon_result_set_instance = BeaconResultSet.from_json(json)
# print the JSON string representation of the object
print(BeaconResultSet.to_json())

# convert the object into a dict
beacon_result_set_dict = beacon_result_set_instance.to_dict()
# create an instance of BeaconResultSet from a dict
beacon_result_set_from_dict = BeaconResultSet.from_dict(beacon_result_set_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


