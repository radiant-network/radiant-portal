import{j as t}from"./iframe-CuWpm1qa.js";import{L as i,a as s}from"./list-item-with-action-CI0kDbup.js";import{a as n}from"./story-section-w3-NF7Xp.js";import"./preload-helper-PPVm8Dsz.js";import"./button-CSz6EV4E.js";import"./action-button-lN5zPVbm.js";import"./dropdown-menu-BOERjw4c.js";import"./index-Dmb4mQ0b.js";import"./index-CJQJWHRc.js";import"./check-j36eKSHy.js";import"./circle-Dfldtqa6.js";import"./separator-BEF1T6M0.js";import"./i18n-Dk4pliQz.js";import"./index-8BZx1Yb8.js";import"./conditional-wrapper-BBX8pIPQ.js";import"./pen-B0RRo4Ye.js";const{action:e}=__STORYBOOK_MODULE_ACTIONS__,f={title:"Components/Lists/List Item With Action",component:i,args:{onEdit:e("onEdit"),onDelete:e("onDelete"),onShare:e("onShare"),onClick:e("onClick")}},r={args:{title:"Title",description:"Description"},render:o=>t.jsx(n,{title:"List item with action",children:t.jsx("div",{className:"min-w-[450px]",children:t.jsxs(s,{bordered:!0,children:[t.jsx(i,{...o}),t.jsx(i,{...o}),t.jsx(i,{...o}),t.jsx(i,{...o})]})})})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
