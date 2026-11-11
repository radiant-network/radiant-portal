# Transcript


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**aa_change** | **str** |  | [optional] 
**cadd_phred** | **float** |  | [optional] 
**cadd_score** | **float** |  | [optional] 
**consequences** | **List[str]** |  | [optional] 
**dann_score** | **float** |  | [optional] 
**dna_change** | **str** |  | [optional] 
**exon_rank** | **int** |  | [optional] 
**exon_total** | **int** |  | [optional] 
**fathmm_pred** | **str** |  | [optional] 
**fathmm_score** | **float** |  | [optional] 
**is_canonical** | **bool** |  | [optional] 
**is_mane_plus** | **bool** |  | [optional] 
**is_mane_select** | **bool** |  | [optional] 
**lrt_pred** | **str** |  | [optional] 
**lrt_score** | **float** |  | [optional] 
**phylo_p17way_primate** | **float** |  | [optional] 
**polyphen2_hvar_pred** | **str** |  | [optional] 
**polyphen2_hvar_score** | **float** |  | [optional] 
**revel_score** | **float** |  | [optional] 
**sift_pred** | **str** |  | [optional] 
**sift_score** | **float** |  | [optional] 
**transcript_id** | **str** |  | [optional] 
**vep_impact** | [**VepImpact**](VepImpact.md) |  | [optional] 

## Example

```python
from radiant_python.models.transcript import Transcript

# TODO update the JSON string below
json = "{}"
# create an instance of Transcript from a JSON string
transcript_instance = Transcript.from_json(json)
# print the JSON string representation of the object
print(Transcript.to_json())

# convert the object into a dict
transcript_dict = transcript_instance.to_dict()
# create an instance of Transcript from a dict
transcript_from_dict = Transcript.from_dict(transcript_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


