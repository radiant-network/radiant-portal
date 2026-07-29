import{j as t}from"./iframe-Ba5Iybcr.js";import{L as i,a as s}from"./list-item-with-action-CbNT4qBY.js";import{a as n}from"./story-section-5UYrVqPJ.js";import"./preload-helper-PPVm8Dsz.js";import"./button-Pc7aOWRa.js";import"./action-button-BrZzZe-c.js";import"./dropdown-menu-58R_cXZJ.js";import"./index-DB383bCH.js";import"./index-E7Q1ks-D.js";import"./check-C9wVWpMx.js";import"./circle-DwJaPj0_.js";import"./separator-D1idYbj8.js";import"./i18n-Cy0oM3Ki.js";import"./index-FDvGsyLv.js";import"./conditional-wrapper-BBX8pIPQ.js";import"./pen-BVfIJwxc.js";const{action:e}=__STORYBOOK_MODULE_ACTIONS__,f={title:"Components/Lists/List Item With Action",component:i,args:{onEdit:e("onEdit"),onDelete:e("onDelete"),onShare:e("onShare"),onClick:e("onClick")}},r={args:{title:"Title",description:"Description"},render:o=>t.jsx(n,{title:"List item with action",children:t.jsx("div",{className:"min-w-[450px]",children:t.jsxs(s,{bordered:!0,children:[t.jsx(i,{...o}),t.jsx(i,{...o}),t.jsx(i,{...o}),t.jsx(i,{...o})]})})})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    title: 'Title',
    description: 'Description'
  },
  render: args => <StorySection title="List item with action">
      <div className="min-w-[450px]">
        <List bordered>
          <ListItemWithAction {...args} />
          <ListItemWithAction {...args} />
          <ListItemWithAction {...args} />
          <ListItemWithAction {...args} />
        </List>
      </div>
    </StorySection>
}`,...r.parameters?.docs?.source}}};const g=["Default"];export{r as Default,g as __namedExportsOrder,f as default};
