import{j as t}from"./iframe-lQ8HVjIy.js";import{L as i,a as n}from"./list-item-with-action-BIaFNxoa.js";import"./preload-helper-Dp1pzeXC.js";import"./button-B-8xD8Ih.js";import"./index-mogEHRMr.js";import"./action-button-BOrLdUc5.js";import"./dropdown-menu-B56SbIIJ.js";import"./index-6lZiFMY2.js";import"./circle-FFfKQCh6.js";import"./check-COrbdf9Z.js";import"./separator-B2zqN5Vi.js";import"./i18n-WiAtJ9DW.js";import"./conditional-wrapper-BBX8pIPQ.js";import"./pen-xA3HSp_p.js";import"./trash-D-1iQAle.js";const{action:r}=__STORYBOOK_MODULE_ACTIONS__,f={title:"Lists/ListItem with action",component:i,args:{onEdit:r("onEdit"),onDelete:r("onDelete"),onShare:r("onShare"),onClick:r("onClick")}},o={args:{title:"Title",description:"Description"},render:e=>t.jsx("div",{className:"max-w-[450px]",children:t.jsxs(n,{bordered:!0,children:[t.jsx(i,{...e}),t.jsx(i,{...e}),t.jsx(i,{...e}),t.jsx(i,{...e})]})})};var s,m,a;o.parameters={...o.parameters,docs:{...(s=o.parameters)==null?void 0:s.docs,source:{originalSource:`{
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
