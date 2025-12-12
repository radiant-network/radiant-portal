# SampleBatch


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**histology_code** | **str** |  | 
**patient_organization_code** | **str** |  | 
**sample_organization_code** | **str** |  | 
**submitter_parent_sample_id** | **str** |  | [optional] 
**submitter_patient_id** | **str** |  | 
**submitter_sample_id** | **str** |  | 
**tissue_site** | **str** |  | [optional] 
**type_code** | **str** |  | 

## Example

```python
from radiant_python.models.sample_batch import SampleBatch

# TODO update the JSON string below
json = "{}"
# create an instance of SampleBatch from a JSON string
sample_batch_instance = SampleBatch.from_json(json)
# print the JSON string representation of the object
print(SampleBatch.to_json())

# convert the object into a dict
sample_batch_dict = sample_batch_instance.to_dict()
# create an instance of SampleBatch from a dict
sample_batch_from_dict = SampleBatch.from_dict(sample_batch_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


