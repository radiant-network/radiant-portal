import{j as t}from"./iframe-DUYxWSE4.js";import{L as i,a as s}from"./list-item-with-action-ofWsa8GI.js";import{a as n}from"./story-section-BP93x530.js";import"./preload-helper-PPVm8Dsz.js";import"./button-BoxscECB.js";import"./action-button-BfqUh_3H.js";import"./dropdown-menu-Dw6dDXhx.js";import"./index-d-V1lAha.js";import"./index-CIzFjBAZ.js";import"./check-CXWDQykU.js";import"./circle-CnzHj9YT.js";import"./separator-BLzsWlgt.js";import"./i18n-DhdwcvPn.js";import"./index-0l6j4kdI.js";import"./conditional-wrapper-BBX8pIPQ.js";import"./pen-C27JG5K9.js";const{action:e}=__STORYBOOK_MODULE_ACTIONS__,f={title:"Components/Lists/List Item With Action",component:i,args:{onEdit:e("onEdit"),onDelete:e("onDelete"),onShare:e("onShare"),onClick:e("onClick")}},r={args:{title:"Title",description:"Description"},render:o=>t.jsx(n,{title:"List item with action",children:t.jsx("div",{className:"min-w-[450px]",children:t.jsxs(s,{bordered:!0,children:[t.jsx(i,{...o}),t.jsx(i,{...o}),t.jsx(i,{...o}),t.jsx(i,{...o})]})})})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
