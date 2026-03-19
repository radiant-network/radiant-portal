# CreateOccurrenceNoteInput


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**case_id** | **int** |  | 
**content** | **str** |  | 
**occurrence_id** | **int** |  | 
**seq_id** | **int** |  | 
**task_id** | **int** |  | 

## Example

```python
from radiant_python.models.create_occurrence_note_input import CreateOccurrenceNoteInput

# TODO update the JSON string below
json = "{}"
# create an instance of CreateOccurrenceNoteInput from a JSON string
create_occurrence_note_input_instance = CreateOccurrenceNoteInput.from_json(json)
# print the JSON string representation of the object
print(CreateOccurrenceNoteInput.to_json())

# convert the object into a dict
create_occurrence_note_input_dict = create_occurrence_note_input_instance.to_dict()
# create an instance of CreateOccurrenceNoteInput from a dict
create_occurrence_note_input_from_dict = CreateOccurrenceNoteInput.from_dict(create_occurrence_note_input_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


