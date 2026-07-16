import{j as t}from"./iframe-CjjKcyRz.js";import{L as i,a as s}from"./list-item-with-action-B1Zgz5jI.js";import{a as n}from"./story-section-CsOmwK7S.js";import"./preload-helper-PPVm8Dsz.js";import"./button-Dvk1HNzZ.js";import"./action-button-BwDlSnhC.js";import"./dropdown-menu-844EsJQI.js";import"./index-ClBgjtxQ.js";import"./index-xQrGmB3K.js";import"./check-C4P_JRtZ.js";import"./circle-BpRQY5cb.js";import"./separator-2VSHccwH.js";import"./i18n-BuVXszO5.js";import"./index-BqIV9asx.js";import"./conditional-wrapper-BBX8pIPQ.js";import"./pen-D3oE_dVW.js";const{action:e}=__STORYBOOK_MODULE_ACTIONS__,f={title:"Components/Lists/List Item With Action",component:i,args:{onEdit:e("onEdit"),onDelete:e("onDelete"),onShare:e("onShare"),onClick:e("onClick")}},r={args:{title:"Title",description:"Description"},render:o=>t.jsx(n,{title:"List item with action",children:t.jsx("div",{className:"min-w-[450px]",children:t.jsxs(s,{bordered:!0,children:[t.jsx(i,{...o}),t.jsx(i,{...o}),t.jsx(i,{...o}),t.jsx(i,{...o})]})})})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
