import{j as t}from"./iframe-8oJ5Bgb6.js";import{L as i,a as n}from"./list-item-with-action-MpEvqZCP.js";import"./preload-helper-Dp1pzeXC.js";import"./button-B-Vd7I7W.js";import"./index-DViiVEq-.js";import"./action-button-CdU_izQK.js";import"./dropdown-menu-BT9qsx5b.js";import"./index-BeRE-8C-.js";import"./index-B7DGIYRL.js";import"./check-CLsWVnhq.js";import"./circle-CKypI8aC.js";import"./separator-DpObONvW.js";import"./i18n-BUvQZllC.js";import"./conditional-wrapper-BBX8pIPQ.js";import"./pen-CyjW6ZWK.js";const{action:r}=__STORYBOOK_MODULE_ACTIONS__,f={title:"Lists/ListItem with action",component:i,args:{onEdit:r("onEdit"),onDelete:r("onDelete"),onShare:r("onShare"),onClick:r("onClick")}},o={args:{title:"Title",description:"Description"},render:e=>t.jsx("div",{className:"max-w-[450px]",children:t.jsxs(n,{bordered:!0,children:[t.jsx(i,{...e}),t.jsx(i,{...e}),t.jsx(i,{...e}),t.jsx(i,{...e})]})})};var s,m,a;o.parameters={...o.parameters,docs:{...(s=o.parameters)==null?void 0:s.docs,source:{originalSource:`{
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
