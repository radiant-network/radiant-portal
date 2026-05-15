# TaskOccurrenceType

Task attached to a (case, sequencing) pair, used by the Variants tab task dropdown.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**created_on** | **str** |  | 
**genome_build** | **str** |  | [optional] 
**id** | **int** |  | 
**pipeline_name** | **str** |  | [optional] 
**pipeline_version** | **str** |  | 
**task_type_code** | **str** |  | 
**task_type_name** | **str** |  | 

## Example

```python
from radiant_python.models.task_occurrence_type import TaskOccurrenceType

# TODO update the JSON string below
json = "{}"
# create an instance of TaskOccurrenceType from a JSON string
task_occurrence_type_instance = TaskOccurrenceType.from_json(json)
# print the JSON string representation of the object
print(TaskOccurrenceType.to_json())

# convert the object into a dict
task_occurrence_type_dict = task_occurrence_type_instance.to_dict()
# create an instance of TaskOccurrenceType from a dict
task_occurrence_type_from_dict = TaskOccurrenceType.from_dict(task_occurrence_type_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


