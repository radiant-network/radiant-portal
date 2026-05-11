import{j as t}from"./iframe-CdetP1X0.js";import{L as i,a as n}from"./list-item-with-action-ChXJA2Qx.js";import"./preload-helper-Dp1pzeXC.js";import"./button-BbJzX6I1.js";import"./index-BbVp5V_G.js";import"./action-button-CR1ASOMi.js";import"./dropdown-menu-FRQNa6wC.js";import"./index-Y-WAq52a.js";import"./circle-CGfH005V.js";import"./check-CJ0hc2Z8.js";import"./separator-DWpVdauv.js";import"./i18n-Cg4CY2fo.js";import"./conditional-wrapper-BBX8pIPQ.js";import"./pen-BxDhj5Hb.js";const{action:r}=__STORYBOOK_MODULE_ACTIONS__,O={title:"Lists/ListItem with action",component:i,args:{onEdit:r("onEdit"),onDelete:r("onDelete"),onShare:r("onShare"),onClick:r("onClick")}},o={args:{title:"Title",description:"Description"},render:e=>t.jsx("div",{className:"max-w-[450px]",children:t.jsxs(n,{bordered:!0,children:[t.jsx(i,{...e}),t.jsx(i,{...e}),t.jsx(i,{...e}),t.jsx(i,{...e})]})})};var s,a,m;o.parameters={...o.parameters,docs:{...(s=o.parameters)==null?void 0:s.docs,source:{originalSource:`{
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
