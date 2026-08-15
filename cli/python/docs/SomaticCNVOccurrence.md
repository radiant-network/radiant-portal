# SomaticCNVOccurrence

SomaticCNVOccurrence represents a somatic CNV occurrence

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**aliquot** | **str** |  | [optional] 
**ascn_as** | **int** |  | [optional] 
**bc** | **int** |  | [optional] 
**calls** | **List[int]** |  | [optional] 
**chromosome** | **str** |  | 
**ciend** | **List[int]** |  | [optional] 
**cipos** | **List[int]** |  | [optional] 
**cn** | **int** | DRAGEN allele-specific copy number (ASCN). 3.10.8 does not emit these at all and 4.2.4 declares but omits them per record, so expect them to be mostly NULL. | [optional] 
**cnf** | **float** |  | [optional] 
**cnq** | **float** |  | [optional] 
**cnv_id** | **str** |  | 
**cytoband** | **List[str]** |  | [optional] 
**end** | **int** |  | 
**filter** | **str** |  | [optional] 
**flag_type** | [**OccurrenceFlagType**](OccurrenceFlagType.md) |  | [optional] 
**gnomad_sc** | **int** | NULL by design on CNLOH rows: the gnomAD-SV join keys on type, and a copy-neutral segment correctly matches nothing. | [optional] 
**gnomad_sf** | **float** |  | [optional] 
**gnomad_sn** | **int** |  | [optional] 
**has_note** | **bool** |  | 
**length** | **int** |  | 
**maf** | **float** |  | [optional] 
**mcn** | **int** |  | [optional] 
**mcnf** | **float** |  | [optional] 
**mcnq** | **float** |  | [optional] 
**name** | **str** |  | 
**nb_genes** | **int** |  | [optional] 
**nb_snv** | **int** | Counts somatic SNVs, unlike germline CNV&#39;s identically named column, which counts germline ones. Never pool or compare the two. | [optional] 
**pe** | **List[int]** |  | [optional] 
**quality** | **float** |  | [optional] 
**reflen** | **int** |  | [optional] 
**sd** | **float** |  | [optional] 
**seq_id** | **int** | The tumor sequencing id. Somatic CNV spells this seq_id, not tumor_seq_id as somatic SNV does, and has no normal_seq_id. | 
**sm** | **float** |  | [optional] 
**start** | **int** |  | 
**svlen** | **int** |  | [optional] 
**svtype** | **str** |  | [optional] 
**symbol** | **List[str]** |  | [optional] 
**task_id** | **int** |  | 
**type** | **str** |  | 

## Example

```python
from radiant_python.models.somatic_cnv_occurrence import SomaticCNVOccurrence

# TODO update the JSON string below
json = "{}"
# create an instance of SomaticCNVOccurrence from a JSON string
somatic_cnv_occurrence_instance = SomaticCNVOccurrence.from_json(json)
# print the JSON string representation of the object
print(SomaticCNVOccurrence.to_json())

# convert the object into a dict
somatic_cnv_occurrence_dict = somatic_cnv_occurrence_instance.to_dict()
# create an instance of SomaticCNVOccurrence from a dict
somatic_cnv_occurrence_from_dict = SomaticCNVOccurrence.from_dict(somatic_cnv_occurrence_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


