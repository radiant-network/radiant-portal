# QueryBuilder
## Main Concept

Query builder use a shared instance to be used and updated by other components. The component use a model/feature separation. See `feature/query-builder` to edit the visual and check `model/query-builder` for the logic and data management.

 - `model/query-builder-core/use-query-builder`
   Hook that initialize coreProps, event listener and everything that the query-builder need to works. 
 - `model/query-builder-core/query-builder`
   Contains query-builder state and contains core features (create filter, callback for query change and filter change). What the query-builder should do.
 - `model/query-builder-core/query-builder-remote`
   Manage query builder cache and local storage (latest user query etc.)
 - `model/query-builder-core/saved-filters`
   Contains every core feature for saved-filter instance (copy, duplicate, delete etc.). We directly call the saved-filter for certain case, like copy, to copy itself and create a new uuid.




## Data Fetching
Data fetching should be parent component of QueryBuilder.
`e.g. entity/variant-tab use query-builder, we fetch the data in variant-tab.`

```typescript
const [isQBLoading, setQbLoading] = useState(true);  
const [isQBInitialized, setQBInitialized] = useState(false);

useEffect(() => {
    if (isQBInitialized) return;

    getUserSavedFilters({
      savedFilterType: SavedFilterType.GERMLINE_SNV_OCCURRENCE,
    }).then(res => {
      const localQbState = queryBuilderRemote.getLocalQueryBuilderState(appId);

      setQbState({
        ...localQbState,
        savedFilters: res,
        selectedQueryIndexes: [0],
      });
      setActiveSqon(queryBuilderRemote.getResolvedActiveQuery(appId) as Sqon);
      setQBInitialized(true);
    });
}, [isQBInitialized]);
```



## SavedFilters

SavedFilters can be fetched, created, updated and deleted by passing the following props to `QueryBuilder`:
- `onSavedFilterFetch`
- `onSavedFilterSave`
- `onSavedFilterDelete` 
- `onSavedFilterUpdate` 

Those props allow the `QueryBuilder` to manage some customs filters if needed. But to prevent to copy-paste the same props everytime the `QueryBuilder` is used, you use the global `feature/query-builder/user-saved-filters` to manage all the common case for savedFilters.

For more specific interaction with saved-filter, see `model/query-builder-core/saved-filter`.



### Synching API and locale user data

When saving a filter, the front-end creates a unique UUID to be register by the APIs. 
It also create a locale storage to save the latest used filter and selected query.

```json
{
  "name": "Untitled filter", // Filter name
  "queries": [
    {
      "id": "aaa2a2a2-aaaa-2222-22aa-aa22aa2aa2aa", // UUID created in frontend
      "op": "and",
      "content": [ 
        {
          "content": {
            "field": "variant_class",
            "value": [
              "class1"
            ]
          },
          "op": "in"
        }
      ]
    }
  ],
  "type": "germline_snv_occurrence" // filter type, defined by a props when using <QueryBuilder>
}

```

e.g. API response when fetching filters. 
The main difference is from the field `user_id`. Since an user can share a field, we needs the `user_id` to retrieve the shared filter.

```json
{
    "id": "aaa2a2a2-aaaa-2222-22aa-aa22aa2aa2aa", // filter UUID
    "user_id": "x1xx1111-1x1x-1x1x-xxxx-111xx11111x1", // who created the filter
    "name": "Untitled filter",
    "type": "germline_snv_occurrence",
    "favorite": false, // if the user has set this filter as favorite
    "queries": [
        {
            "id": "aaa2a2a2-aaaa-2222-22aa-aa22aa2aa2aa", // query UUID 
            "op": "and",
            "content": [
                {
                    "op": "in",
                    "content": {
                        "field": "variant_class",
                        "value": [
                            "class1"
                        ]
                    }
                }
            ]
        }
    ],
    "created_on": "2025-10-02T18:50:11.142502Z",
    "updated_on": "2025-10-02T18:50:11.142502Z"
}
```



## QueryPillValues and translation

See [translation.md](./translation.md) for more informations.

If a translation doesn't exist, a simple default value is displayed. This default value created with a regular expression.

```typescript
// query-pill-values.tsx
t(
  `common.filters.labels.${valueFilter.content.field}_value.${val}`,
  { defaultValue: replaceUnderscore(String(val)).toLowerCase().replace(/^\w/, c => c.toUpperCase()) }
)
```

