import{j as t}from"./iframe-CdF5EYmg.js";import{L as i,a as s}from"./list-item-with-action-Dnxn6_IL.js";import{a as n}from"./story-section-D4XYOw5I.js";import"./preload-helper-PPVm8Dsz.js";import"./button-DAc04O7O.js";import"./action-button-B-isfSdX.js";import"./dropdown-menu-C0WhWNZB.js";import"./index-BBuEL3vt.js";import"./index-BViuv1GS.js";import"./check-DTlfPsbg.js";import"./circle-DBjNND0v.js";import"./separator-DtNz95I0.js";import"./i18n-DK-5BTci.js";import"./index-Cp-tXBSJ.js";import"./conditional-wrapper-BBX8pIPQ.js";import"./pen-DzxhNakC.js";const{action:e}=__STORYBOOK_MODULE_ACTIONS__,f={title:"Components/Lists/List Item With Action",component:i,args:{onEdit:e("onEdit"),onDelete:e("onDelete"),onShare:e("onShare"),onClick:e("onClick")}},r={args:{title:"Title",description:"Description"},render:o=>t.jsx(n,{title:"List item with action",children:t.jsx("div",{className:"min-w-[450px]",children:t.jsxs(s,{bordered:!0,children:[t.jsx(i,{...o}),t.jsx(i,{...o}),t.jsx(i,{...o}),t.jsx(i,{...o})]})})})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
