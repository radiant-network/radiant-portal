# BatchReport


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**error** | [**List[BatchMessage]**](BatchMessage.md) |  | [optional] 
**info** | [**List[BatchMessage]**](BatchMessage.md) |  | [optional] 
**warn** | [**List[BatchMessage]**](BatchMessage.md) |  | [optional] 

## Example

```python
from radiant_python.models.batch_report import BatchReport

# TODO update the JSON string below
json = "{}"
# create an instance of BatchReport from a JSON string
batch_report_instance = BatchReport.from_json(json)
# print the JSON string representation of the object
print(BatchReport.to_json())

# convert the object into a dict
batch_report_dict = batch_report_instance.to_dict()
# create an instance of BatchReport from a dict
batch_report_from_dict = BatchReport.from_dict(batch_report_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


