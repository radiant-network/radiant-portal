# VariantOverview


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**aa_change** | **str** |  | [optional] 
**cadd_phred** | **float** |  | [optional] 
**cadd_score** | **float** |  | [optional] 
**clinvar** | **List[str]** |  | [optional] 
**clinvar_name** | **str** |  | [optional] 
**dann_score** | **float** |  | [optional] 
**dna_change** | **str** |  | [optional] 
**exomiser_acmg_classification_counts** | **Dict[str, int]** |  | [optional] 
**exon_rank** | **int** |  | [optional] 
**exon_total** | **int** |  | [optional] 
**fathmm_pred** | **str** |  | [optional] 
**fathmm_score** | **float** |  | [optional] 
**gnomad_loeuf** | **float** |  | [optional] 
**gnomad_pli** | **float** |  | [optional] 
**gnomad_v3_af** | **float** |  | 
**interpretation_classification_counts** | **Dict[str, int]** |  | [optional] 
**is_canonical** | **bool** |  | 
**is_mane_plus** | **bool** |  | 
**is_mane_select** | **bool** |  | 
**locus** | **str** |  | 
**lrt_pred** | **str** |  | [optional] 
**lrt_score** | **float** |  | [optional] 
**omim_conditions** | [**List[OmimGenePanel]**](OmimGenePanel.md) |  | [optional] 
**pc_wgs** | **int** |  | [optional] 
**pf_wgs** | **float** |  | 
**phylo_p17way_primate** | **float** |  | [optional] 
**picked_consequences** | **List[str]** |  | 
**pn_wgs** | **int** |  | [optional] 
**polyphen2_hvar_pred** | **str** |  | [optional] 
**polyphen2_hvar_score** | **float** |  | [optional] 
**revel_score** | **float** |  | [optional] 
**rsnumber** | **str** |  | [optional] 
**sift_pred** | **str** |  | [optional] 
**sift_score** | **float** |  | [optional] 
**spliceai_ds** | **float** |  | [optional] 
**spliceai_type** | **List[str]** |  | [optional] 
**symbol** | **str** |  | [optional] 
**transcript_id** | **str** |  | [optional] 
**vep_impact** | [**VepImpact**](VepImpact.md) |  | [optional] 

## Example

```python
from openapi_client.models.variant_overview import VariantOverview

# TODO update the JSON string below
json = "{}"
# create an instance of VariantOverview from a JSON string
variant_overview_instance = VariantOverview.from_json(json)
# print the JSON string representation of the object
print(VariantOverview.to_json())

# convert the object into a dict
variant_overview_dict = variant_overview_instance.to_dict()
# create an instance of VariantOverview from a dict
variant_overview_from_dict = VariantOverview.from_dict(variant_overview_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


