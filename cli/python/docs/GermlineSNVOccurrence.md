# GermlineSNVOccurrence

GermlineSNVOccurrence represents a germline SNV occurrence

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**aa_change** | **str** |  | [optional] 
**ad_ratio** | **float** |  | 
**chromosome** | **str** |  | 
**clinvar** | **List[str]** |  | [optional] 
**exomiser_acmg_classification** | **str** |  | 
**exomiser_acmg_evidence** | **List[str]** |  | 
**exomiser_gene_combined_score** | **float** |  | 
**exomiser_moi** | **str** |  | 
**exomiser_variant_score** | **float** |  | 
**filter** | **str** |  | [optional] 
**genotype_quality** | **int** |  | 
**gnomad_v3_af** | **float** |  | 
**has_interpretation** | **bool** |  | 
**hgvsg** | **str** |  | 
**is_canonical** | **bool** |  | [optional] 
**is_mane_plus** | **bool** |  | [optional] 
**is_mane_select** | **bool** |  | [optional] 
**locus** | **str** |  | 
**locus_id** | **str** |  | 
**max_impact_score** | **int** |  | 
**omim_inheritance_code** | **List[str]** |  | [optional] 
**pc_wgs** | **int** |  | [optional] 
**pf_wgs** | **float** |  | 
**picked_consequences** | **List[str]** |  | 
**pn_wgs** | **int** |  | [optional] 
**rsnumber** | **str** |  | [optional] 
**seq_id** | **int** |  | 
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


