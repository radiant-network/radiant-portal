# Storybook

Our storybook structure take a component approach. Every new components should have his own story. 

```shell
Indicators
- Indicator
- PriorityIndicator
- ImpactIndicator
Buttons
- Button
- ActionButton
...
```

Storybook stories are saved inside

```
frontend/components/stories
```



## Table cell stories

When you needs to add a new table-cell to storybook, you must update `frontend/components/stories/tables/celll-mocks.tsx` to display the new cell. 



## External Links

[Storybook Radiant Portal](https://radiant-network.github.io/radiant-portal)