# CreateCaseBatchBody


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**cases** | [**List[CaseBatch]**](CaseBatch.md) |  | 

## Example

```python
from radiant_python.models.create_case_batch_body import CreateCaseBatchBody

# TODO update the JSON string below
json = "{}"
# create an instance of CreateCaseBatchBody from a JSON string
create_case_batch_body_instance = CreateCaseBatchBody.from_json(json)
# print the JSON string representation of the object
print(CreateCaseBatchBody.to_json())

# convert the object into a dict
create_case_batch_body_dict = create_case_batch_body_instance.to_dict()
# create an instance of CreateCaseBatchBody from a dict
create_case_batch_body_from_dict = CreateCaseBatchBody.from_dict(create_case_batch_body_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


