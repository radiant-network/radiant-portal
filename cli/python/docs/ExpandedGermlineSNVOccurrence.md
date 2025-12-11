# ExpandedGermlineSNVOccurrence


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**aa_change** | **str** |  | [optional] 
**ad_alt** | **int** |  | [optional] 
**ad_total** | **int** |  | [optional] 
**af** | **float** | TODO | [optional] 
**cadd_phred** | **float** |  | [optional] 
**cadd_score** | **float** |  | [optional] 
**chromosome** | **str** |  | [optional] 
**clinvar** | **List[str]** |  | [optional] 
**dann_score** | **float** |  | [optional] 
**dna_change** | **str** |  | [optional] 
**end** | **int** |  | [optional] 
**exomiser_acmg_classification** | **str** |  | [optional] 
**exomiser_acmg_classification_counts** | **Dict[str, int]** |  | [optional] 
**exomiser_acmg_evidence** | **List[str]** |  | 
**exomiser_gene_combined_score** | **float** |  | 
**exon_rank** | **int** |  | [optional] 
**exon_total** | **int** |  | [optional] 
**father_calls** | **List[int]** |  | [optional] 
**fathmm_pred** | **str** |  | [optional] 
**fathmm_score** | **float** |  | [optional] 
**filter** | **str** |  | [optional] 
**genotype_quality** | **int** |  | 
**gnomad_loeuf** | **float** |  | [optional] 
**gnomad_pli** | **float** |  | [optional] 
**gnomad_v3_af** | **float** |  | 
**hgvsg** | **str** |  | 
**interpretation_classification** | **str** |  | [optional] 
**interpretation_classification_counts** | **Dict[str, int]** |  | [optional] 
**is_canonical** | **bool** |  | [optional] 
**is_mane_plus** | **bool** |  | [optional] 
**is_mane_select** | **bool** |  | [optional] 
**locus** | **str** |  | 
**locus_id** | **str** |  | 
**mother_calls** | **List[int]** |  | [optional] 
**omim_conditions** | [**List[OmimGenePanel]**](OmimGenePanel.md) |  | [optional] 
**parental_origin** | **str** |  | [optional] 
**pc_wgs_affected** | **int** |  | [optional] 
**pc_wgs_not_affected** | **int** |  | [optional] 
**pf_wgs** | **float** |  | [optional] 
**pf_wgs_affected** | **float** |  | [optional] 
**pf_wgs_not_affected** | **float** |  | [optional] 
**picked_consequences** | **List[str]** |  | 
**pn_wgs_affected** | **int** |  | [optional] 
**pn_wgs_not_affected** | **int** |  | [optional] 
**qd** | **float** |  | [optional] 
**revel_score** | **float** |  | [optional] 
**rsnumber** | **str** |  | [optional] 
**sift_pred** | **str** |  | [optional] 
**sift_score** | **float** |  | [optional] 
**spliceai_ds** | **float** |  | [optional] 
**spliceai_type** | **List[str]** |  | [optional] 
**start** | **int** |  | [optional] 
**symbol** | **str** |  | [optional] 
**transcript_id** | **str** |  | [optional] 
**transmission** | **str** |  | [optional] 
**vep_impact** | [**VepImpact**](VepImpact.md) |  | [optional] 
**zygosity** | **str** |  | [optional] 

## Example

```python
from radiant_python.models.expanded_germline_snv_occurrence import ExpandedGermlineSNVOccurrence

# TODO update the JSON string below
json = "{}"
# create an instance of ExpandedGermlineSNVOccurrence from a JSON string
expanded_germline_snv_occurrence_instance = ExpandedGermlineSNVOccurrence.from_json(json)
# print the JSON string representation of the object
print(ExpandedGermlineSNVOccurrence.to_json())

# convert the object into a dict
expanded_germline_snv_occurrence_dict = expanded_germline_snv_occurrence_instance.to_dict()
# create an instance of ExpandedGermlineSNVOccurrence from a dict
expanded_germline_snv_occurrence_from_dict = ExpandedGermlineSNVOccurrence.from_dict(expanded_germline_snv_occurrence_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


