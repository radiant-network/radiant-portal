# use-aggregation-builder

Library of all available hooks that will call the aggregation api to build a facet component
[multiselect-facet](../facets/multiselect-facet.md), [numerical-facet](../facets/numerical-facet.md) and [boolean-facet](../facets/boolean-facet.md)

- `useSNVAggregationBuilder`
- `useSNVAggregationStatistics`
- `useCNVAggregationBuilder`
- `useCNVAggregationStatistics`

```typescript
type AggregateContextProps = {
  caseId: number;
  seqId: number;
};
export const AggregateContext = React.createContext<AggregateContextProps>({ caseId: 1, seqId: 1 });
```

