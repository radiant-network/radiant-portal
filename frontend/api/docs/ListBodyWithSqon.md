# ListBodyWithSqon

Body of a list request

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**additional_fields** | **Array&lt;string&gt;** |  | [optional] [default to undefined]
**limit** | **number** |  | [optional] [default to undefined]
**offset** | **number** |  | [optional] [default to undefined]
**page_index** | **number** |  | [optional] [default to undefined]
**sort** | [**Array&lt;SortBody&gt;**](SortBody.md) |  | [optional] [default to undefined]
**sqon** | [**Sqon**](Sqon.md) |  | [optional] [default to undefined]

## Example

```typescript
import { ListBodyWithSqon } from './api';

const instance: ListBodyWithSqon = {
    additional_fields,
    limit,
    offset,
    page_index,
    sort,
    sqon,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
