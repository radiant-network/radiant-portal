# QueryBuilder

_\*\* Note: The QueryBuilder implementation was inspired of how Tanstack Table is made. The concepts are the same_

The QueryBuilder was built as a headless UI component. The headless portion of the query builder can be found under `model/query-builder`.

Headless means there is no UI. There's only all the logic required to manage the query builder state (queries, saved filters, create query, delete query, etc).

### Why no UI?

By decoupling the UI and the core logic, its not only easier to test all the business logic but also allow us to build any kind of UI for the query builder.

### The UI

Under `feature/query-builder`, you can find the UI portion of the query builder which is using the headless logic.

### Main Concepts

- `QueryBuilder State`: This is where we store all dynamic properties that a user or the application can modify after the initial render.

- `QueryBuilder Core Props`: Core props are the essential, usually stable, inputs required to define the QueryBuilder itself. These values typically do not change frequently during the QueryBuilder's lifecycle, or if they do, they are managed externally and passed down as stable references.

- `model/query-builder-core/query-builder`: Contains the code to create/instantiate a QueryBuilder object. This query builder object contains everything required to manage queryBuilder state (callbacks, queries, saved filters, etc.)

- `model/query-builder-core/saved-filter`: Contains the code to create/instantiate a SavedFilter object. This is used by the QueryBuilder instance.

  - SavedFilter Instance: Is the object that expose functions to manage a SavedFilter
  - SavedFilter Raw: Is the raw json object representing a saved filter (what we save in the DB)

- `model/query-builder-core/query`: Contains the code to create/instantiate a Query object. This is used by the QueryBuilder and SaveFilter instance.

  - Query Instance: Is the object that expose functions to manage a Query
  - Query Raw: Is the raw json object representing a query (what we save in the DB)

- `model/query-builder-core/use-query-builder`: The is the entrance point for using the query builder. Its used to instantiate a new Querybuilder, initialize the query builder state, set the initial core props value and setup some listeners for the QueryBuilder remote.

- `model/query-builder-core/query-builder-remote`: the QueryBuilder remote is used to modify/update/interact with an existing QueryBuilder from anywhere is the application. How does it work? Every remote utility functions requires a `queryBuilderId` and dispatch a `QUERY_BUILDER_STATE` event. These events are listen to by the `useQueryBuilder` above.

### Important

All `model/query-builder-core/*` should never be coupled with data fetching. Remember this is a header ui component. It manage the state of the query builder but it doesnt and shouldn't know anything about how the data is fetched. Its the responsability of the parent component using the query builder.

A good example is in `entity/variant-tab`. We fetch the data for the variant table and then we update the state of the query builder.

## SavedFilters

The queryBuilder expose a couple on callbacks for saved filters so you can manage them. The following callbacks are available

- `onSavedFilterDelete`: Called when a saved filter is deleted
- `onSavedFilterCreate`: Called when a new saved filter is created
- `onSavedFilterSave`: Called when a saved filter is saved (is new)
- `onSavedFilterUpdate`: Called when a saved filter is saved (already exists)

Those props allow the `QueryBuilder` to manage some customs filters if needed. But to prevent to copy-paste the same props everytime the `QueryBuilder` is used, you use the global `feature/query-builder/user-saved-filters` to manage all the common case for savedFilters.

For more specific interaction with saved-filter, see `model/query-builder-core/saved-filter`.

## Queries

The queryBuilder expose a couple on callbacks for queries so you can manage them. The following callbacks are available:

- `onQueryCreate`: Called when a query is created
- `onQueryUpdate`: Called when a query is saved (existing query)
- `onQueryDelete`: Called when a query is deleted

## How to use the QueryBuilder in the UI

```typescript
const queryBuilder = useQueryBuilder({
  id: "my-query-builder",
  state: {
    activeQueryId: "123",
    queries: [],
    savedFilters: [],
    selectedQueryIndexes: [],
  },
});

// QueryBuilder -> See model/query-builder-core/query-builder.ts for all available functions
const queries = queryBuilder.getQueries(); // Returns all query instances currently in the QB state
const rawQueries = queryBuilder.getRawQueries(); // Returns all raw Json query currently in the QB state
const savedFilters = queryBuilder.getSavedFilters(); // Returns all saved filter instances

// Queries -> See model/query-builder-core/query.ts for all available functions
const firstQuery = queries[0].raw(); // Return the raw Json query
firstQuery.toggleSelect(true); // Set the query as the active query

// SavedFilters -> See model/query-builder-core/saved-filter.ts for all available functions
const firstSavedFilter = savedFilters[0].raw(); // Return the raw Json saved filter
const firstSavedFilterQueries = firstSavedFilter.getQueries(); // Return the query instances of the saved filter
```

## How does SavedFilter selection works

An important thing to understand is how we know which saved filter is currently selected in the QueryBuilder.

To know which saved filter is currently selected, we use the `activeQueryId`. Every query MUST have a different `ID` (This is all managed by the core code). This is important because we use this `ID` to check the list of queries of a saved filter and if this `ID` exists in the list, we consider this saved filter as selected.

If the `ID` doesnt exists in any list of queries of all saved filter, then we consider the saved filter as a new "Unsaved" filter.

## What the difference between `ISavedFilter` and `IUserSavedFilter`

### `ISavedFilter`

`ISavedFilter` is the `unsaved` version of a saved filter, meaning there is no user and no create/update date associated with it.

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
            "value": ["class1"]
          },
          "op": "in"
        }
      ]
    }
  ],
  "type": "germline_snv_occurrence" // filter type, defined by a props when using <QueryBuilder>
}
```

### `IUserSavedFilter`

`IUserSavedFilter` is the `saved` version of a saved filter, meaning there is a user and create/update date associated with it.

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
            "value": ["class1"]
          }
        }
      ]
    }
  ],
  "created_on": "2025-10-02T18:50:11.142502Z",
  "updated_on": "2025-10-02T18:50:11.142502Z"
}
```

## Related Components

- [Table](./table.md)
- Facets (filters): Facets are external component that interact with the `QueryBuilder`. The list of facets for a page is generated through an [ApplicationConfig](./application-config.md) file.
