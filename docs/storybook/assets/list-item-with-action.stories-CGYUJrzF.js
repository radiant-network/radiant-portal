import{j as t}from"./iframe-ikmO-G8w.js";import{L as i,a as s}from"./list-item-with-action-Cp6elwUd.js";import{a as n}from"./story-section-Do19LCYz.js";import"./preload-helper-PPVm8Dsz.js";import"./button-f2BnibuH.js";import"./action-button-DslSGgMW.js";import"./dropdown-menu-Djo0E1ip.js";import"./index-DLIPavft.js";import"./index-LNYO5vkT.js";import"./check-DFIBGLZn.js";import"./circle-HHVicZ3t.js";import"./separator-DvGIa4AD.js";import"./i18n--cYKJdvf.js";import"./index-TBEFmxjP.js";import"./conditional-wrapper-BBX8pIPQ.js";import"./pen-Dm6bUmOM.js";const{action:e}=__STORYBOOK_MODULE_ACTIONS__,f={title:"Components/Lists/List Item With Action",component:i,args:{onEdit:e("onEdit"),onDelete:e("onDelete"),onShare:e("onShare"),onClick:e("onClick")}},r={args:{title:"Title",description:"Description"},render:o=>t.jsx(n,{title:"List item with action",children:t.jsx("div",{className:"min-w-[450px]",children:t.jsxs(s,{bordered:!0,children:[t.jsx(i,{...o}),t.jsx(i,{...o}),t.jsx(i,{...o}),t.jsx(i,{...o})]})})})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
