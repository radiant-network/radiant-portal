# BeaconFilteringTermsResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**meta** | [**BeaconMeta**](BeaconMeta.md) |  | [optional] 
**response** | [**BeaconFilteringTerms**](BeaconFilteringTerms.md) |  | [optional] 

## Example

```python
from radiant_python.models.beacon_filtering_terms_response import BeaconFilteringTermsResponse

# TODO update the JSON string below
json = "{}"
# create an instance of BeaconFilteringTermsResponse from a JSON string
beacon_filtering_terms_response_instance = BeaconFilteringTermsResponse.from_json(json)
# print the JSON string representation of the object
print(BeaconFilteringTermsResponse.to_json())

# convert the object into a dict
beacon_filtering_terms_response_dict = beacon_filtering_terms_response_instance.to_dict()
# create an instance of BeaconFilteringTermsResponse from a dict
beacon_filtering_terms_response_from_dict = BeaconFilteringTermsResponse.from_dict(beacon_filtering_terms_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


