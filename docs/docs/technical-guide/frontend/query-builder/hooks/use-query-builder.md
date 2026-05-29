# use-query-builder

Provide context and reducer for `QueryBuilder`. Context is means to be used in [facet-list](../facets/facet-list.md) and [query-builder](../index.md)

```typescript
export interface IQBContext {
  aggregations: AggregationConfig;
  sqons: ISyntheticSqon[];
  activeQueryId: string;
  fetcher: IQBFetcher;
  history: IHistory;
  settings: ISettings;
  cache: ICache;
}
```

- `aggregations: AggregationConfig` facet data from `application-config`
- `sqons: ISyntheticSqon[]` list of queries created by the user
- `activeQueryId: string` reference to the active query
- `history: IHistory` a serialized version of a user action (uuid, type and target), use to update remote component when value is changed. Easir to check the uuid changes to update the component
- `settings: ISettings` query builder settings like show/hide label from query pill etc, list of combined query with is referenced query
- `cache: ICache` transient state — currently holds `selectedQueries: string[]` (queries checked for combination)

## Combined Queries

Combined queries are keeped in memory through an object of type `Record<string, string[]>`
where `string` is the uuid of the combined query and `string[]` is the list of of the queries used to create the combined query.

```typescript
settings: {
	combinedQueries: { "abc": ["def", "hij"] }
}
```

`abc`: the uuid of the combined query
`def` and `hij` are the selected query's uuid used to create `abc`

When a new combined query is created, a new "hidden" sqon is added to sqons. This sqon is used to request the api. 

When the "original" sqon is edited, those copies are also updated to reflect the changes.

:::info[why not use a reference instead of a copied object?]

Using reference is not supported by the api. So we would have to added the original query before making the call. That why we directly save and update them in the memory instead of have some parser before sending data to the api

:::

```json
{
    "id": "872937a2-c57b-4f4e-bfc5-a72a72b5a718",
    "content": [
        {
            "content": [
                {
                    "content": {
                        "field": "variant_class",
                        "value": [
                            "SNV"
                        ]
                    },
                    "op": "in"
                }
            ],
            "id": "d926c5b3-a874-4712-a6b4-a3ad1ef4a401",
            "op": "and"
        },
        {
            "content": [
                {
                    "content": {
                        "field": "consequence",
                        "value": [
                            "intron_variant"
                        ]
                    },
                    "op": "in"
                }
            ],
            "id": "364a415b-de7a-4840-a243-82cd1a356364",
            "op": "and"
        }
    ],
    "op": "and"
}
```
