import{j as t}from"./iframe-C3lqtK7e.js";import{L as i,a as s}from"./list-item-with-action-CjwrXQpo.js";import{a as n}from"./story-section-D0dJtQQI.js";import"./preload-helper-PPVm8Dsz.js";import"./button-C8Vp7O6w.js";import"./action-button-CE80NZKJ.js";import"./dropdown-menu-Bpvq-6ng.js";import"./index-CH0eao47.js";import"./index-CAl0gmco.js";import"./check-BRJQ9cv8.js";import"./circle-CfQ2AHwq.js";import"./separator-BKwaqk6V.js";import"./i18n-C-yF7uB7.js";import"./index-IdUrPHK1.js";import"./conditional-wrapper-BBX8pIPQ.js";import"./pen-Ke4b0L3N.js";const{action:e}=__STORYBOOK_MODULE_ACTIONS__,f={title:"Components/Lists/List Item With Action",component:i,args:{onEdit:e("onEdit"),onDelete:e("onDelete"),onShare:e("onShare"),onClick:e("onClick")}},r={args:{title:"Title",description:"Description"},render:o=>t.jsx(n,{title:"List item with action",children:t.jsx("div",{className:"min-w-[450px]",children:t.jsxs(s,{bordered:!0,children:[t.jsx(i,{...o}),t.jsx(i,{...o}),t.jsx(i,{...o}),t.jsx(i,{...o})]})})})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
