# UpdateCaseBatchBody


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**cases** | [**List[UpdateCaseBatch]**](UpdateCaseBatch.md) |  | 

## Example

```python
from radiant_python.models.update_case_batch_body import UpdateCaseBatchBody

# TODO update the JSON string below
json = "{}"
# create an instance of UpdateCaseBatchBody from a JSON string
update_case_batch_body_instance = UpdateCaseBatchBody.from_json(json)
# print the JSON string representation of the object
print(UpdateCaseBatchBody.to_json())

# convert the object into a dict
update_case_batch_body_dict = update_case_batch_body_instance.to_dict()
# create an instance of UpdateCaseBatchBody from a dict
update_case_batch_body_from_dict = UpdateCaseBatchBody.from_dict(update_case_batch_body_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


