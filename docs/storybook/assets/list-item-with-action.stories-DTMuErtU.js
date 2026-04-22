import{j as t}from"./iframe-wQ3-hBIM.js";import{L as i,a as n}from"./list-item-with-action-BDQ-jKSd.js";import"./preload-helper-Dp1pzeXC.js";import"./button-Bj2KR2dc.js";import"./index-BdVk7Sny.js";import"./action-button-Txs2q945.js";import"./dropdown-menu-6JkKY-VA.js";import"./index-DAyLWoxP.js";import"./circle-Bq7GqULo.js";import"./check-BTt_u77A.js";import"./separator-Bh0CWtfy.js";import"./i18n-CWvWXk2X.js";import"./conditional-wrapper-BBX8pIPQ.js";import"./pen-DMpoNcRX.js";const{action:r}=__STORYBOOK_MODULE_ACTIONS__,O={title:"Lists/ListItem with action",component:i,args:{onEdit:r("onEdit"),onDelete:r("onDelete"),onShare:r("onShare"),onClick:r("onClick")}},o={args:{title:"Title",description:"Description"},render:e=>t.jsx("div",{className:"max-w-[450px]",children:t.jsxs(n,{bordered:!0,children:[t.jsx(i,{...e}),t.jsx(i,{...e}),t.jsx(i,{...e}),t.jsx(i,{...e})]})})};var s,a,m;o.parameters={...o.parameters,docs:{...(s=o.parameters)==null?void 0:s.docs,source:{originalSource:`{
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
