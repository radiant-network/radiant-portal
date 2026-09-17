# BeaconFilteringTerms


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**var_schema** | **str** |  | [optional] 
**filtering_terms** | **List[Dict[str, object]]** |  | [optional] 
**resources** | **List[Dict[str, object]]** |  | [optional] 

## Example

```python
from radiant_python.models.beacon_filtering_terms import BeaconFilteringTerms

# TODO update the JSON string below
json = "{}"
# create an instance of BeaconFilteringTerms from a JSON string
beacon_filtering_terms_instance = BeaconFilteringTerms.from_json(json)
# print the JSON string representation of the object
print(BeaconFilteringTerms.to_json())

# convert the object into a dict
beacon_filtering_terms_dict = beacon_filtering_terms_instance.to_dict()
# create an instance of BeaconFilteringTerms from a dict
beacon_filtering_terms_from_dict = BeaconFilteringTerms.from_dict(beacon_filtering_terms_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


