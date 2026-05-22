import{j as t}from"./iframe-Dzwv78Bp.js";import{L as i,a as n}from"./list-item-with-action-DqL48shu.js";import"./preload-helper-Dp1pzeXC.js";import"./button-DIhskbJm.js";import"./index-Suri5pS-.js";import"./action-button-BaF3hCn4.js";import"./dropdown-menu-B4YXM0X2.js";import"./index-D04D1SM5.js";import"./index-3KXOzHs5.js";import"./check-CHkQSgYo.js";import"./circle-BgwRz-U6.js";import"./separator-Djq5tUIi.js";import"./i18n-DoiwY1e4.js";import"./conditional-wrapper-BBX8pIPQ.js";import"./pen-BlGi3WlT.js";const{action:r}=__STORYBOOK_MODULE_ACTIONS__,f={title:"Lists/ListItem with action",component:i,args:{onEdit:r("onEdit"),onDelete:r("onDelete"),onShare:r("onShare"),onClick:r("onClick")}},o={args:{title:"Title",description:"Description"},render:e=>t.jsx("div",{className:"max-w-[450px]",children:t.jsxs(n,{bordered:!0,children:[t.jsx(i,{...e}),t.jsx(i,{...e}),t.jsx(i,{...e}),t.jsx(i,{...e})]})})};var s,m,a;o.parameters={...o.parameters,docs:{...(s=o.parameters)==null?void 0:s.docs,source:{originalSource:`{
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
