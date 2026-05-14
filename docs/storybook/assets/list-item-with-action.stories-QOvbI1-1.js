import{j as t}from"./iframe-z7Dw2yEo.js";import{L as i,a as n}from"./list-item-with-action-Du-kH5nv.js";import"./preload-helper-Dp1pzeXC.js";import"./button-ClIBoGCL.js";import"./index-B8fyt2Zd.js";import"./action-button-BAA5flkr.js";import"./dropdown-menu-D34uHAw7.js";import"./index-fQ2QfZk9.js";import"./circle-uKaMswnP.js";import"./check-BZIAGfC8.js";import"./separator-Jx5y4MFq.js";import"./i18n-Dbq9q9wy.js";import"./conditional-wrapper-BBX8pIPQ.js";import"./pen-CmTsZ0BL.js";const{action:r}=__STORYBOOK_MODULE_ACTIONS__,O={title:"Lists/ListItem with action",component:i,args:{onEdit:r("onEdit"),onDelete:r("onDelete"),onShare:r("onShare"),onClick:r("onClick")}},o={args:{title:"Title",description:"Description"},render:e=>t.jsx("div",{className:"max-w-[450px]",children:t.jsxs(n,{bordered:!0,children:[t.jsx(i,{...e}),t.jsx(i,{...e}),t.jsx(i,{...e}),t.jsx(i,{...e})]})})};var s,a,m;o.parameters={...o.parameters,docs:{...(s=o.parameters)==null?void 0:s.docs,source:{originalSource:`{
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
}`,...(m=(a=o.parameters)==null?void 0:a.docs)==null?void 0:m.source}}};const f=["Default"];export{o as Default,f as __namedExportsOrder,O as default};
