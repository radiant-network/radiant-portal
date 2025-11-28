# ClinvarRCV

ClinvarRCV represents a Reference ClinVar record - data aggregated by variant-condition pair

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**accession** | **str** |  | [optional] 
**clinical_significance** | **List[str]** |  | [optional] 
**clinvar_id** | **str** |  | 
**date_last_evaluated** | **str** |  | [optional] 
**locus_id** | **str** |  | 
**origins** | **List[str]** |  | [optional] 
**review_status** | **str** |  | [optional] 
**review_status_stars** | **int** |  | [optional] 
**submission_count** | **int** |  | [optional] 
**traits** | **List[str]** |  | [optional] 
**version** | **int** |  | [optional] 

## Example

```python
from openapi_client.models.clinvar_rcv import ClinvarRCV

# TODO update the JSON string below
json = "{}"
# create an instance of ClinvarRCV from a JSON string
clinvar_rcv_instance = ClinvarRCV.from_json(json)
# print the JSON string representation of the object
print(ClinvarRCV.to_json())

# convert the object into a dict
clinvar_rcv_dict = clinvar_rcv_instance.to_dict()
# create an instance of ClinvarRCV from a dict
clinvar_rcv_from_dict = ClinvarRCV.from_dict(clinvar_rcv_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


