import{j as t}from"./iframe-ic5Qxcay.js";import{L as i,a as n}from"./list-item-with-action-BXBs7bHT.js";import"./preload-helper-Dp1pzeXC.js";import"./button-BcQGDfh9.js";import"./index-BYOZoyyb.js";import"./action-button-B_a_lzkE.js";import"./dropdown-menu-Bz4pCMIQ.js";import"./index-DADJ2x1d.js";import"./circle-DxKroGXL.js";import"./check-kaNqWciF.js";import"./separator-1IuDAtPm.js";import"./i18n-Cigd5hm4.js";import"./conditional-wrapper-BBX8pIPQ.js";import"./pen-BXFdgv40.js";import"./trash-BxBrD3uR.js";const{action:r}=__STORYBOOK_MODULE_ACTIONS__,f={title:"Lists/ListItem with action",component:i,args:{onEdit:r("onEdit"),onDelete:r("onDelete"),onShare:r("onShare"),onClick:r("onClick")}},o={args:{title:"Title",description:"Description"},render:e=>t.jsx("div",{className:"max-w-[450px]",children:t.jsxs(n,{bordered:!0,children:[t.jsx(i,{...e}),t.jsx(i,{...e}),t.jsx(i,{...e}),t.jsx(i,{...e})]})})};var s,m,a;o.parameters={...o.parameters,docs:{...(s=o.parameters)==null?void 0:s.docs,source:{originalSource:`{
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
