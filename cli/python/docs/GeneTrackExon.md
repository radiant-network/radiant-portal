# GeneTrackExon


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**end** | **int** |  | 
**start** | **int** |  | 

## Example

```python
from radiant_python.models.gene_track_exon import GeneTrackExon

# TODO update the JSON string below
json = "{}"
# create an instance of GeneTrackExon from a JSON string
gene_track_exon_instance = GeneTrackExon.from_json(json)
# print the JSON string representation of the object
print(GeneTrackExon.to_json())

# convert the object into a dict
gene_track_exon_dict = gene_track_exon_instance.to_dict()
# create an instance of GeneTrackExon from a dict
gene_track_exon_from_dict = GeneTrackExon.from_dict(gene_track_exon_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


