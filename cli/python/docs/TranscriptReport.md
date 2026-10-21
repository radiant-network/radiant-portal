# TranscriptReport

Report data of one germline SNV occurrence: case context, variant, occurrence, genes and one entry per transcript row.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**case** | [**ReportCase**](ReportCase.md) |  | 
**genes** | [**List[ReportGene]**](ReportGene.md) |  | 
**occurrence** | [**ReportOccurrence**](ReportOccurrence.md) |  | 
**transcripts** | [**List[ReportTranscript]**](ReportTranscript.md) |  | 
**variant** | [**ReportVariant**](ReportVariant.md) |  | 

## Example

```python
from radiant_python.models.transcript_report import TranscriptReport

# TODO update the JSON string below
json = "{}"
# create an instance of TranscriptReport from a JSON string
transcript_report_instance = TranscriptReport.from_json(json)
# print the JSON string representation of the object
print(TranscriptReport.to_json())

# convert the object into a dict
transcript_report_dict = transcript_report_instance.to_dict()
# create an instance of TranscriptReport from a dict
transcript_report_from_dict = TranscriptReport.from_dict(transcript_report_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


