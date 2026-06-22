import{j as t}from"./iframe-CXwxzQgG.js";import{L as i,a as s}from"./list-item-with-action-UYeDlJr5.js";import{a as n}from"./story-section-puWRqKt8.js";import"./preload-helper-PPVm8Dsz.js";import"./button-Cxobtibg.js";import"./action-button-DPj_xv_y.js";import"./dropdown-menu-D5pHqyQ1.js";import"./index-Taq0aAWj.js";import"./index-DScWjfT-.js";import"./check-j-xk93RG.js";import"./circle-Dnell8nw.js";import"./separator-pzXO6oVw.js";import"./i18n-gHAOwTiM.js";import"./index-DCs8_3sr.js";import"./conditional-wrapper-BBX8pIPQ.js";import"./pen-CavC572P.js";const{action:e}=__STORYBOOK_MODULE_ACTIONS__,f={title:"Components/Lists/List Item With Action",component:i,args:{onEdit:e("onEdit"),onDelete:e("onDelete"),onShare:e("onShare"),onClick:e("onClick")}},r={args:{title:"Title",description:"Description"},render:o=>t.jsx(n,{title:"List item with action",children:t.jsx("div",{className:"min-w-[450px]",children:t.jsxs(s,{bordered:!0,children:[t.jsx(i,{...o}),t.jsx(i,{...o}),t.jsx(i,{...o}),t.jsx(i,{...o})]})})})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
