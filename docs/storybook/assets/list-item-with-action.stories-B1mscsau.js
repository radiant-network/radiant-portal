import{j as t}from"./iframe-CnZJoeJJ.js";import{L as i,a as n}from"./list-item-with-action-CPbh_uPp.js";import"./preload-helper-Dp1pzeXC.js";import"./button-Cm-qWUZj.js";import"./index-CCfIwpUx.js";import"./action-button-DwChNtIi.js";import"./dropdown-menu-DeZ0tcSb.js";import"./index-Cgb4Wh9n.js";import"./index-IcRN2maX.js";import"./check-CzTwhE4v.js";import"./circle-DchfHJD1.js";import"./separator-CsnJdABl.js";import"./i18n-GxkGN4Zu.js";import"./conditional-wrapper-BBX8pIPQ.js";import"./pen-DiMp69lP.js";const{action:r}=__STORYBOOK_MODULE_ACTIONS__,f={title:"Lists/ListItem with action",component:i,args:{onEdit:r("onEdit"),onDelete:r("onDelete"),onShare:r("onShare"),onClick:r("onClick")}},o={args:{title:"Title",description:"Description"},render:e=>t.jsx("div",{className:"max-w-[450px]",children:t.jsxs(n,{bordered:!0,children:[t.jsx(i,{...e}),t.jsx(i,{...e}),t.jsx(i,{...e}),t.jsx(i,{...e})]})})};var s,m,a;o.parameters={...o.parameters,docs:{...(s=o.parameters)==null?void 0:s.docs,source:{originalSource:`{
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
