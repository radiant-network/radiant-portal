# ISyntheticSqon

Related to [TSqonGroupOp](TSqonGroupOp.md), [TSyntheticSqonContent](TSyntheticSqonContent.md)

```typescript
export interface ISyntheticSqon {
  op: TSqonGroupOp; // "and", "or", "not"
  content: TSyntheticSqonContent;
  id: string;
  title?: string;
}

```