# PatientGenomics

Portal cases of a patient and the variant interpretations recorded on them

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**cases** | [**List[PatientCase]**](PatientCase.md) |  | 
**interpretations** | [**List[PatientInterpretation]**](PatientInterpretation.md) | Germline and somatic, of the patient&#39;s cases | 

## Example

```python
from radiant_python.models.patient_genomics import PatientGenomics

# TODO update the JSON string below
json = "{}"
# create an instance of PatientGenomics from a JSON string
patient_genomics_instance = PatientGenomics.from_json(json)
# print the JSON string representation of the object
print(PatientGenomics.to_json())

# convert the object into a dict
patient_genomics_dict = patient_genomics_instance.to_dict()
# create an instance of PatientGenomics from a dict
patient_genomics_from_dict = PatientGenomics.from_dict(patient_genomics_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


