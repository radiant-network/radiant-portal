# query-builder-data-table

Wrapper for `data-table` component

Use `fetcher` props automate list and count fetching

```typescript 
fetcher={{
  list: async (params: IListInput) =>
	occurrencesApi.listGermlineSNVOccurrences(caseId, seqId, params.listBody).then(response => response.data),
  count: async (params: ICountInput) =>
	occurrencesApi.countGermlineSNVOccurrences(caseId, seqId, params.countBody).then(response => response.data),
}}

```
