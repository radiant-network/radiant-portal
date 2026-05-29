# TSqonGroupOp

```typescript
export const BooleanOperators = {
  And: SqonOpEnum.And,
  Or: SqonOpEnum.Or,
  Not: SqonOpEnum.Not,
} as const;
export type BooleanOperators = (typeof BooleanOperators)[keyof typeof BooleanOperators];
export type TSqonGroupOp = BooleanOperators | (string & {});
```