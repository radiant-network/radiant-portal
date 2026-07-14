import{j as t}from"./iframe-Dz8_RTnr.js";import{L as i,a as s}from"./list-item-with-action-B5oWuIKX.js";import{a as n}from"./story-section-D91u7BO8.js";import"./preload-helper-PPVm8Dsz.js";import"./button-BoQ-FEGa.js";import"./action-button-Dfe_PX_5.js";import"./dropdown-menu-CVXrsCd5.js";import"./index-DJVrsfBV.js";import"./index-DR0W2HG6.js";import"./check-BHMYym5j.js";import"./circle-CTXBJzqY.js";import"./separator-CwwChQ-7.js";import"./i18n-DET2zMxp.js";import"./index-DvkhtlNS.js";import"./conditional-wrapper-BBX8pIPQ.js";import"./pen-Do2dbhce.js";const{action:e}=__STORYBOOK_MODULE_ACTIONS__,f={title:"Components/Lists/List Item With Action",component:i,args:{onEdit:e("onEdit"),onDelete:e("onDelete"),onShare:e("onShare"),onClick:e("onClick")}},r={args:{title:"Title",description:"Description"},render:o=>t.jsx(n,{title:"List item with action",children:t.jsx("div",{className:"min-w-[450px]",children:t.jsxs(s,{bordered:!0,children:[t.jsx(i,{...o}),t.jsx(i,{...o}),t.jsx(i,{...o}),t.jsx(i,{...o})]})})})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
