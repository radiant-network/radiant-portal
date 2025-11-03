# TableConfig


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**columnOrder** | **Array&lt;string&gt;** |  | [optional] [default to undefined]
**columnPinning** | [**ColumnPinningConfig**](ColumnPinningConfig.md) |  | [optional] [default to undefined]
**columnSizing** | **{ [key: string]: number; }** |  | [optional] [default to undefined]
**columnVisibility** | **{ [key: string]: boolean; }** |  | [optional] [default to undefined]
**pagination** | [**PaginationConfig**](PaginationConfig.md) |  | [optional] [default to undefined]

## Example

```typescript
import { TableConfig } from './api';

const instance: TableConfig = {
    columnOrder,
    columnPinning,
    columnSizing,
    columnVisibility,
    pagination,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
