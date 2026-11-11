# ExpandedSomaticSNVOccurrence


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**aa_change** | **str** |  | [optional] 
**ad_alt** | **int** |  | [optional] 
**ad_ratio** | **float** |  | [optional] 
**ad_total** | **int** |  | [optional] 
**aq** | **float** |  | [optional] 
**cadd_phred** | **float** |  | [optional] 
**cadd_score** | **float** |  | [optional] 
**chromosome** | **str** |  | 
**clinvar** | **List[str]** |  | [optional] 
**cmc_mutation_url** | **str** |  | [optional] 
**cmc_sample_mutated** | **int** |  | [optional] 
**cmc_sample_ratio** | **float** |  | [optional] 
**cmc_tier** | **str** |  | [optional] 
**dann_score** | **float** |  | [optional] 
**dna_change** | **str** |  | [optional] 
**end** | **int** |  | 
**ensembl_gene_id** | **str** |  | [optional] 
**exon_rank** | **int** |  | [optional] 
**exon_total** | **int** |  | [optional] 
**fathmm_pred** | **str** |  | [optional] 
**fathmm_score** | **float** |  | [optional] 
**filter** | **str** |  | [optional] 
**germline_af_wgs** | **float** | Approximate allele frequency, (pc + hom) / (2 * pn). Assumes diploid genotypes; HEM is counted as HOM. | [optional] 
**germline_af_wgs_affected** | **float** | Approximate allele frequency, (pc + hom) / (2 * pn). Assumes diploid genotypes; HEM is counted as HOM. | [optional] 
**germline_af_wgs_not_affected** | **float** | Approximate allele frequency, (pc + hom) / (2 * pn). Assumes diploid genotypes; HEM is counted as HOM. | [optional] 
**germline_af_wxs** | **float** | Approximate allele frequency, (pc + hom) / (2 * pn). Assumes diploid genotypes; HEM is counted as HOM. | [optional] 
**germline_af_wxs_affected** | **float** | Approximate allele frequency, (pc + hom) / (2 * pn). Assumes diploid genotypes; HEM is counted as HOM. | [optional] 
**germline_af_wxs_not_affected** | **float** | Approximate allele frequency, (pc + hom) / (2 * pn). Assumes diploid genotypes; HEM is counted as HOM. | [optional] 
**germline_hom_wgs** | **int** | Number of patients with a HOM or HEM call | [optional] 
**germline_hom_wgs_affected** | **int** | Number of patients with a HOM or HEM call | [optional] 
**germline_hom_wgs_not_affected** | **int** | Number of patients with a HOM or HEM call | [optional] 
**germline_hom_wxs** | **int** | Number of patients with a HOM or HEM call | [optional] 
**germline_hom_wxs_affected** | **int** | Number of patients with a HOM or HEM call | [optional] 
**germline_hom_wxs_not_affected** | **int** | Number of patients with a HOM or HEM call | [optional] 
**germline_pc_wgs** | **int** |  | [optional] 
**germline_pc_wgs_affected** | **int** |  | [optional] 
**germline_pc_wgs_not_affected** | **int** |  | [optional] 
**germline_pc_wxs** | **int** |  | [optional] 
**germline_pc_wxs_affected** | **int** |  | [optional] 
**germline_pc_wxs_not_affected** | **int** |  | [optional] 
**germline_pf_wgs** | **float** |  | [optional] 
**germline_pf_wgs_affected** | **float** |  | [optional] 
**germline_pf_wgs_not_affected** | **float** |  | [optional] 
**germline_pf_wxs** | **float** |  | [optional] 
**germline_pf_wxs_affected** | **float** |  | [optional] 
**germline_pf_wxs_not_affected** | **float** |  | [optional] 
**germline_pn_wgs** | **int** |  | [optional] 
**germline_pn_wgs_affected** | **int** |  | [optional] 
**germline_pn_wgs_not_affected** | **int** |  | [optional] 
**germline_pn_wxs** | **int** |  | [optional] 
**germline_pn_wxs_affected** | **int** |  | [optional] 
**germline_pn_wxs_not_affected** | **int** |  | [optional] 
**gnomad_loeuf** | **float** |  | [optional] 
**gnomad_pli** | **float** |  | [optional] 
**gnomad_v3_af** | **float** |  | [optional] 
**hgvsg** | **str** |  | 
**interpretation_classification_counts** | **Dict[str, int]** |  | [optional] 
**is_canonical** | **bool** |  | [optional] 
**is_mane_plus** | **bool** |  | [optional] 
**is_mane_select** | **bool** |  | [optional] 
**locus** | **str** |  | 
**locus_id** | **str** |  | 
**lrt_pred** | **str** |  | [optional] 
**lrt_score** | **float** |  | [optional] 
**omim_conditions** | [**List[OmimGenePanel]**](OmimGenePanel.md) |  | [optional] 
**picked_consequences** | **List[str]** |  | [optional] 
**polyphen2_hvar_pred** | **str** |  | [optional] 
**polyphen2_hvar_score** | **float** |  | [optional] 
**qd** | **float** |  | [optional] 
**revel_score** | **float** |  | [optional] 
**rsnumber** | **str** |  | [optional] 
**sift_pred** | **str** |  | [optional] 
**sift_score** | **float** |  | [optional] 
**somatic_af_tn_wgs** | **float** | Approximate allele frequency, (pc + hom) / (2 * pn). Assumes diploid genotypes; HEM is counted as HOM. Does not account for tumor purity, copy number or loss of heterozygosity. | [optional] 
**somatic_af_tn_wxs** | **float** | Approximate allele frequency, (pc + hom) / (2 * pn). Assumes diploid genotypes; HEM is counted as HOM. Does not account for tumor purity, copy number or loss of heterozygosity. | [optional] 
**somatic_af_to_wgs** | **float** | Approximate allele frequency, (pc + hom) / (2 * pn). Assumes diploid genotypes; HEM is counted as HOM. Does not account for tumor purity, copy number or loss of heterozygosity. | [optional] 
**somatic_af_to_wxs** | **float** | Approximate allele frequency, (pc + hom) / (2 * pn). Assumes diploid genotypes; HEM is counted as HOM. Does not account for tumor purity, copy number or loss of heterozygosity. | [optional] 
**somatic_hom_tn_wgs** | **int** | Number of patients with a HOM or HEM tumor call | [optional] 
**somatic_hom_tn_wxs** | **int** | Number of patients with a HOM or HEM tumor call | [optional] 
**somatic_hom_to_wgs** | **int** | Number of patients with a HOM or HEM tumor call | [optional] 
**somatic_hom_to_wxs** | **int** | Number of patients with a HOM or HEM tumor call | [optional] 
**somatic_pc_tn_wgs** | **int** |  | [optional] 
**somatic_pc_tn_wxs** | **int** |  | [optional] 
**somatic_pc_to_wgs** | **int** |  | [optional] 
**somatic_pc_to_wxs** | **int** |  | [optional] 
**somatic_pf_tn_wgs** | **float** |  | [optional] 
**somatic_pf_tn_wxs** | **float** |  | [optional] 
**somatic_pf_to_wgs** | **float** |  | [optional] 
**somatic_pf_to_wxs** | **float** |  | [optional] 
**somatic_pn_tn_wgs** | **int** |  | [optional] 
**somatic_pn_tn_wxs** | **int** |  | [optional] 
**somatic_pn_to_wgs** | **int** |  | [optional] 
**somatic_pn_to_wxs** | **int** |  | [optional] 
**spliceai_ds** | **float** |  | [optional] 
**spliceai_type** | **List[str]** |  | [optional] 
**sq** | **float** |  | [optional] 
**start** | **int** |  | 
**symbol** | **str** |  | [optional] 
**transcript_id** | **str** |  | [optional] 
**vep_impact** | [**VepImpact**](VepImpact.md) |  | [optional] 

## Example

```python
from radiant_python.models.expanded_somatic_snv_occurrence import ExpandedSomaticSNVOccurrence

# TODO update the JSON string below
json = "{}"
# create an instance of ExpandedSomaticSNVOccurrence from a JSON string
expanded_somatic_snv_occurrence_instance = ExpandedSomaticSNVOccurrence.from_json(json)
# print the JSON string representation of the object
print(ExpandedSomaticSNVOccurrence.to_json())

# convert the object into a dict
expanded_somatic_snv_occurrence_dict = expanded_somatic_snv_occurrence_instance.to_dict()
# create an instance of ExpandedSomaticSNVOccurrence from a dict
expanded_somatic_snv_occurrence_from_dict = ExpandedSomaticSNVOccurrence.from_dict(expanded_somatic_snv_occurrence_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


