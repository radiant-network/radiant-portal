# CNVProfileTrack

CNVProfileTrack holds the points of one chromosome as two parallel arrays: the 0-based positions and their values

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**chromosome** | **str** |  | 
**positions** | **List[int]** |  | 
**values** | **List[float]** |  | 

## Example

```python
from radiant_python.models.cnv_profile_track import CNVProfileTrack

# TODO update the JSON string below
json = "{}"
# create an instance of CNVProfileTrack from a JSON string
cnv_profile_track_instance = CNVProfileTrack.from_json(json)
# print the JSON string representation of the object
print(CNVProfileTrack.to_json())

# convert the object into a dict
cnv_profile_track_dict = cnv_profile_track_instance.to_dict()
# create an instance of CNVProfileTrack from a dict
cnv_profile_track_from_dict = CNVProfileTrack.from_dict(cnv_profile_track_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


