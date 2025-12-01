# TableConfig


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**column_order** | **List[str]** |  | [optional] 
**column_pinning** | [**ColumnPinningConfig**](ColumnPinningConfig.md) |  | [optional] 
**column_sizing** | **Dict[str, int]** |  | [optional] 
**column_visibility** | **Dict[str, bool]** |  | [optional] 
**pagination** | [**PaginationConfig**](PaginationConfig.md) |  | [optional] 

## Example

```python
from radiant_python.models.table_config import TableConfig

# TODO update the JSON string below
json = "{}"
# create an instance of TableConfig from a JSON string
table_config_instance = TableConfig.from_json(json)
# print the JSON string representation of the object
print(TableConfig.to_json())

# convert the object into a dict
table_config_dict = table_config_instance.to_dict()
# create an instance of TableConfig from a dict
table_config_from_dict = TableConfig.from_dict(table_config_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


