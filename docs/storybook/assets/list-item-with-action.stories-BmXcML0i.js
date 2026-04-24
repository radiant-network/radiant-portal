import{j as t}from"./iframe-Cl_us0Ef.js";import{L as i,a as n}from"./list-item-with-action-CqwVRcHY.js";import"./preload-helper-Dp1pzeXC.js";import"./button-CcL9vRdB.js";import"./index-1z3gKZ3X.js";import"./action-button-DtCedlrk.js";import"./dropdown-menu-DdbrZPUp.js";import"./index-B6rZWH80.js";import"./circle-BnOaCZ5x.js";import"./check-DjGEQf1v.js";import"./separator-CNhVfHxM.js";import"./i18n-Cilb11M3.js";import"./conditional-wrapper-BBX8pIPQ.js";import"./pen-Da_q4ZcW.js";const{action:r}=__STORYBOOK_MODULE_ACTIONS__,O={title:"Lists/ListItem with action",component:i,args:{onEdit:r("onEdit"),onDelete:r("onDelete"),onShare:r("onShare"),onClick:r("onClick")}},o={args:{title:"Title",description:"Description"},render:e=>t.jsx("div",{className:"max-w-[450px]",children:t.jsxs(n,{bordered:!0,children:[t.jsx(i,{...e}),t.jsx(i,{...e}),t.jsx(i,{...e}),t.jsx(i,{...e})]})})};var s,a,m;o.parameters={...o.parameters,docs:{...(s=o.parameters)==null?void 0:s.docs,source:{originalSource:`{
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
