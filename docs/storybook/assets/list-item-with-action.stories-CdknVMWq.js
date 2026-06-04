import{j as t}from"./iframe-C_PWKKnV.js";import{L as i,a as s}from"./list-item-with-action-IeAUIYMJ.js";import{a as n}from"./story-section-CfmadKEP.js";import"./preload-helper-PPVm8Dsz.js";import"./button-4T5xrZWi.js";import"./index-uHTs5ds7.js";import"./action-button-BwT2quuH.js";import"./dropdown-menu-CrzQycMh.js";import"./index-DYLnjilj.js";import"./index-DRcjtbHr.js";import"./check-clqCtUO9.js";import"./circle-D7Nufxf-.js";import"./separator-C7JFg-YV.js";import"./i18n-4DRFLHh0.js";import"./index-pWOEJb2O.js";import"./conditional-wrapper-BBX8pIPQ.js";import"./pen-DFevG5A5.js";const{action:e}=__STORYBOOK_MODULE_ACTIONS__,g={title:"Components/Lists/List Item With Action",component:i,args:{onEdit:e("onEdit"),onDelete:e("onDelete"),onShare:e("onShare"),onClick:e("onClick")}},r={args:{title:"Title",description:"Description"},render:o=>t.jsx(n,{title:"List item with action",children:t.jsx("div",{className:"min-w-[450px]",children:t.jsxs(s,{bordered:!0,children:[t.jsx(i,{...o}),t.jsx(i,{...o}),t.jsx(i,{...o}),t.jsx(i,{...o})]})})})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
