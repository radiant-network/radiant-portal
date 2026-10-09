# IGVPublicTrack


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**index_url** | **str** |  | 
**index_url_expire_at** | **int** |  | 
**url** | **str** |  | 
**url_expire_at** | **int** |  | 

## Example

```python
from radiant_python.models.igv_public_track import IGVPublicTrack

# TODO update the JSON string below
json = "{}"
# create an instance of IGVPublicTrack from a JSON string
igv_public_track_instance = IGVPublicTrack.from_json(json)
# print the JSON string representation of the object
print(IGVPublicTrack.to_json())

# convert the object into a dict
igv_public_track_dict = igv_public_track_instance.to_dict()
# create an instance of IGVPublicTrack from a dict
igv_public_track_from_dict = IGVPublicTrack.from_dict(igv_public_track_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


