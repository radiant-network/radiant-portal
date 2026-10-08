# GermlineSNVOccurrence

GermlineSNVOccurrence represents a germline SNV occurrence

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**aa_change** | **str** |  | [optional] 
**ad_ratio** | **float** |  | 
**chromosome** | **str** |  | 
**clinvar** | **List[str]** |  | [optional] 
**cmc_mutation_url** | **str** |  | [optional] 
**cmc_sample_mutated** | **int** |  | [optional] 
**cmc_sample_ratio** | **float** |  | [optional] 
**cmc_tier** | **str** |  | [optional] 
**end** | **int** |  | 
**exomiser_acmg_classification** | **str** |  | 
**exomiser_acmg_evidence** | **List[str]** |  | 
**exomiser_gene_combined_score** | **float** |  | 
**exomiser_moi** | **str** |  | 
**exomiser_variant_score** | **float** |  | 
**filter** | **str** |  | [optional] 
**flag_type** | [**OccurrenceFlagType**](OccurrenceFlagType.md) |  | [optional] 
**genotype_quality** | **int** |  | 
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
**is_canonical** | **bool** |  | [optional] 
**is_mane_plus** | **bool** |  | [optional] 
**is_mane_select** | **bool** |  | [optional] 
**locus** | **str** |  | 
**locus_id** | **str** |  | 
**max_impact_score** | **int** |  | 
**omim_inheritance_code** | **List[str]** |  | [optional] 
**picked_consequences** | **List[str]** |  | 
**rsnumber** | **str** |  | [optional] 
**seq_id** | **int** |  | 
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
**start** | **int** |  | 
**symbol** | **str** |  | [optional] 
**task_id** | **int** |  | 
**transcript_id** | **str** |  | [optional] 
**variant_class** | **str** |  | 
**vep_impact** | [**VepImpact**](VepImpact.md) |  | [optional] 
**zygosity** | **str** |  | 

## Example

```python
from radiant_python.models.germline_snv_occurrence import GermlineSNVOccurrence

# TODO update the JSON string below
json = "{}"
# create an instance of GermlineSNVOccurrence from a JSON string
germline_snv_occurrence_instance = GermlineSNVOccurrence.from_json(json)
# print the JSON string representation of the object
print(GermlineSNVOccurrence.to_json())

# convert the object into a dict
germline_snv_occurrence_dict = germline_snv_occurrence_instance.to_dict()
# create an instance of GermlineSNVOccurrence from a dict
germline_snv_occurrence_from_dict = GermlineSNVOccurrence.from_dict(germline_snv_occurrence_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


