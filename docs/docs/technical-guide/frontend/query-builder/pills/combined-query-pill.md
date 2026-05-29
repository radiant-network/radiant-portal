# combined-query-pill

Pill rendered inside a query that combines other queries (e.g. `Q1 and Q2`). Shows the source query label (`Q1`, `Q2`, ...) colored from `getColorByIndex`.

## Props

```typescript
type CombinedQueryProps = {
  uuid: string;
  sqon: ISyntheticSqon;
};
```
