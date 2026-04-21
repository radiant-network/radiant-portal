import{j as t}from"./iframe-BWqcvn2Z.js";import{L as i,a as n}from"./list-item-with-action-COd9cVsW.js";import"./preload-helper-Dp1pzeXC.js";import"./button-D3sGKX_Z.js";import"./index-ph_9GgMk.js";import"./action-button-C1JStQtU.js";import"./dropdown-menu-MPz4kaiX.js";import"./index-C7kLeKX6.js";import"./circle-DAVwx1vN.js";import"./check-C60yrJGB.js";import"./separator-DUmh9lQt.js";import"./i18n-BsR9IM21.js";import"./conditional-wrapper-BBX8pIPQ.js";import"./pen-CTwnA6oe.js";const{action:r}=__STORYBOOK_MODULE_ACTIONS__,O={title:"Lists/ListItem with action",component:i,args:{onEdit:r("onEdit"),onDelete:r("onDelete"),onShare:r("onShare"),onClick:r("onClick")}},o={args:{title:"Title",description:"Description"},render:e=>t.jsx("div",{className:"max-w-[450px]",children:t.jsxs(n,{bordered:!0,children:[t.jsx(i,{...e}),t.jsx(i,{...e}),t.jsx(i,{...e}),t.jsx(i,{...e})]})})};var s,a,m;o.parameters={...o.parameters,docs:{...(s=o.parameters)==null?void 0:s.docs,source:{originalSource:`{
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
