# aggregations

Helpers around `AggregationConfig`.

- `getVisibleAggregations(aggregationGroups)` — strips items with `facetHidden: true` and drops empty groups
- `getAggregationByField(aggregations, field)` — flat lookup of an aggregation by its `key`
- `isValidRangeOperator(value)` — type guard for `RangeOperators`
