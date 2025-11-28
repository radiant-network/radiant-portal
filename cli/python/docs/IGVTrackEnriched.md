# IGVTrackEnriched


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**family_role** | **str** |  | [optional] 
**format** | **str** |  | [optional] 
**index_url** | **str** |  | [optional] 
**index_url_expire_at** | **int** |  | [optional] 
**name** | **str** |  | [optional] 
**patient_id** | **int** |  | [optional] 
**sex** | **str** |  | [optional] 
**type** | **str** |  | [optional] 
**url** | **str** |  | [optional] 
**url_expire_at** | **int** |  | [optional] 

## Example

```python
from openapi_client.models.igv_track_enriched import IGVTrackEnriched

# TODO update the JSON string below
json = "{}"
# create an instance of IGVTrackEnriched from a JSON string
igv_track_enriched_instance = IGVTrackEnriched.from_json(json)
# print the JSON string representation of the object
print(IGVTrackEnriched.to_json())

# convert the object into a dict
igv_track_enriched_dict = igv_track_enriched_instance.to_dict()
# create an instance of IGVTrackEnriched from a dict
igv_track_enriched_from_dict = IGVTrackEnriched.from_dict(igv_track_enriched_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


