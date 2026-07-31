import{j as t}from"./iframe-C_dP7gnO.js";import{L as i,a as s}from"./list-item-with-action-DoLSXW_I.js";import{a as n}from"./story-section-J70NlQOA.js";import"./preload-helper-PPVm8Dsz.js";import"./button-BlI6yvoB.js";import"./action-button-DmaA9Ug6.js";import"./dropdown-menu-CkkqqYnf.js";import"./index-BiuKl8gy.js";import"./index-B6yDnkAE.js";import"./check-CtmdECFN.js";import"./circle-Cag81XI_.js";import"./separator-D3keCDl2.js";import"./i18n-3IdnC225.js";import"./index-BeB-c5z7.js";import"./conditional-wrapper-BBX8pIPQ.js";import"./pen-Cy8n4ZJm.js";const{action:e}=__STORYBOOK_MODULE_ACTIONS__,f={title:"Components/Lists/List Item With Action",component:i,args:{onEdit:e("onEdit"),onDelete:e("onDelete"),onShare:e("onShare"),onClick:e("onClick")}},r={args:{title:"Title",description:"Description"},render:o=>t.jsx(n,{title:"List item with action",children:t.jsx("div",{className:"min-w-[450px]",children:t.jsxs(s,{bordered:!0,children:[t.jsx(i,{...o}),t.jsx(i,{...o}),t.jsx(i,{...o}),t.jsx(i,{...o})]})})})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
