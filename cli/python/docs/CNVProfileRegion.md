# CNVProfileRegion

CNVProfileRegion holds every copy ratio and BAF point of a region of one chromosome

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**baf** | [**CNVProfileTrack**](CNVProfileTrack.md) |  | 
**chromosome** | **str** |  | 
**copy_ratio** | [**CNVProfileTrack**](CNVProfileTrack.md) |  | 
**end** | **int** |  | 
**start** | **int** |  | 

## Example

```python
from radiant_python.models.cnv_profile_region import CNVProfileRegion

# TODO update the JSON string below
json = "{}"
# create an instance of CNVProfileRegion from a JSON string
cnv_profile_region_instance = CNVProfileRegion.from_json(json)
# print the JSON string representation of the object
print(CNVProfileRegion.to_json())

# convert the object into a dict
cnv_profile_region_dict = cnv_profile_region_instance.to_dict()
# create an instance of CNVProfileRegion from a dict
cnv_profile_region_from_dict = CNVProfileRegion.from_dict(cnv_profile_region_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


