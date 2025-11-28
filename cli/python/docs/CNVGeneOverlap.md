# CNVGeneOverlap

CNVGeneOverlap represents a gene overlap with a CNV

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**cytoband** | **List[str]** |  | 
**gene_id** | **str** |  | 
**gene_length** | **int** |  | 
**nb_exons** | **int** |  | 
**nb_overlap_bases** | **int** |  | 
**overlap_type** | **str** |  | 
**overlapping_cnv_percent** | **float** |  | 
**overlapping_gene_percent** | **float** |  | 
**symbol** | **str** |  | 

## Example

```python
from openapi_client.models.cnv_gene_overlap import CNVGeneOverlap

# TODO update the JSON string below
json = "{}"
# create an instance of CNVGeneOverlap from a JSON string
cnv_gene_overlap_instance = CNVGeneOverlap.from_json(json)
# print the JSON string representation of the object
print(CNVGeneOverlap.to_json())

# convert the object into a dict
cnv_gene_overlap_dict = cnv_gene_overlap_instance.to_dict()
# create an instance of CNVGeneOverlap from a dict
cnv_gene_overlap_from_dict = CNVGeneOverlap.from_dict(cnv_gene_overlap_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


