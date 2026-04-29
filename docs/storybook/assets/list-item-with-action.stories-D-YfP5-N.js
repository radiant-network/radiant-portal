import{j as t}from"./iframe-BX_H28US.js";import{L as i,a as n}from"./list-item-with-action-DLjKHaQz.js";import"./preload-helper-Dp1pzeXC.js";import"./button-CTEmQRZS.js";import"./index-PQmHE6kT.js";import"./action-button-BhEgzh5t.js";import"./dropdown-menu-D6VQIUJt.js";import"./index-DqhBjzfn.js";import"./circle-3EwZHy2z.js";import"./check-CIDnGo8R.js";import"./separator-CcmEc_rg.js";import"./i18n-B3rA_Oxh.js";import"./conditional-wrapper-BBX8pIPQ.js";import"./pen-3u0OkgeS.js";const{action:r}=__STORYBOOK_MODULE_ACTIONS__,O={title:"Lists/ListItem with action",component:i,args:{onEdit:r("onEdit"),onDelete:r("onDelete"),onShare:r("onShare"),onClick:r("onClick")}},o={args:{title:"Title",description:"Description"},render:e=>t.jsx("div",{className:"max-w-[450px]",children:t.jsxs(n,{bordered:!0,children:[t.jsx(i,{...e}),t.jsx(i,{...e}),t.jsx(i,{...e}),t.jsx(i,{...e})]})})};var s,a,m;o.parameters={...o.parameters,docs:{...(s=o.parameters)==null?void 0:s.docs,source:{originalSource:`{
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
