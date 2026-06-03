import{j as t}from"./iframe-CfiqPze7.js";import{L as i,a as s}from"./list-item-with-action-D_asyONo.js";import{a as n}from"./story-section-DuGdZxO-.js";import"./preload-helper-PPVm8Dsz.js";import"./button-BoXZHvQI.js";import"./index-BZH6fmNO.js";import"./action-button-CCiT5Wq2.js";import"./dropdown-menu-DNmiLd3x.js";import"./index-B4wmxKez.js";import"./index-DPFDfypm.js";import"./check-Dmg2ouYX.js";import"./circle-BQIUCCgT.js";import"./separator-BFc4bAvf.js";import"./i18n-reUsGHBL.js";import"./index-iRVpXJFQ.js";import"./conditional-wrapper-BBX8pIPQ.js";import"./pen-CiTSTYfv.js";const{action:e}=__STORYBOOK_MODULE_ACTIONS__,g={title:"Components/Lists/List Item With Action",component:i,args:{onEdit:e("onEdit"),onDelete:e("onDelete"),onShare:e("onShare"),onClick:e("onClick")}},r={args:{title:"Title",description:"Description"},render:o=>t.jsx(n,{title:"List item with action",children:t.jsx("div",{className:"min-w-[450px]",children:t.jsxs(s,{bordered:!0,children:[t.jsx(i,{...o}),t.jsx(i,{...o}),t.jsx(i,{...o}),t.jsx(i,{...o})]})})})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
}`,...r.parameters?.docs?.source}}};const O=["Default"];export{r as Default,O as __namedExportsOrder,g as default};
