# BeaconEntryTypes


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**var_schema** | **str** |  | [optional] 
**entry_types** | [**Dict[str, BeaconEntryType]**](BeaconEntryType.md) |  | [optional] 

## Example

```python
from radiant_python.models.beacon_entry_types import BeaconEntryTypes

# TODO update the JSON string below
json = "{}"
# create an instance of BeaconEntryTypes from a JSON string
beacon_entry_types_instance = BeaconEntryTypes.from_json(json)
# print the JSON string representation of the object
print(BeaconEntryTypes.to_json())

# convert the object into a dict
beacon_entry_types_dict = beacon_entry_types_instance.to_dict()
# create an instance of BeaconEntryTypes from a dict
beacon_entry_types_from_dict = BeaconEntryTypes.from_dict(beacon_entry_types_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


