# BeaconPagination


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**limit** | **int** |  | [optional] 
**skip** | **int** |  | [optional] 

## Example

```python
from radiant_python.models.beacon_pagination import BeaconPagination

# TODO update the JSON string below
json = "{}"
# create an instance of BeaconPagination from a JSON string
beacon_pagination_instance = BeaconPagination.from_json(json)
# print the JSON string representation of the object
print(BeaconPagination.to_json())

# convert the object into a dict
beacon_pagination_dict = beacon_pagination_instance.to_dict()
# create an instance of BeaconPagination from a dict
beacon_pagination_from_dict = BeaconPagination.from_dict(beacon_pagination_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


