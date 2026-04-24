import{j as t}from"./iframe-CRRv_ibS.js";import{L as i,a as n}from"./list-item-with-action-DMXiGeWe.js";import"./preload-helper-Dp1pzeXC.js";import"./button-CGUfaMs5.js";import"./index-BEmc1KKo.js";import"./action-button-DixJPHxK.js";import"./dropdown-menu-PTnS0g7N.js";import"./index-D5YiG8wC.js";import"./circle-DN0KfahX.js";import"./check-BvdvHDVF.js";import"./separator-B2H8WKeE.js";import"./i18n-Cl__0Jt0.js";import"./conditional-wrapper-BBX8pIPQ.js";import"./pen-BrWdMv5U.js";const{action:r}=__STORYBOOK_MODULE_ACTIONS__,O={title:"Lists/ListItem with action",component:i,args:{onEdit:r("onEdit"),onDelete:r("onDelete"),onShare:r("onShare"),onClick:r("onClick")}},o={args:{title:"Title",description:"Description"},render:e=>t.jsx("div",{className:"max-w-[450px]",children:t.jsxs(n,{bordered:!0,children:[t.jsx(i,{...e}),t.jsx(i,{...e}),t.jsx(i,{...e}),t.jsx(i,{...e})]})})};var s,a,m;o.parameters={...o.parameters,docs:{...(s=o.parameters)==null?void 0:s.docs,source:{originalSource:`{
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
