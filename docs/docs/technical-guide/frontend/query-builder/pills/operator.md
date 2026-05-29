# operator

Factory that returns the icon matching a [SqonOpEnum](../type/SqonOpEnum.api.md) (`>`, `<`, `>=`, `<=`, `between`, `not-in`, fallback `=`).

![operator-query-pill](../assets/operator-query-pill.jpg)

## Props

```typescript
type OperatorQueryPillProps = {
  size?: number;
  type?: SqonOpEnum | (string & {});
  className?: string;
};
```
