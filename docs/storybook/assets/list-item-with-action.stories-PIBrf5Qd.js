import{j as t}from"./iframe-CgYzld9M.js";import{L as i,a as s}from"./list-item-with-action-CbCFQV9z.js";import"./preload-helper-PPVm8Dsz.js";import"./button-BB6JTV7B.js";import"./index-0Ui6iiVS.js";import"./action-button-Dd50ZnSl.js";import"./dropdown-menu-CCEHsgQp.js";import"./index-D5qyD-5a.js";import"./index-CPRKa62s.js";import"./check-DrnC7o8K.js";import"./circle-BJPs1Iry.js";import"./separator-BXAAQkGD.js";import"./i18n-BhtfqN2W.js";import"./index-BJLMTLPT.js";import"./conditional-wrapper-BBX8pIPQ.js";import"./pen-Mmyn6fpH.js";const{action:e}=__STORYBOOK_MODULE_ACTIONS__,A={title:"Lists/ListItem with action",component:i,args:{onEdit:e("onEdit"),onDelete:e("onDelete"),onShare:e("onShare"),onClick:e("onClick")}},o={args:{title:"Title",description:"Description"},render:r=>t.jsx("div",{className:"max-w-[450px]",children:t.jsxs(s,{bordered:!0,children:[t.jsx(i,{...r}),t.jsx(i,{...r}),t.jsx(i,{...r}),t.jsx(i,{...r})]})})};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    title: 'Title',
    description: 'Description'
  },
  render: args => <div className="max-w-[450px]">
      <List bordered>
        <ListItemWithAction {...args} />
        <ListItemWithAction {...args} />
        <ListItemWithAction {...args} />
        <ListItemWithAction {...args} />
      </List>
    </div>
}`,...o.parameters?.docs?.source}}};const O=["Default"];export{o as Default,O as __namedExportsOrder,A as default};
