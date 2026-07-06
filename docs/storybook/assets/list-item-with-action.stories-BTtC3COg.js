import{j as t}from"./iframe-BDYK6UvR.js";import{L as i,a as s}from"./list-item-with-action-DM702FC4.js";import{a as n}from"./story-section-FMAs1sHp.js";import"./preload-helper-PPVm8Dsz.js";import"./button-B-L79fbv.js";import"./action-button-CdQlTKhi.js";import"./dropdown-menu-HkrpKjvg.js";import"./index-C87n2e9o.js";import"./index-B2uTVnY7.js";import"./check-mee2v7ix.js";import"./circle-CThf3Dtg.js";import"./separator-3qJkDnyN.js";import"./i18n-DvEGfvD-.js";import"./index-C16L_Bj1.js";import"./conditional-wrapper-BBX8pIPQ.js";import"./pen-DPuJcEcd.js";const{action:e}=__STORYBOOK_MODULE_ACTIONS__,f={title:"Components/Lists/List Item With Action",component:i,args:{onEdit:e("onEdit"),onDelete:e("onDelete"),onShare:e("onShare"),onClick:e("onClick")}},r={args:{title:"Title",description:"Description"},render:o=>t.jsx(n,{title:"List item with action",children:t.jsx("div",{className:"min-w-[450px]",children:t.jsxs(s,{bordered:!0,children:[t.jsx(i,{...o}),t.jsx(i,{...o}),t.jsx(i,{...o}),t.jsx(i,{...o})]})})})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
