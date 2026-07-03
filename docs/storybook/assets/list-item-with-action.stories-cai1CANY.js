import{j as t}from"./iframe-Clj-cmbv.js";import{L as i,a as s}from"./list-item-with-action-BgDHeYU_.js";import{a as n}from"./story-section-DCzIVbFj.js";import"./preload-helper-PPVm8Dsz.js";import"./button-CpjCmLUP.js";import"./action-button-B-B5BuJQ.js";import"./dropdown-menu-D1F9T0ri.js";import"./index-LQNM7kie.js";import"./index-DujBfDZp.js";import"./check-DR5_QgnI.js";import"./circle-RCbrrEpe.js";import"./separator-BkoI8fxB.js";import"./i18n-CteUV2dW.js";import"./index-BRQotc69.js";import"./conditional-wrapper-BBX8pIPQ.js";import"./pen-b3GUHbfv.js";const{action:e}=__STORYBOOK_MODULE_ACTIONS__,f={title:"Components/Lists/List Item With Action",component:i,args:{onEdit:e("onEdit"),onDelete:e("onDelete"),onShare:e("onShare"),onClick:e("onClick")}},r={args:{title:"Title",description:"Description"},render:o=>t.jsx(n,{title:"List item with action",children:t.jsx("div",{className:"min-w-[450px]",children:t.jsxs(s,{bordered:!0,children:[t.jsx(i,{...o}),t.jsx(i,{...o}),t.jsx(i,{...o}),t.jsx(i,{...o})]})})})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
