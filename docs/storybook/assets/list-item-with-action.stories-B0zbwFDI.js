import{j as t}from"./iframe-DiydeeGO.js";import{L as i,a as n}from"./list-item-with-action-BvWBs3JJ.js";import"./preload-helper-Dp1pzeXC.js";import"./button-BpQoX9AX.js";import"./index-B7hOF3du.js";import"./action-button-CfmhRu5e.js";import"./dropdown-menu-CdVAlv0x.js";import"./index-D3WEPLb5.js";import"./circle-BhlZk34l.js";import"./check-Dn9AvtKh.js";import"./separator-DR0R7ySQ.js";import"./i18n-3c6sQS03.js";import"./conditional-wrapper-BBX8pIPQ.js";import"./pen-fccNIlMx.js";const{action:r}=__STORYBOOK_MODULE_ACTIONS__,O={title:"Lists/ListItem with action",component:i,args:{onEdit:r("onEdit"),onDelete:r("onDelete"),onShare:r("onShare"),onClick:r("onClick")}},o={args:{title:"Title",description:"Description"},render:e=>t.jsx("div",{className:"max-w-[450px]",children:t.jsxs(n,{bordered:!0,children:[t.jsx(i,{...e}),t.jsx(i,{...e}),t.jsx(i,{...e}),t.jsx(i,{...e})]})})};var s,a,m;o.parameters={...o.parameters,docs:{...(s=o.parameters)==null?void 0:s.docs,source:{originalSource:`{
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
