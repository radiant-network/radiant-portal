# use-saved-filters

Provide context and reducer for saved filters of a [query-builder](../index.md).

```typescript
interface ISavedFilterContextProps {
  savedFilterType: SavedFilterType;
  savedFilters: SavedFilter[];
  selectedSavedFilter?: SavedFilter;
  isUnsaved?: boolean; // true when current sqons differ from selected filter
}
```

## Actions (`SavedFiltersActionType`)

- `SET_SELECTED` — change the selected filter (resets `isUnsaved`)
- `SAVE` — refresh `savedFilters` and select one
- `SET_IS_UNSAVED` — flag dirty state
- `DELETE` — refresh list after a delete

## Hooks

- `useSavedFiltersContext()` — read state
- `useSavedFiltersDispatch()` — dispatch actions
- `useSavedFilterGetPreferenceEffect()` — load last selected filter from user-preference
- `useSavedFiltersUpdatePreferenceEffect()` — persist selection (debounced 350 ms)
