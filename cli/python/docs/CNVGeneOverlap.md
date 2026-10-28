# CNVGeneOverlap

CNVGeneOverlap represents a gene overlap with a CNV

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**biotype** | **str** |  | [optional] 
**cytoband** | **List[str]** |  | 
**gene_id** | **str** |  | 
**gene_length** | **int** |  | 
**gnomad_loeuf** | **float** | GnomadLoeuf is the lowest gnomAD LOEUF over the Ensembl transcripts of the gene | [optional] 
**gnomad_pli** | **float** | GnomadPli is the highest gnomAD pLI over the Ensembl transcripts of the gene | [optional] 
**nb_exons** | **int** | NbExons counts the exons the CNV hits, merged over the transcripts of the gene | 
**nb_overlap_bases** | **int** |  | 
**omim_inheritance_code** | **List[str]** | OmimInheritanceCode lists the OMIM inheritance modes of the phenotypes of the gene | [optional] 
**overlap_type** | **str** |  | 
**overlapping_cnv_percent** | **float** |  | 
**overlapping_gene_percent** | **float** |  | 
**strand** | **str** |  | [optional] 
**symbol** | **str** |  | 
**tenant_gene_panels** | **List[str]** |  | 

## Example

```python
from radiant_python.models.cnv_gene_overlap import CNVGeneOverlap

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


