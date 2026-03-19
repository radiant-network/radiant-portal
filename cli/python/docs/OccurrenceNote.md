# OccurrenceNote


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**case_id** | **int** |  | 
**content** | **str** |  | 
**created_at** | **str** |  | 
**id** | **str** |  | 
**occurrence_id** | **int** |  | 
**seq_id** | **int** |  | 
**task_id** | **int** |  | 
**updated_at** | **str** |  | 
**user_id** | **str** |  | 
**user_name** | **str** |  | 

## Example

```python
from radiant_python.models.occurrence_note import OccurrenceNote

# TODO update the JSON string below
json = "{}"
# create an instance of OccurrenceNote from a JSON string
occurrence_note_instance = OccurrenceNote.from_json(json)
# print the JSON string representation of the object
print(OccurrenceNote.to_json())

# convert the object into a dict
occurrence_note_dict = occurrence_note_instance.to_dict()
# create an instance of OccurrenceNote from a dict
occurrence_note_from_dict = OccurrenceNote.from_dict(occurrence_note_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


