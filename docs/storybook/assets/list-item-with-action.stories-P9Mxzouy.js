import{j as t}from"./iframe-Cbdknb1k.js";import{L as i,a as s}from"./list-item-with-action-CnJNOmLK.js";import{a as n}from"./story-section-BVaUEtis.js";import"./preload-helper-PPVm8Dsz.js";import"./button-B2dwLL0F.js";import"./index-87WvwnWY.js";import"./action-button-vyGBaIAJ.js";import"./dropdown-menu-BHyRkyrg.js";import"./index-Cz_krX8a.js";import"./index-vbxHKvSM.js";import"./check-DPpRClnn.js";import"./circle-CJX0r14w.js";import"./separator-Bq5mxrnm.js";import"./i18n-D-yzr8ya.js";import"./index-C6yqdqIH.js";import"./conditional-wrapper-BBX8pIPQ.js";import"./pen-3NSTc-9N.js";const{action:e}=__STORYBOOK_MODULE_ACTIONS__,g={title:"Components/Lists/List Item With Action",component:i,args:{onEdit:e("onEdit"),onDelete:e("onDelete"),onShare:e("onShare"),onClick:e("onClick")}},r={args:{title:"Title",description:"Description"},render:o=>t.jsx(n,{title:"List item with action",children:t.jsx("div",{className:"min-w-[450px]",children:t.jsxs(s,{bordered:!0,children:[t.jsx(i,{...o}),t.jsx(i,{...o}),t.jsx(i,{...o}),t.jsx(i,{...o})]})})})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
}`,...r.parameters?.docs?.source}}};const O=["Default"];export{r as Default,O as __namedExportsOrder,g as default};
