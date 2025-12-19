# Assay


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**aliquot** | **str** |  | [optional] 
**capture_kit** | **str** |  | [optional] 
**created_on** | **str** |  | [optional] 
**experimental_strategy_code** | **str** |  | [optional] 
**experimental_strategy_name** | **str** |  | [optional] 
**histology_code** | **str** |  | [optional] 
**patient_id** | **int** |  | 
**platform_code** | **str** |  | [optional] 
**run_alias** | **str** |  | [optional] 
**run_date** | **str** |  | [optional] 
**run_name** | **str** |  | [optional] 
**sample_id** | **int** |  | [optional] 
**sample_type_code** | **str** |  | [optional] 
**seq_id** | **int** |  | [optional] 
**sequencing_lab_code** | **str** |  | [optional] 
**sequencing_lab_name** | **str** |  | [optional] 
**sequencing_read_technology_code** | **str** |  | [optional] 
**sequencing_read_technology_name** | **str** |  | [optional] 
**status_code** | **str** |  | [optional] 
**submitter_sample_id** | **str** |  | [optional] 
**tissue_site** | **str** |  | [optional] 
**updated_on** | **str** |  | [optional] 

## Example

```python
from radiant_python.models.assay import Assay

# TODO update the JSON string below
json = "{}"
# create an instance of Assay from a JSON string
assay_instance = Assay.from_json(json)
# print the JSON string representation of the object
print(Assay.to_json())

# convert the object into a dict
assay_dict = assay_instance.to_dict()
# create an instance of Assay from a dict
assay_from_dict = Assay.from_dict(assay_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


