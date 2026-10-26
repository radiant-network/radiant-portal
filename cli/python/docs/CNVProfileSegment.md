# CNVProfileSegment


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**chromosome** | **str** |  | 
**cn** | **int** |  | [optional] 
**cnv_id** | **str** |  | 
**end** | **int** |  | 
**filter** | **str** |  | [optional] 
**length** | **int** |  | 
**quality** | **float** |  | [optional] 
**sm** | **float** |  | [optional] 
**start** | **int** |  | 
**type** | **str** |  | 

## Example

```python
from radiant_python.models.cnv_profile_segment import CNVProfileSegment

# TODO update the JSON string below
json = "{}"
# create an instance of CNVProfileSegment from a JSON string
cnv_profile_segment_instance = CNVProfileSegment.from_json(json)
# print the JSON string representation of the object
print(CNVProfileSegment.to_json())

# convert the object into a dict
cnv_profile_segment_dict = cnv_profile_segment_instance.to_dict()
# create an instance of CNVProfileSegment from a dict
cnv_profile_segment_from_dict = CNVProfileSegment.from_dict(cnv_profile_segment_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


