# Statistics

Statistics represents statistics about a column

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**max** | **float** | Max for numeric facet | [optional] 
**min** | **float** | Min for numeric facet | [optional] 
**type** | **str** | To tell UI if it&#39;s an integer or a decimal | [optional] 

## Example

```python
from radiant_python.models.statistics import Statistics

# TODO update the JSON string below
json = "{}"
# create an instance of Statistics from a JSON string
statistics_instance = Statistics.from_json(json)
# print the JSON string representation of the object
print(Statistics.to_json())

# convert the object into a dict
statistics_dict = statistics_instance.to_dict()
# create an instance of Statistics from a dict
statistics_from_dict = Statistics.from_dict(statistics_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


