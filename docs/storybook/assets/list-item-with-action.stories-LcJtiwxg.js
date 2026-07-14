import{j as t}from"./iframe-Db3o0LSj.js";import{L as i,a as s}from"./list-item-with-action-BQozVqQQ.js";import{a as n}from"./story-section-Fx7Lxy_f.js";import"./preload-helper-PPVm8Dsz.js";import"./button-DnRKu5DY.js";import"./action-button-DxWVTeY0.js";import"./dropdown-menu-BCBXWB-L.js";import"./index-U9TelM_w.js";import"./index-COcKmsT0.js";import"./check-Lhm-1YCq.js";import"./circle-Cd5P2_hB.js";import"./separator-BlWkC-It.js";import"./i18n-GmxgkmV0.js";import"./index-Bik4dCkf.js";import"./conditional-wrapper-BBX8pIPQ.js";import"./pen-D_CIJENR.js";const{action:e}=__STORYBOOK_MODULE_ACTIONS__,f={title:"Components/Lists/List Item With Action",component:i,args:{onEdit:e("onEdit"),onDelete:e("onDelete"),onShare:e("onShare"),onClick:e("onClick")}},r={args:{title:"Title",description:"Description"},render:o=>t.jsx(n,{title:"List item with action",children:t.jsx("div",{className:"min-w-[450px]",children:t.jsxs(s,{bordered:!0,children:[t.jsx(i,{...o}),t.jsx(i,{...o}),t.jsx(i,{...o}),t.jsx(i,{...o})]})})})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
