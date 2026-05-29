# sqon

Helpers to inspect and build sqon objects.

- `isSet(value)` — value contains a `set_id:` reference
- `isCombinedQuery(sqon)` — sqon content is an array (combined queries case)
- `isBoolean(sqon)` — every value is `true`/`false`
- `isRange(valueFacet)` — op is in `RangeOperators` (excluding `In`)
- `isSearchField(valueFacet, aggregations)` — field matches a `search_by_*` aggregation
- `isEqualToField(sqon, field)` — content field equals the given value
- `createEmptyQuery()` — new empty `and` query with a fresh `uuid`
- `isSqonEmpty(sqon)` / `isQueryEmpty(sqons)` / `hasEmptyQuery(sqons)`
- `deepSqonsEqual(a, b)` — deep, order-insensitive equality
