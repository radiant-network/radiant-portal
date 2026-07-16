import{j as t}from"./iframe-CZw1qZGW.js";import{L as i,a as s}from"./list-item-with-action-v3_zwCHo.js";import{a as n}from"./story-section-YSzHW9zx.js";import"./preload-helper-PPVm8Dsz.js";import"./button-CGR4UfFv.js";import"./action-button-kKLU-hab.js";import"./dropdown-menu-Dzzvo9yA.js";import"./index-BLv7cGbS.js";import"./index-22t25koy.js";import"./check-CFQ8FQQb.js";import"./circle-DcsoVGej.js";import"./separator-imWwe0EG.js";import"./i18n-D6woSMGU.js";import"./index-MRM-u4eM.js";import"./conditional-wrapper-BBX8pIPQ.js";import"./pen-5wcRCViW.js";const{action:e}=__STORYBOOK_MODULE_ACTIONS__,f={title:"Components/Lists/List Item With Action",component:i,args:{onEdit:e("onEdit"),onDelete:e("onDelete"),onShare:e("onShare"),onClick:e("onClick")}},r={args:{title:"Title",description:"Description"},render:o=>t.jsx(n,{title:"List item with action",children:t.jsx("div",{className:"min-w-[450px]",children:t.jsxs(s,{bordered:!0,children:[t.jsx(i,{...o}),t.jsx(i,{...o}),t.jsx(i,{...o}),t.jsx(i,{...o})]})})})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
