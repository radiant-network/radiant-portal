import{j as t}from"./iframe-sBkayYGM.js";import{L as i,a as n}from"./list-item-with-action-DAnkP95i.js";import"./preload-helper-Dp1pzeXC.js";import"./button-jkxlOLkL.js";import"./index-9C8pxyL6.js";import"./action-button-DcUSZY_y.js";import"./dropdown-menu-CSHOugmB.js";import"./index-d5oLFdxm.js";import"./circle-Chbat-Us.js";import"./check-sYlosT3b.js";import"./separator-DPuhkk5a.js";import"./i18n-BriNheOb.js";import"./conditional-wrapper-BBX8pIPQ.js";import"./pen-DI6HRL5O.js";const{action:r}=__STORYBOOK_MODULE_ACTIONS__,O={title:"Lists/ListItem with action",component:i,args:{onEdit:r("onEdit"),onDelete:r("onDelete"),onShare:r("onShare"),onClick:r("onClick")}},o={args:{title:"Title",description:"Description"},render:e=>t.jsx("div",{className:"max-w-[450px]",children:t.jsxs(n,{bordered:!0,children:[t.jsx(i,{...e}),t.jsx(i,{...e}),t.jsx(i,{...e}),t.jsx(i,{...e})]})})};var s,a,m;o.parameters={...o.parameters,docs:{...(s=o.parameters)==null?void 0:s.docs,source:{originalSource:`{
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
