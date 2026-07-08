import{j as t}from"./iframe-AvqL8SKE.js";import{L as i,a as s}from"./list-item-with-action-T5kJhJK-.js";import{a as n}from"./story-section-SMd-_iOc.js";import"./preload-helper-PPVm8Dsz.js";import"./button-ovvqhFmn.js";import"./action-button-ChVSKd_a.js";import"./dropdown-menu-D00C_V5S.js";import"./index-Bu3D54Rz.js";import"./index-pBdHyUKt.js";import"./check-YjMj3Oh7.js";import"./circle-BTQqcZGT.js";import"./separator-DDqetdKm.js";import"./i18n-DBGkWSYQ.js";import"./index-R0HakiSX.js";import"./conditional-wrapper-BBX8pIPQ.js";import"./pen-BEggiLfD.js";const{action:e}=__STORYBOOK_MODULE_ACTIONS__,f={title:"Components/Lists/List Item With Action",component:i,args:{onEdit:e("onEdit"),onDelete:e("onDelete"),onShare:e("onShare"),onClick:e("onClick")}},r={args:{title:"Title",description:"Description"},render:o=>t.jsx(n,{title:"List item with action",children:t.jsx("div",{className:"min-w-[450px]",children:t.jsxs(s,{bordered:!0,children:[t.jsx(i,{...o}),t.jsx(i,{...o}),t.jsx(i,{...o}),t.jsx(i,{...o})]})})})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
