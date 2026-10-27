# GeneTrackGene

GeneTrackGene is a gene of the gene track, with its exons merged over all its transcripts

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**biotype** | **str** |  | [optional] 
**chromosome** | **str** |  | 
**description** | **str** |  | [optional] 
**end** | **int** |  | 
**exons** | [**List[GeneTrackExon]**](GeneTrackExon.md) |  | 
**gene_id** | **str** |  | 
**gnomad_loeuf** | **float** | GnomadLoeuf is the lowest gnomAD LOEUF over the Ensembl transcripts of the gene | [optional] 
**gnomad_pli** | **float** | GnomadPli is the highest gnomAD pLI over the Ensembl transcripts of the gene | [optional] 
**omim_conditions** | [**List[OmimGenePanel]**](OmimGenePanel.md) | OmimConditions lists the OMIM phenotypes of the gene, with their inheritance modes | [optional] 
**omim_inheritance_code** | **List[str]** | OmimInheritanceCode lists the OMIM inheritance modes of the phenotypes of the gene | [optional] 
**start** | **int** |  | 
**strand** | **str** |  | [optional] 
**symbol** | **str** |  | 

## Example

```python
from radiant_python.models.gene_track_gene import GeneTrackGene

# TODO update the JSON string below
json = "{}"
# create an instance of GeneTrackGene from a JSON string
gene_track_gene_instance = GeneTrackGene.from_json(json)
# print the JSON string representation of the object
print(GeneTrackGene.to_json())

# convert the object into a dict
gene_track_gene_dict = gene_track_gene_instance.to_dict()
# create an instance of GeneTrackGene from a dict
gene_track_gene_from_dict = GeneTrackGene.from_dict(gene_track_gene_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


