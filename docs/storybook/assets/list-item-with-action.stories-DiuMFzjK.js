import{j as t}from"./iframe-Ck6slD91.js";import{L as i,a as n}from"./list-item-with-action-D3Ny6fFg.js";import"./preload-helper-Dp1pzeXC.js";import"./button-DE-z7oR5.js";import"./index-xNFf6qRu.js";import"./action-button-CoXmm-sb.js";import"./dropdown-menu-s1ofcID1.js";import"./index-C7PgMmUJ.js";import"./circle-Bx-s0cQS.js";import"./check-DO_t-9Co.js";import"./separator-CzEnouGI.js";import"./i18n-Detk4ebv.js";import"./conditional-wrapper-BBX8pIPQ.js";import"./pen-BFgEg5vY.js";const{action:r}=__STORYBOOK_MODULE_ACTIONS__,O={title:"Lists/ListItem with action",component:i,args:{onEdit:r("onEdit"),onDelete:r("onDelete"),onShare:r("onShare"),onClick:r("onClick")}},o={args:{title:"Title",description:"Description"},render:e=>t.jsx("div",{className:"max-w-[450px]",children:t.jsxs(n,{bordered:!0,children:[t.jsx(i,{...e}),t.jsx(i,{...e}),t.jsx(i,{...e}),t.jsx(i,{...e})]})})};var s,a,m;o.parameters={...o.parameters,docs:{...(s=o.parameters)==null?void 0:s.docs,source:{originalSource:`{
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
