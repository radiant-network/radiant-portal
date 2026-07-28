# CaseFetusBatch


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**affected_status_code** | **str** |  | 
**estimated_due_date** | **date** |  | [optional] 
**last_menstrual_period** | **date** |  | [optional] 
**life_status_code** | **str** |  | 
**observations_categorical** | [**List[ObservationCategoricalBatch]**](ObservationCategoricalBatch.md) |  | [optional] 
**observations_text** | [**List[ObservationTextBatch]**](ObservationTextBatch.md) |  | [optional] 
**sex_code** | **str** |  | 

## Example

```python
from radiant_python.models.case_fetus_batch import CaseFetusBatch

# TODO update the JSON string below
json = "{}"
# create an instance of CaseFetusBatch from a JSON string
case_fetus_batch_instance = CaseFetusBatch.from_json(json)
# print the JSON string representation of the object
print(CaseFetusBatch.to_json())

# convert the object into a dict
case_fetus_batch_dict = case_fetus_batch_instance.to_dict()
# create an instance of CaseFetusBatch from a dict
case_fetus_batch_from_dict = CaseFetusBatch.from_dict(case_fetus_batch_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


