import{j as t}from"./iframe-KxDQxQDs.js";import{L as i,a as s}from"./list-item-with-action-D185z2UC.js";import{a as n}from"./story-section-B6HdLg4-.js";import"./preload-helper-PPVm8Dsz.js";import"./button-DcEb2QoR.js";import"./index-DL5skkIA.js";import"./action-button-zarxO1Cp.js";import"./dropdown-menu-BKe34Zcm.js";import"./index-Obe_1VFm.js";import"./index-C9Hzv6Cn.js";import"./check-OcLjUnTR.js";import"./circle-YicaXG0V.js";import"./separator-RpiEdedA.js";import"./i18n-BnCxB2cP.js";import"./index-CPmIy41W.js";import"./conditional-wrapper-BBX8pIPQ.js";import"./pen-DUmSjtsh.js";const{action:e}=__STORYBOOK_MODULE_ACTIONS__,g={title:"Components/Lists/List Item With Action",component:i,args:{onEdit:e("onEdit"),onDelete:e("onDelete"),onShare:e("onShare"),onClick:e("onClick")}},r={args:{title:"Title",description:"Description"},render:o=>t.jsx(n,{title:"List item with action",children:t.jsx("div",{className:"min-w-[450px]",children:t.jsxs(s,{bordered:!0,children:[t.jsx(i,{...o}),t.jsx(i,{...o}),t.jsx(i,{...o}),t.jsx(i,{...o})]})})})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    title: 'Title',
    description: 'Description'
  },
  render: args => <StorySection title="List item with action">
      <div className="min-w-[450px]">
        <List bordered>
          <ListItemWithAction {...args} />
          <ListItemWithAction {...args} />
          <ListItemWithAction {...args} />
          <ListItemWithAction {...args} />
        </List>
      </div>
    </StorySection>
}`,...r.parameters?.docs?.source}}};const O=["Default"];export{r as Default,O as __namedExportsOrder,g as default};
