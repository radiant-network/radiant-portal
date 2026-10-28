# CNVProfile

CNVProfile holds the copy ratio and B-allele frequency points, the called CNVs, the regions of homozygosity and the cytobands of a sequencing

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**baf** | [**List[CNVProfileTrack]**](CNVProfileTrack.md) |  | 
**chromosomes** | [**List[CNVProfileChromosome]**](CNVProfileChromosome.md) |  | 
**copy_ratio** | [**List[CNVProfileTrack]**](CNVProfileTrack.md) |  | 
**cytobands** | [**List[Cytoband]**](Cytoband.md) |  | 
**overview** | [**CNVProfileOverview**](CNVProfileOverview.md) |  | [optional] 
**roh** | [**List[CNVProfileROH]**](CNVProfileROH.md) |  | 
**segments** | [**List[CNVProfileSegment]**](CNVProfileSegment.md) |  | 

## Example

```python
from radiant_python.models.cnv_profile import CNVProfile

# TODO update the JSON string below
json = "{}"
# create an instance of CNVProfile from a JSON string
cnv_profile_instance = CNVProfile.from_json(json)
# print the JSON string representation of the object
print(CNVProfile.to_json())

# convert the object into a dict
cnv_profile_dict = cnv_profile_instance.to_dict()
# create an instance of CNVProfile from a dict
cnv_profile_from_dict = CNVProfile.from_dict(cnv_profile_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


