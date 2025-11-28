# Sequencing

Sequencing represents a sequencing

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**affected_status** | **str** |  | [optional] 
**analysis_type** | **str** |  | [optional] 
**case_id** | **int** |  | [optional] 
**created_at** | **str** |  | [optional] 
**experimental_strategy** | **str** |  | [optional] 
**family_role** | **str** |  | [optional] 
**part** | **int** |  | [optional] 
**patient_id** | **int** |  | [optional] 
**request_priority** | **str** |  | [optional] 
**sample_id** | **int** |  | [optional] 
**seq_id** | **int** |  | [optional] 
**sex** | **str** |  | [optional] 
**task_id** | **int** |  | [optional] 
**updated_at** | **str** |  | [optional] 
**vcf_filepath** | **str** |  | [optional] 

## Example

```python
from openapi_client.models.sequencing import Sequencing

# TODO update the JSON string below
json = "{}"
# create an instance of Sequencing from a JSON string
sequencing_instance = Sequencing.from_json(json)
# print the JSON string representation of the object
print(Sequencing.to_json())

# convert the object into a dict
sequencing_dict = sequencing_instance.to_dict()
# create an instance of Sequencing from a dict
sequencing_from_dict = Sequencing.from_dict(sequencing_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


