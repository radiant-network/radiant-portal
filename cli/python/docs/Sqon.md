# Sqon


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**content** | [**SqonContent**](SqonContent.md) |  | [optional] 
**id** | **str** |  | [optional] 
**op** | **str** |  | [optional] 

## Example

```python
from openapi_client.models.sqon import Sqon

# TODO update the JSON string below
json = "{}"
# create an instance of Sqon from a JSON string
sqon_instance = Sqon.from_json(json)
# print the JSON string representation of the object
print(Sqon.to_json())

# convert the object into a dict
sqon_dict = sqon_instance.to_dict()
# create an instance of Sqon from a dict
sqon_from_dict = Sqon.from_dict(sqon_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


