import{j as t}from"./iframe-DDMqSXul.js";import{L as i,a as s}from"./list-item-with-action-CWr0xtHU.js";import{a as n}from"./story-section-29Pt7KkT.js";import"./preload-helper-PPVm8Dsz.js";import"./button-C-NfkkWm.js";import"./action-button-WewT5ZPN.js";import"./dropdown-menu-DIoiAg_I.js";import"./index-BwmN7QES.js";import"./index-BwIDj-Vk.js";import"./check-Dl2pt11_.js";import"./circle-CRiw5vp4.js";import"./separator-Cc_T2enW.js";import"./i18n-C88g_mn6.js";import"./index-Ch5te5Xr.js";import"./conditional-wrapper-BBX8pIPQ.js";import"./pen-I1a55QIa.js";const{action:e}=__STORYBOOK_MODULE_ACTIONS__,f={title:"Components/Lists/List Item With Action",component:i,args:{onEdit:e("onEdit"),onDelete:e("onDelete"),onShare:e("onShare"),onClick:e("onClick")}},r={args:{title:"Title",description:"Description"},render:o=>t.jsx(n,{title:"List item with action",children:t.jsx("div",{className:"min-w-[450px]",children:t.jsxs(s,{bordered:!0,children:[t.jsx(i,{...o}),t.jsx(i,{...o}),t.jsx(i,{...o}),t.jsx(i,{...o})]})})})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
