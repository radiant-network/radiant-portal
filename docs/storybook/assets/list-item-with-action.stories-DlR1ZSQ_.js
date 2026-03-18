import{j as t}from"./iframe--UGfF5q5.js";import{L as i,a as n}from"./list-item-with-action-DJfNBNyi.js";import"./preload-helper-Dp1pzeXC.js";import"./button-B_OLTHm3.js";import"./index-BX7vQtU5.js";import"./action-button-BNY1ZIOd.js";import"./dropdown-menu-DjcaolQz.js";import"./index-Cn4IGCES.js";import"./circle-Cv3LLey1.js";import"./check-D_hDBE2u.js";import"./separator-DHgehW6X.js";import"./i18n-BUdYya6t.js";import"./conditional-wrapper-BBX8pIPQ.js";import"./pen-BZxPAu5u.js";import"./trash--eZ_fGz3.js";const{action:r}=__STORYBOOK_MODULE_ACTIONS__,f={title:"Lists/ListItem with action",component:i,args:{onEdit:r("onEdit"),onDelete:r("onDelete"),onShare:r("onShare"),onClick:r("onClick")}},o={args:{title:"Title",description:"Description"},render:e=>t.jsx("div",{className:"max-w-[450px]",children:t.jsxs(n,{bordered:!0,children:[t.jsx(i,{...e}),t.jsx(i,{...e}),t.jsx(i,{...e}),t.jsx(i,{...e})]})})};var s,m,a;o.parameters={...o.parameters,docs:{...(s=o.parameters)==null?void 0:s.docs,source:{originalSource:`{
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
}`,...(a=(m=o.parameters)==null?void 0:m.docs)==null?void 0:a.source}}};const E=["Default"];export{o as Default,E as __namedExportsOrder,f as default};
