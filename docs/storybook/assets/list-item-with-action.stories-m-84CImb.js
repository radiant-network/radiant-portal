import{j as t}from"./iframe-C7m9FALj.js";import{L as i,a as n}from"./list-item-with-action-BbNjqeIs.js";import"./preload-helper-Dp1pzeXC.js";import"./button-Bpqmwvt6.js";import"./index-D6-EMVHO.js";import"./action-button-Ct3rsJfW.js";import"./dropdown-menu-qKMd4mlg.js";import"./index-B4o9B4_n.js";import"./circle-Bk-w7dXK.js";import"./check-CljsLVET.js";import"./separator-BX9a_Pn9.js";import"./i18n-BEVU7gS4.js";import"./conditional-wrapper-BBX8pIPQ.js";import"./pen-B6GV8CvO.js";const{action:r}=__STORYBOOK_MODULE_ACTIONS__,O={title:"Lists/ListItem with action",component:i,args:{onEdit:r("onEdit"),onDelete:r("onDelete"),onShare:r("onShare"),onClick:r("onClick")}},o={args:{title:"Title",description:"Description"},render:e=>t.jsx("div",{className:"max-w-[450px]",children:t.jsxs(n,{bordered:!0,children:[t.jsx(i,{...e}),t.jsx(i,{...e}),t.jsx(i,{...e}),t.jsx(i,{...e})]})})};var s,a,m;o.parameters={...o.parameters,docs:{...(s=o.parameters)==null?void 0:s.docs,source:{originalSource:`{
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
