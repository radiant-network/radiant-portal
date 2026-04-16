import{j as t}from"./iframe-e_RkbOaH.js";import{L as i,a as n}from"./list-item-with-action-D82GiGgF.js";import"./preload-helper-Dp1pzeXC.js";import"./button-CSb0Gl7Z.js";import"./index-Cse8Fp0p.js";import"./action-button-CcgNtTYc.js";import"./dropdown-menu-Bf1xD4Ie.js";import"./index-DJ2igTyg.js";import"./circle-sz7zuKNK.js";import"./check-x0ruABD0.js";import"./separator-CjKKkkm2.js";import"./i18n-qNbLka70.js";import"./conditional-wrapper-BBX8pIPQ.js";import"./pen-Cej7a8hp.js";const{action:r}=__STORYBOOK_MODULE_ACTIONS__,O={title:"Lists/ListItem with action",component:i,args:{onEdit:r("onEdit"),onDelete:r("onDelete"),onShare:r("onShare"),onClick:r("onClick")}},o={args:{title:"Title",description:"Description"},render:e=>t.jsx("div",{className:"max-w-[450px]",children:t.jsxs(n,{bordered:!0,children:[t.jsx(i,{...e}),t.jsx(i,{...e}),t.jsx(i,{...e}),t.jsx(i,{...e})]})})};var s,a,m;o.parameters={...o.parameters,docs:{...(s=o.parameters)==null?void 0:s.docs,source:{originalSource:`{
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
