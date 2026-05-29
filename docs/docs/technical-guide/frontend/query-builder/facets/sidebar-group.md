# sidebar-group

Sidebar (open/close)
Create `AggregationGroup` (variant, gene etc.)

![sidebargroup](../assets/sidebargroup.png)

## Props

```typescript
interface SidebarGroupsProps {
  onItemSelect?: (itemId: string | null) => void;
  selectedItemId?: string | null;
  aggregationGroups: AggregationConfig;
}
```
