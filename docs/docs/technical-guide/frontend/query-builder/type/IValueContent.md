# IValueContent

Related to [IRemoteComponent](IRemoteComponent.md), [TFacetValue](TFacetValue.md)

```typescript
export interface IValueContent {
  field: string;
  value: TFacetValue; // Array<string | number | boolean>
  index?: string;
  overrideValuesName?: string;
  isUploadedList?: boolean;
  remoteComponent?: IRemoteComponent;
}
```