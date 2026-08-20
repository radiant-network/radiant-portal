import{j as t}from"./iframe-c2IPk3oe.js";import{L as i,a as s}from"./list-item-with-action-0O_HRtHx.js";import{a as n}from"./story-section-CAEPkWC7.js";import"./preload-helper-PPVm8Dsz.js";import"./button-Bjl3P42F.js";import"./action-button-C7Rwv-R7.js";import"./dropdown-menu-abCbWXC_.js";import"./index-BxFSGfgl.js";import"./index-AnShAb8S.js";import"./check-DUGuR0C1.js";import"./circle-RRa7pUsB.js";import"./separator-CC9AvFe8.js";import"./i18n-CfOqn4nZ.js";import"./index-Bk_1Mjxr.js";import"./conditional-wrapper-BBX8pIPQ.js";import"./pen-BplUyOAY.js";const{action:e}=__STORYBOOK_MODULE_ACTIONS__,f={title:"Components/Lists/List Item With Action",component:i,args:{onEdit:e("onEdit"),onDelete:e("onDelete"),onShare:e("onShare"),onClick:e("onClick")}},r={args:{title:"Title",description:"Description"},render:o=>t.jsx(n,{title:"List item with action",children:t.jsx("div",{className:"min-w-[450px]",children:t.jsxs(s,{bordered:!0,children:[t.jsx(i,{...o}),t.jsx(i,{...o}),t.jsx(i,{...o}),t.jsx(i,{...o})]})})})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
