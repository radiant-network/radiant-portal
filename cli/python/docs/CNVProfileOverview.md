# CNVProfileOverview

Overview is set when the copy ratio and BAF are reduced, for a genome: the points of a region come from the region endpoint.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**baf_stride** | **int** |  | 
**copy_ratio_stride** | **int** |  | 
**region_max_span** | **int** |  | 

## Example

```python
from radiant_python.models.cnv_profile_overview import CNVProfileOverview

# TODO update the JSON string below
json = "{}"
# create an instance of CNVProfileOverview from a JSON string
cnv_profile_overview_instance = CNVProfileOverview.from_json(json)
# print the JSON string representation of the object
print(CNVProfileOverview.to_json())

# convert the object into a dict
cnv_profile_overview_dict = cnv_profile_overview_instance.to_dict()
# create an instance of CNVProfileOverview from a dict
cnv_profile_overview_from_dict = CNVProfileOverview.from_dict(cnv_profile_overview_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


