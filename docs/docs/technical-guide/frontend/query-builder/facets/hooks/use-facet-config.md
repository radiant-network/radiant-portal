# use-facet-config

Provider that keep builder and statistics fetcher in memory. 

```typescript
type FacetListContextProps = {
  appId: ApplicationId;
  builderFetcher: (params: IAggregationBuilder) => any;
  statisticFetcher: (params: IAggregationBuilder) => any;
};
```