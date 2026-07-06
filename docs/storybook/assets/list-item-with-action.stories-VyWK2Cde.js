import{j as t}from"./iframe-jfSntGFs.js";import{L as i,a as s}from"./list-item-with-action-BfrTUarL.js";import{a as n}from"./story-section-r6zyD_Yn.js";import"./preload-helper-PPVm8Dsz.js";import"./button-CAlT18JI.js";import"./action-button-DZrA5QIj.js";import"./dropdown-menu-BpGYzQEF.js";import"./index-CBbYNmYq.js";import"./index-DkhoqGQW.js";import"./check-2HNr6tyJ.js";import"./circle-DNNkSORW.js";import"./separator-D0D5PPNv.js";import"./i18n-DbzI5Go-.js";import"./index-BY4vqhHc.js";import"./conditional-wrapper-BBX8pIPQ.js";import"./pen-CxeK26e5.js";const{action:e}=__STORYBOOK_MODULE_ACTIONS__,f={title:"Components/Lists/List Item With Action",component:i,args:{onEdit:e("onEdit"),onDelete:e("onDelete"),onShare:e("onShare"),onClick:e("onClick")}},r={args:{title:"Title",description:"Description"},render:o=>t.jsx(n,{title:"List item with action",children:t.jsx("div",{className:"min-w-[450px]",children:t.jsxs(s,{bordered:!0,children:[t.jsx(i,{...o}),t.jsx(i,{...o}),t.jsx(i,{...o}),t.jsx(i,{...o})]})})})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
