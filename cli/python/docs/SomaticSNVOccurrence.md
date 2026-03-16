# SomaticSNVOccurrence


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**aa_change** | **str** |  | 
**ad_ratio** | **float** |  | [optional] 
**clinvar** | **List[str]** |  | 
**germline_pc_wgs** | **int** |  | 
**germline_pf_wgs** | **float** |  | 
**gnomad_v3_af** | **float** |  | 
**has_interpretation** | **bool** |  | 
**hgvsg** | **str** |  | 
**hotspot** | **bool** |  | 
**is_canonical** | **bool** |  | 
**is_mane_plus** | **bool** |  | 
**is_mane_select** | **bool** |  | 
**locus_id** | **str** |  | 
**omim_inheritance_code** | **List[str]** |  | 
**picked_consequences** | **List[str]** |  | 
**rsnumber** | **str** |  | 
**seq_id** | **int** |  | 
**somatic_pc_tn_wgs** | **int** |  | 
**somatic_pf_tn_wgs** | **float** |  | 
**somatic_quality** | **int** |  | 
**symbol** | **str** |  | 
**task_id** | **int** |  | 
**variant_class** | **str** |  | 
**vep_impact** | [**VepImpact**](VepImpact.md) |  | 
**zygosity** | **str** |  | [optional] 

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


