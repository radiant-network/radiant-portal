import{j as t}from"./iframe-D78160ma.js";import{L as i,a as s}from"./list-item-with-action-CDIAYdst.js";import{a as n}from"./story-section-CJRHUJpZ.js";import"./preload-helper-PPVm8Dsz.js";import"./button-D31B_Gsf.js";import"./action-button-CXmwuvNv.js";import"./dropdown-menu-CFr9nLu7.js";import"./index-E6EEG8_q.js";import"./index-BJO3_Py_.js";import"./check-Dz-4uiGV.js";import"./circle-DO4DQqF4.js";import"./separator-C2Q6CsId.js";import"./i18n-BrjiU_bT.js";import"./index-BSsmB6Hv.js";import"./conditional-wrapper-BBX8pIPQ.js";import"./pen-DDY_HITG.js";const{action:e}=__STORYBOOK_MODULE_ACTIONS__,f={title:"Components/Lists/List Item With Action",component:i,args:{onEdit:e("onEdit"),onDelete:e("onDelete"),onShare:e("onShare"),onClick:e("onClick")}},r={args:{title:"Title",description:"Description"},render:o=>t.jsx(n,{title:"List item with action",children:t.jsx("div",{className:"min-w-[450px]",children:t.jsxs(s,{bordered:!0,children:[t.jsx(i,{...o}),t.jsx(i,{...o}),t.jsx(i,{...o}),t.jsx(i,{...o})]})})})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
