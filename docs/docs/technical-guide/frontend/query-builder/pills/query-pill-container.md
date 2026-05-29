# query-pill-container

Visual wrapper for any query pill. Highlight when the parent query is selected and manage query pill deletions.

![query-pill-container](../assets/query-pill-container.png)

## Props

```typescript
type QueryPillContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  onRemovePill: () => void;
};
```
