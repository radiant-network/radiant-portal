# QueryBuilder

**Note: The QueryBuilder implementation was inspired by Tanstack Table. The concepts are the same.**

The QueryBuilder is built as a headless UI component. The headless portion of the query builder can be found under `model/query-builder`.

Headless means there is no UI, only the logic required to manage the query builder state (queries, saved filters, create query, delete query, etc.).

## Why No UI?

By decoupling the UI from the core logic, it becomes easier to test all business logic and allows us to build any kind of UI for the query builder.

## The UI

Under `feature/query-builder`, you can find the UI portion of the query builder, which uses the headless logic.

## Main Concepts

- **QueryBuilder State**: This is where we store all dynamic properties that a user or the application can modify after the initial render.
- **QueryBuilder Core Props**: Core props are the essential, usually stable inputs required to define the QueryBuilder itself. These values typically do not change frequently during the QueryBuilder’s lifecycle. If they do change, they are managed externally and passed down as stable references.
- **cores/query-builder/query-builder**: Contains the code to create and instantiate a QueryBuilder object. This query builder object contains everything required to manage the QueryBuilder state (callbacks, queries, saved filters, etc.).
- **cores/query-builder/saved-filter**: Contains the code to create and instantiate a SavedFilter object. This is used by the QueryBuilder instance.
  - **SavedFilter Instance**: The object that exposes functions to manage a SavedFilter.
  - **SavedFilter Raw**: The raw JSON object representing a saved filter (what we save in the database).
- **cores/query-builder/query**: Contains the code to create and instantiate a Query object. This is used by the QueryBuilder and SavedFilter instances.
  - **Query Instance**: The object that exposes functions to manage a Query.
  - **Query Raw**: The raw JSON object representing a query (what we save in the database).
- **cores/query-builder/use-query-builder**: This is the entry point for using the query builder. It is used to instantiate a new QueryBuilder, initialize the query builder state, set the initial core props values, and set up listeners for the QueryBuilder remote.
- **cores/query-builder/query-builder-remote**: The QueryBuilder remote is used to modify, update, and interact with an existing QueryBuilder from anywhere in the application. How does it work? Every remote utility function requires a `queryBuilderId` and dispatches a `QUERY_BUILDER_STATE` event. These events are listened to by the `useQueryBuilder` hook mentioned above.

## Important

All modules under `model/query-builder-core/*` should never be coupled with data fetching. Remember, this is a headless UI component. It manages the state of the query builder but does not and should not know anything about how data is fetched. Data fetching is the responsibility of the parent component using the query builder.

A good example can be found in `entity/variant-tab`. We fetch the data for the variant table and then update the state of the query builder.

## Saved Filters

The QueryBuilder exposes several callbacks for saved filters so you can manage them. The following callbacks are available:

- `onSavedFilterDelete`: Called when a saved filter is deleted
- `onSavedFilterCreate`: Called when a new saved filter is created
- `onSavedFilterSave`: Called when a saved filter is saved (new filter)
- `onSavedFilterUpdate`: Called when a saved filter is updated (existing filter)

These props allow the `QueryBuilder` to manage custom filters when needed. However, to prevent repetitive code every time the `QueryBuilder` is used, you can use the global `feature/query-builder/user-saved-filters` module to manage all common cases for saved filters.

For more specific interactions with saved filters, see `model/query-builder-core/saved-filter`.

## Queries

The QueryBuilder exposes several callbacks for queries so you can manage them. The following callbacks are available:

- `onQueryCreate`: Called when a query is created
- `onQueryUpdate`: Called when a query is updated (existing query)
- `onQueryDelete`: Called when a query is deleted

## How to Use the QueryBuilder in the UI

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
const queries = queryBuilder.getQueries(); // Returns all query instances currently in the QueryBuilder state
const rawQueries = queryBuilder.getRawQueries(); // Returns all raw JSON queries currently in the QueryBuilder state
const savedFilters = queryBuilder.getSavedFilters(); // Returns all saved filter instances

// Queries -> See model/query-builder-core/query.ts for all available functions
const firstQuery = queries[0].raw(); // Returns the raw JSON query
firstQuery.toggleSelect(true); // Sets the query as the active query

// SavedFilters -> See model/query-builder-core/saved-filter.ts for all available functions
const firstSavedFilter = savedFilters[0].raw(); // Returns the raw JSON saved filter
const firstSavedFilterQueries = firstSavedFilter.getQueries(); // Returns the query instances of the saved filter
```

## How SavedFilter Selection Works

An important thing to understand is how we determine which saved filter is currently selected in the QueryBuilder.

To determine which saved filter is currently selected, we use the `activeQueryId`. Every query MUST have a unique `ID` (this is all managed by the core code). This is important because we use this `ID` to check the list of queries within each saved filter. If this `ID` exists in the list, we consider that saved filter as selected.

If the `ID` does not exist in any list of queries across all saved filters, then we consider the saved filter as a new “Unsaved” filter.

## What Is the Difference Between `ISavedFilter` and `IUserSavedFilter`?

### `ISavedFilter`

`ISavedFilter` is the unsaved version of a saved filter, meaning there is no user and no create/update date associated with it.

```json
{
  "name": "Untitled filter",
  "queries": [
    {
      "id": "aaa2a2a2-aaaa-2222-22aa-aa22aa2aa2aa",
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
  "type": "germline_snv_occurrence"
}
```

### `IUserSavedFilter`

`IUserSavedFilter` is the saved version of a saved filter, meaning there is a user and create/update dates associated with it.

```json
{
  "id": "aaa2a2a2-aaaa-2222-22aa-aa22aa2aa2aa",
  "user_id": "x1xx1111-1x1x-1x1x-xxxx-111xx11111x1",
  "name": "Untitled filter",
  "type": "germline_snv_occurrence",
  "favorite": false,
  "queries": [
    {
      "id": "aaa2a2a2-aaaa-2222-22aa-aa22aa2aa2aa",
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
- **Facets (filters)**: Facets are external components that interact with the `QueryBuilder`. The list of facets for a page is generated through an [ApplicationConfig](./application-config.md) file.