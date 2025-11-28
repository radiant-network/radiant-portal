# GermlineCNVOccurrence

GermlineCNVOccurrence represents a germline CNV occurrence

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**aliquot** | **str** |  | [optional] 
**bc** | **int** |  | [optional] 
**calls** | **List[int]** |  | [optional] 
**chromosome** | **str** |  | 
**ciend** | **List[int]** |  | [optional] 
**cipos** | **List[int]** |  | [optional] 
**cn** | **int** |  | [optional] 
**cnv_id** | **str** |  | 
**cytoband** | **List[str]** |  | [optional] 
**end** | **int** |  | 
**filter** | **str** |  | [optional] 
**gnomad_sc** | **int** |  | [optional] 
**gnomad_sf** | **float** |  | [optional] 
**gnomad_sn** | **int** |  | [optional] 
**length** | **int** |  | 
**name** | **str** |  | 
**nb_genes** | **int** |  | [optional] 
**nb_snv** | **int** |  | [optional] 
**pe** | **List[int]** |  | [optional] 
**quality** | **float** |  | [optional] 
**reflen** | **int** |  | [optional] 
**seq_id** | **int** |  | 
**sm** | **float** |  | [optional] 
**start** | **int** |  | 
**svlen** | **int** |  | [optional] 
**svtype** | **str** |  | [optional] 
**symbol** | **List[str]** |  | [optional] 
**type** | **str** |  | 

## Example

```python
from openapi_client.models.germline_cnv_occurrence import GermlineCNVOccurrence

# TODO update the JSON string below
json = "{}"
# create an instance of GermlineCNVOccurrence from a JSON string
germline_cnv_occurrence_instance = GermlineCNVOccurrence.from_json(json)
# print the JSON string representation of the object
print(GermlineCNVOccurrence.to_json())

# convert the object into a dict
germline_cnv_occurrence_dict = germline_cnv_occurrence_instance.to_dict()
# create an instance of GermlineCNVOccurrence from a dict
germline_cnv_occurrence_from_dict = GermlineCNVOccurrence.from_dict(germline_cnv_occurrence_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


