# OccurrenceCount

OccurrenceCount holds both totals of an occurrence count: the query builder total and the one left by the annotation filters

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**count** | **int** | Number of results matching the sqon, ignoring the annotation filters | [optional] 
**filtered_count** | **int** | Number of results also matching with_note / with_flag / with_interpretation; equal to count when none is set | [optional] 

## Example

```python
from radiant_python.models.occurrence_count import OccurrenceCount

# TODO update the JSON string below
json = "{}"
# create an instance of OccurrenceCount from a JSON string
occurrence_count_instance = OccurrenceCount.from_json(json)
# print the JSON string representation of the object
print(OccurrenceCount.to_json())

# convert the object into a dict
occurrence_count_dict = occurrence_count_instance.to_dict()
# create an instance of OccurrenceCount from a dict
occurrence_count_from_dict = OccurrenceCount.from_dict(occurrence_count_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


