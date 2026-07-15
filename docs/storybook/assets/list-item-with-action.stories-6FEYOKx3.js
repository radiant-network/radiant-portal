import{j as t}from"./iframe-kLaNX2HI.js";import{L as i,a as s}from"./list-item-with-action-CD05z9Za.js";import{a as n}from"./story-section-YShHgFMq.js";import"./preload-helper-PPVm8Dsz.js";import"./button-lcKTI4HU.js";import"./action-button-D3l4bIzZ.js";import"./dropdown-menu-85xmnBFd.js";import"./index-fXaV-lio.js";import"./index-B2vLf8-Q.js";import"./check-NiNg2u4X.js";import"./circle-yHcXqLnR.js";import"./separator-BTZwSWvT.js";import"./i18n-ZHel4DsP.js";import"./index-BCXviJZk.js";import"./conditional-wrapper-BBX8pIPQ.js";import"./pen-CdpY8PRK.js";const{action:e}=__STORYBOOK_MODULE_ACTIONS__,f={title:"Components/Lists/List Item With Action",component:i,args:{onEdit:e("onEdit"),onDelete:e("onDelete"),onShare:e("onShare"),onClick:e("onClick")}},r={args:{title:"Title",description:"Description"},render:o=>t.jsx(n,{title:"List item with action",children:t.jsx("div",{className:"min-w-[450px]",children:t.jsxs(s,{bordered:!0,children:[t.jsx(i,{...o}),t.jsx(i,{...o}),t.jsx(i,{...o}),t.jsx(i,{...o})]})})})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
}`,...r.parameters?.docs?.source}}};const g=["Default"];export{r as Default,g as __namedExportsOrder,f as default};
