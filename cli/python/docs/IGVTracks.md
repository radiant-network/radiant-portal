# IGVTracks


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**alignment** | [**List[IGVTrackEnriched]**](IGVTrackEnriched.md) |  | [optional] 

## Example

```python
from radiant_python.models.igv_tracks import IGVTracks

# TODO update the JSON string below
json = "{}"
# create an instance of IGVTracks from a JSON string
igv_tracks_instance = IGVTracks.from_json(json)
# print the JSON string representation of the object
print(IGVTracks.to_json())

# convert the object into a dict
igv_tracks_dict = igv_tracks_instance.to_dict()
# create an instance of IGVTracks from a dict
igv_tracks_from_dict = IGVTracks.from_dict(igv_tracks_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


