# QueryBuilder

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

