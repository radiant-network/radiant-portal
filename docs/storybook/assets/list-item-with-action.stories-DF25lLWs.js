import{j as t}from"./iframe-CMnhLHOf.js";import{L as i,a as n}from"./list-item-with-action-BOq8snjr.js";import"./preload-helper-Dp1pzeXC.js";import"./button-CwgxGnP_.js";import"./index-BUtUgFZQ.js";import"./action-button-C6O-ZiMa.js";import"./dropdown-menu-DuT_GNFJ.js";import"./index-EMqEdC3c.js";import"./circle-BEBmorTE.js";import"./check-DMtyfd-6.js";import"./separator-DKyTZOMp.js";import"./i18n-D_gPNxag.js";import"./conditional-wrapper-BBX8pIPQ.js";import"./pen-CnoPP2yN.js";const{action:r}=__STORYBOOK_MODULE_ACTIONS__,O={title:"Lists/ListItem with action",component:i,args:{onEdit:r("onEdit"),onDelete:r("onDelete"),onShare:r("onShare"),onClick:r("onClick")}},o={args:{title:"Title",description:"Description"},render:e=>t.jsx("div",{className:"max-w-[450px]",children:t.jsxs(n,{bordered:!0,children:[t.jsx(i,{...e}),t.jsx(i,{...e}),t.jsx(i,{...e}),t.jsx(i,{...e})]})})};var s,a,m;o.parameters={...o.parameters,docs:{...(s=o.parameters)==null?void 0:s.docs,source:{originalSource:`{
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
