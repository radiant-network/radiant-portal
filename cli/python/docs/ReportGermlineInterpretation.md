# ReportGermlineInterpretation

The germline interpretation of the case on this transcript. Citations are empty when PubMed could not resolve the id.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**classification** | **str** |  | [optional] 
**classification_criterias** | **List[str]** |  | [optional] 
**condition** | **str** |  | [optional] 
**pubmed** | [**List[InterpretationPubmed]**](InterpretationPubmed.md) |  | [optional] 
**transmission_modes** | **List[str]** |  | [optional] 

## Example

```python
from radiant_python.models.report_germline_interpretation import ReportGermlineInterpretation

# TODO update the JSON string below
json = "{}"
# create an instance of ReportGermlineInterpretation from a JSON string
report_germline_interpretation_instance = ReportGermlineInterpretation.from_json(json)
# print the JSON string representation of the object
print(ReportGermlineInterpretation.to_json())

# convert the object into a dict
report_germline_interpretation_dict = report_germline_interpretation_instance.to_dict()
# create an instance of ReportGermlineInterpretation from a dict
report_germline_interpretation_from_dict = ReportGermlineInterpretation.from_dict(report_germline_interpretation_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


