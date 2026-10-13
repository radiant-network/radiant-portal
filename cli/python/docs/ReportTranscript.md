# ReportTranscript

One row of the report: an Ensembl transcript with its RefSeq pair, or a RefSeq transcript of a gene that has no Ensembl transcript.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**aa_change** | **str** |  | [optional] 
**cadd_phred** | **float** |  | [optional] 
**consequences** | **List[str]** |  | [optional] 
**dna_change** | **str** |  | [optional] 
**exon_rank** | **str** |  | [optional] 
**exon_total** | **str** |  | [optional] 
**interpretation** | [**ReportGermlineInterpretation**](ReportGermlineInterpretation.md) |  | [optional] 
**is_canonical** | **bool** |  | 
**is_mane_plus** | **bool** |  | 
**is_mane_select** | **bool** |  | 
**refseq_ids** | **List[str]** |  | [optional] 
**revel_score** | **float** |  | [optional] 
**source** | **str** |  | [optional] 
**symbol** | **str** |  | [optional] 
**transcript_id** | **str** |  | 
**vep_impact** | **str** |  | [optional] 
**version** | **str** |  | [optional] 

## Example

```python
from radiant_python.models.report_transcript import ReportTranscript

# TODO update the JSON string below
json = "{}"
# create an instance of ReportTranscript from a JSON string
report_transcript_instance = ReportTranscript.from_json(json)
# print the JSON string representation of the object
print(ReportTranscript.to_json())

# convert the object into a dict
report_transcript_dict = report_transcript_instance.to_dict()
# create an instance of ReportTranscript from a dict
report_transcript_from_dict = ReportTranscript.from_dict(report_transcript_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


