# search-facet

Async search facet rendered as a `MultiSelector` with autocomplete. Used for `FilterTypes.SEARCH_BY` aggregations.

- `field.key` is normalized by stripping the `search_by_` prefix before dispatching
- Autocomplete and label resolution are currently backed by `genesApi.geneAutoComplete`

# Config
```json
{
  "key": "search_by_symbol",
  "translation_key": "search_by_symbol",
  "type": "search_by"
}
```
