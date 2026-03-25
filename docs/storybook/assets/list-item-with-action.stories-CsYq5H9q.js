import{j as t}from"./iframe-DansaL1P.js";import{L as i,a as n}from"./list-item-with-action-0rXssFwR.js";import"./preload-helper-Dp1pzeXC.js";import"./button-DCi__S97.js";import"./index-NZ0kV-zW.js";import"./action-button-COjgzsa8.js";import"./dropdown-menu-GXn25If8.js";import"./index-DMZAtyOL.js";import"./circle-7d3uVPb8.js";import"./check-DgI8oDzE.js";import"./separator-D5dDLtfw.js";import"./i18n-7AUnmSuE.js";import"./conditional-wrapper-BBX8pIPQ.js";import"./pen-B_d5wcGW.js";import"./trash-CxEVjm_R.js";const{action:r}=__STORYBOOK_MODULE_ACTIONS__,f={title:"Lists/ListItem with action",component:i,args:{onEdit:r("onEdit"),onDelete:r("onDelete"),onShare:r("onShare"),onClick:r("onClick")}},o={args:{title:"Title",description:"Description"},render:e=>t.jsx("div",{className:"max-w-[450px]",children:t.jsxs(n,{bordered:!0,children:[t.jsx(i,{...e}),t.jsx(i,{...e}),t.jsx(i,{...e}),t.jsx(i,{...e})]})})};var s,m,a;o.parameters={...o.parameters,docs:{...(s=o.parameters)==null?void 0:s.docs,source:{originalSource:`{
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
