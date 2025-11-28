# AggregationBodyWithSqon


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**var_field** | **str** |  | [optional] 
**size** | **int** |  | [optional] 
**sqon** | [**Sqon**](Sqon.md) |  | [optional] 

## Example

```python
from openapi_client.models.aggregation_body_with_sqon import AggregationBodyWithSqon

# TODO update the JSON string below
json = "{}"
# create an instance of AggregationBodyWithSqon from a JSON string
aggregation_body_with_sqon_instance = AggregationBodyWithSqon.from_json(json)
# print the JSON string representation of the object
print(AggregationBodyWithSqon.to_json())

# convert the object into a dict
aggregation_body_with_sqon_dict = aggregation_body_with_sqon_instance.to_dict()
# create an instance of AggregationBodyWithSqon from a dict
aggregation_body_with_sqon_from_dict = AggregationBodyWithSqon.from_dict(aggregation_body_with_sqon_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


