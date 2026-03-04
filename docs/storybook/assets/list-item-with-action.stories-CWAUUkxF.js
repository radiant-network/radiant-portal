import{j as t}from"./iframe-BFF96udt.js";import{L as i,a as n}from"./list-item-with-action-BrK4b6Yd.js";import"./preload-helper-Dp1pzeXC.js";import"./button-BLBzSh0j.js";import"./index-D3RI5khu.js";import"./action-button-DcKE1Scg.js";import"./dropdown-menu-C2eyIKHO.js";import"./index-DyG90nhj.js";import"./circle-CIG6lPOS.js";import"./check-CgaEsGeg.js";import"./separator-bpq9Ha1H.js";import"./i18n-Bdi6L8QP.js";import"./conditional-wrapper-BBX8pIPQ.js";import"./pen-DTDTbzd9.js";import"./trash-DbWaWN92.js";const{action:r}=__STORYBOOK_MODULE_ACTIONS__,f={title:"Lists/ListItem with action",component:i,args:{onEdit:r("onEdit"),onDelete:r("onDelete"),onShare:r("onShare"),onClick:r("onClick")}},o={args:{title:"Title",description:"Description"},render:e=>t.jsx("div",{className:"max-w-[450px]",children:t.jsxs(n,{bordered:!0,children:[t.jsx(i,{...e}),t.jsx(i,{...e}),t.jsx(i,{...e}),t.jsx(i,{...e})]})})};var s,m,a;o.parameters={...o.parameters,docs:{...(s=o.parameters)==null?void 0:s.docs,source:{originalSource:`{
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
