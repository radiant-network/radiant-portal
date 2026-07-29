import{j as t}from"./iframe-BCdw1Zpv.js";import{L as i,a as s}from"./list-item-with-action-Cge_JmFV.js";import{a as n}from"./story-section-DgtXw29J.js";import"./preload-helper-PPVm8Dsz.js";import"./button-CCDrrqA6.js";import"./action-button-C_F8twkk.js";import"./dropdown-menu-HBuGdxYI.js";import"./index-BS8cZKMG.js";import"./index-COD-M8Go.js";import"./check-DAngudb0.js";import"./circle-DY_U8LIw.js";import"./separator-CxLC1eka.js";import"./i18n-BerkWO00.js";import"./index-mpFtsMNW.js";import"./conditional-wrapper-BBX8pIPQ.js";import"./pen-CofiU8dO.js";const{action:e}=__STORYBOOK_MODULE_ACTIONS__,f={title:"Components/Lists/List Item With Action",component:i,args:{onEdit:e("onEdit"),onDelete:e("onDelete"),onShare:e("onShare"),onClick:e("onClick")}},r={args:{title:"Title",description:"Description"},render:o=>t.jsx(n,{title:"List item with action",children:t.jsx("div",{className:"min-w-[450px]",children:t.jsxs(s,{bordered:!0,children:[t.jsx(i,{...o}),t.jsx(i,{...o}),t.jsx(i,{...o}),t.jsx(i,{...o})]})})})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
