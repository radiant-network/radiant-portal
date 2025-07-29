# Table

Data-Table and Display-Table have been build with [tanstack headless ui](https://tanstack.com/table/latest).



## Creating and managing cells

Beside some specific case, a cell should been create inside `components/base/data-table/cells`. The goal of this approach is to prioritize re-usability.

If a cell is dependent to application specific component, it should be placed inside `apps/{application}/src/components/{feature}/cells`

e.g. `InterpretationCell` needs `InterpretationDialog` to works, a component unique to case-entity/variant-tab. 



### Storybook

Every new cell should be place inside data-table storybook. The goal is always to prioritize reusability.