import{j as t}from"./iframe-CQgZAOkF.js";import{L as i,a as n}from"./list-item-with-action-CdMByrKl.js";import"./preload-helper-Dp1pzeXC.js";import"./button-C_AsNXYw.js";import"./index-omJgMaAL.js";import"./action-button-BjNqzH1o.js";import"./dropdown-menu-BTfS0Wrp.js";import"./index-CSD6zSMT.js";import"./index-CfmBBbLM.js";import"./check-Cx9ZfCjz.js";import"./circle-Cp5EZ7RS.js";import"./separator-DQ_lcvcD.js";import"./i18n-zfLOoNJ9.js";import"./conditional-wrapper-BBX8pIPQ.js";import"./pen-Det_NIYT.js";const{action:r}=__STORYBOOK_MODULE_ACTIONS__,f={title:"Lists/ListItem with action",component:i,args:{onEdit:r("onEdit"),onDelete:r("onDelete"),onShare:r("onShare"),onClick:r("onClick")}},o={args:{title:"Title",description:"Description"},render:e=>t.jsx("div",{className:"max-w-[450px]",children:t.jsxs(n,{bordered:!0,children:[t.jsx(i,{...e}),t.jsx(i,{...e}),t.jsx(i,{...e}),t.jsx(i,{...e})]})})};var s,m,a;o.parameters={...o.parameters,docs:{...(s=o.parameters)==null?void 0:s.docs,source:{originalSource:`{
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
