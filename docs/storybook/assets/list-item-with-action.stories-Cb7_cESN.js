import{j as t}from"./iframe-BW_zLFd2.js";import{L as i,a as n}from"./list-item-with-action-Clz7dWoi.js";import"./preload-helper-Dp1pzeXC.js";import"./button-CDXOgyjI.js";import"./index-CG5xR1wJ.js";import"./action-button-Dw9JCXdk.js";import"./dropdown-menu-l8KIoaEu.js";import"./index-6BA2E74k.js";import"./circle-CpoL3LDL.js";import"./check-qaMPOvd3.js";import"./separator-Dhjz-6If.js";import"./i18n-BJbxNnVp.js";import"./conditional-wrapper-BBX8pIPQ.js";import"./pen-NpCbxpk3.js";import"./trash-Bdq4CdrF.js";const{action:r}=__STORYBOOK_MODULE_ACTIONS__,f={title:"Lists/ListItem with action",component:i,args:{onEdit:r("onEdit"),onDelete:r("onDelete"),onShare:r("onShare"),onClick:r("onClick")}},o={args:{title:"Title",description:"Description"},render:e=>t.jsx("div",{className:"max-w-[450px]",children:t.jsxs(n,{bordered:!0,children:[t.jsx(i,{...e}),t.jsx(i,{...e}),t.jsx(i,{...e}),t.jsx(i,{...e})]})})};var s,m,a;o.parameters={...o.parameters,docs:{...(s=o.parameters)==null?void 0:s.docs,source:{originalSource:`{
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
