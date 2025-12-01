# ColumnPinningConfig


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**left** | **List[str]** |  | [optional] 
**right** | **List[str]** |  | [optional] 

## Example

```python
from radiant_python.models.column_pinning_config import ColumnPinningConfig

# TODO update the JSON string below
json = "{}"
# create an instance of ColumnPinningConfig from a JSON string
column_pinning_config_instance = ColumnPinningConfig.from_json(json)
# print the JSON string representation of the object
print(ColumnPinningConfig.to_json())

# convert the object into a dict
column_pinning_config_dict = column_pinning_config_instance.to_dict()
# create an instance of ColumnPinningConfig from a dict
column_pinning_config_from_dict = ColumnPinningConfig.from_dict(column_pinning_config_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


