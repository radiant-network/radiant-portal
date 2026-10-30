# SomaticSNVOccurrence


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**aa_change** | **str** |  | 
**ad_ratio** | **float** |  | [optional] 
**alternate** | **str** |  | 
**aq** | **float** |  | [optional] 
**chromosome** | **str** |  | 
**clinvar** | **List[str]** |  | 
**cmc_mutation_url** | **str** |  | [optional] 
**cmc_sample_mutated** | **int** |  | [optional] 
**cmc_sample_ratio** | **float** |  | [optional] 
**cmc_tier** | **str** |  | [optional] 
**end** | **int** |  | 
**flag_type** | [**OccurrenceFlagType**](OccurrenceFlagType.md) |  | [optional] 
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
**germline_pc_wgs** | **int** |  | 
**germline_pc_wgs_affected** | **int** |  | [optional] 
**germline_pc_wgs_not_affected** | **int** |  | [optional] 
**germline_pc_wxs** | **int** |  | [optional] 
**germline_pc_wxs_affected** | **int** |  | [optional] 
**germline_pc_wxs_not_affected** | **int** |  | [optional] 
**germline_pf_wgs** | **float** |  | 
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
**gnomad_v3_af** | **float** |  | 
**has_interpretation** | **bool** |  | 
**has_note** | **bool** |  | 
**hgvsg** | **str** |  | 
**hotspot** | **bool** |  | 
**is_canonical** | **bool** |  | 
**is_mane_plus** | **bool** |  | 
**is_mane_select** | **bool** |  | 
**locus_id** | **str** |  | 
**omim_inheritance_code** | **List[str]** |  | 
**picked_consequences** | **List[str]** |  | 
**reference** | **str** |  | 
**rsnumber** | **str** |  | 
**seq_id** | **int** |  | 
**somatic_af_tn_wgs** | **float** | Approximate allele frequency, (pc + hom) / (2 * pn). Assumes diploid genotypes; HEM is counted as HOM. Does not account for tumor purity, copy number or loss of heterozygosity. | [optional] 
**somatic_af_tn_wxs** | **float** | Approximate allele frequency, (pc + hom) / (2 * pn). Assumes diploid genotypes; HEM is counted as HOM. Does not account for tumor purity, copy number or loss of heterozygosity. | [optional] 
**somatic_af_to_wgs** | **float** | Approximate allele frequency, (pc + hom) / (2 * pn). Assumes diploid genotypes; HEM is counted as HOM. Does not account for tumor purity, copy number or loss of heterozygosity. | [optional] 
**somatic_af_to_wxs** | **float** | Approximate allele frequency, (pc + hom) / (2 * pn). Assumes diploid genotypes; HEM is counted as HOM. Does not account for tumor purity, copy number or loss of heterozygosity. | [optional] 
**somatic_hom_tn_wgs** | **int** | Number of patients with a HOM or HEM tumor call | [optional] 
**somatic_hom_tn_wxs** | **int** | Number of patients with a HOM or HEM tumor call | [optional] 
**somatic_hom_to_wgs** | **int** | Number of patients with a HOM or HEM tumor call | [optional] 
**somatic_hom_to_wxs** | **int** | Number of patients with a HOM or HEM tumor call | [optional] 
**somatic_pc_tn_wgs** | **int** |  | 
**somatic_pc_tn_wxs** | **int** |  | [optional] 
**somatic_pc_to_wgs** | **int** |  | 
**somatic_pc_to_wxs** | **int** |  | [optional] 
**somatic_pf_tn_wgs** | **float** |  | 
**somatic_pf_tn_wxs** | **float** |  | [optional] 
**somatic_pf_to_wgs** | **float** |  | 
**somatic_pf_to_wxs** | **float** |  | [optional] 
**somatic_pn_tn_wgs** | **int** |  | [optional] 
**somatic_pn_tn_wxs** | **int** |  | [optional] 
**somatic_pn_to_wgs** | **int** |  | [optional] 
**somatic_pn_to_wxs** | **int** |  | [optional] 
**sq** | **float** |  | [optional] 
**start** | **int** |  | 
**symbol** | **str** |  | 
**task_id** | **int** |  | 
**transcript_id** | **str** |  | [optional] 
**variant_class** | **str** |  | 
**vep_impact** | [**VepImpact**](VepImpact.md) |  | 

## Example

```python
from radiant_python.models.somatic_snv_occurrence import SomaticSNVOccurrence

# TODO update the JSON string below
json = "{}"
# create an instance of SomaticSNVOccurrence from a JSON string
somatic_snv_occurrence_instance = SomaticSNVOccurrence.from_json(json)
# print the JSON string representation of the object
print(SomaticSNVOccurrence.to_json())

# convert the object into a dict
somatic_snv_occurrence_dict = somatic_snv_occurrence_instance.to_dict()
# create an instance of SomaticSNVOccurrence from a dict
somatic_snv_occurrence_from_dict = SomaticSNVOccurrence.from_dict(somatic_snv_occurrence_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


