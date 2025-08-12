# Table

Data-Table and Display-Table have been build with [tanstack headless ui](https://tanstack.com/table/latest).



## Creating and managing cells

Beside some specific case, a cell should been create inside `components/base/data-table/cells`. The goal of this approach is to prioritize re-usability.

If a cell is dependent to application specific component, it should be placed inside `apps/{application}/src/components/{feature}/cells`

e.g. `InterpretationCell` needs `InterpretationDialog` to works, a component unique to case-entity/variant-tab. 



## Always add an attraction layer when using a basic component

If the cell is only a basic component, you should still create an cell component equivalent to manage the `EmptyCell` state or state specific related to the table. 

```typescript
// affected-status-badge-cell.tsx
import AffectedStatusBadge, { AffectedStatusBadgeProps } from '../../badges/affected-status-badge';
import EmptyCell from './empty-cell';

function AffectedStatusCell({ status, ...props }: AffectedStatusBadgeProps) {
  if (!status) return <EmptyCell />;
  return <AffectedStatusBadge status={status} {...props} />;
}

export default AffectedStatusCell;

// affected-status-badge.tsx
import AffectedStatusBadge, { AffectedStatusBadgeProps } from '../../badges/affected-status-badge';
import EmptyCell from './empty-cell';

function AffectedStatusCell({ status, ...props }: AffectedStatusBadgeProps) {
  if (!status) return <EmptyCell />;
  return <AffectedStatusBadge status={status} {...props} />;
}

export default AffectedStatusCell;

```



### Storybook

Every new cell should be place inside data-table storybook. The goal is always to prioritize re-usability. 

See [Storybook Documentation](./storybook.md)