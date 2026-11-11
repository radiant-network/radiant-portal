# FamilyHistoryBatch


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**condition** | **str** |  | 
**family_member_code** | **str** |  | 

## Example

```python
from radiant_python.models.family_history_batch import FamilyHistoryBatch

# TODO update the JSON string below
json = "{}"
# create an instance of FamilyHistoryBatch from a JSON string
family_history_batch_instance = FamilyHistoryBatch.from_json(json)
# print the JSON string representation of the object
print(FamilyHistoryBatch.to_json())

# convert the object into a dict
family_history_batch_dict = family_history_batch_instance.to_dict()
# create an instance of FamilyHistoryBatch from a dict
family_history_batch_from_dict = FamilyHistoryBatch.from_dict(family_history_batch_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


