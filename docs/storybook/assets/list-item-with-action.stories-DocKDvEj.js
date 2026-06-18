import{j as t}from"./iframe-pCkdMSW4.js";import{L as i,a as s}from"./list-item-with-action-Bl77j-b8.js";import{a as m}from"./story-section-BWCYvdHs.js";import"./preload-helper-PPVm8Dsz.js";import"./button-CvjWkbHj.js";import"./index-C-yKeQSQ.js";import"./action-button-CgBxcC7H.js";import"./dropdown-menu-pFkWlMk4.js";import"./index-BCDqYVKf.js";import"./index-B5hhSGrZ.js";import"./check-CHUKpJ0A.js";import"./circle-DE6Uhsos.js";import"./separator-BG0cX3CB.js";import"./i18n-Cv0t7e2j.js";import"./index-DyQxDMRQ.js";import"./index-wBlvzvCM.js";import"./conditional-wrapper-BBX8pIPQ.js";import"./pen-sW1sX1nL.js";const{action:e}=__STORYBOOK_MODULE_ACTIONS__,O={title:"Components/Lists/List Item With Action",component:i,args:{onEdit:e("onEdit"),onDelete:e("onDelete"),onShare:e("onShare"),onClick:e("onClick")}},r={args:{title:"Title",description:"Description"},render:o=>t.jsx(m,{title:"List item with action",children:t.jsx("div",{className:"min-w-[450px]",children:t.jsxs(s,{bordered:!0,children:[t.jsx(i,{...o}),t.jsx(i,{...o}),t.jsx(i,{...o}),t.jsx(i,{...o})]})})})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
}`,...r.parameters?.docs?.source}}};const E=["Default"];export{r as Default,E as __namedExportsOrder,O as default};
