import{j as t}from"./iframe-Bmo5s0S7.js";import{L as i,a as s}from"./list-item-with-action-DvRoUFrT.js";import{a as n}from"./story-section-DK9Ca-WM.js";import"./preload-helper-PPVm8Dsz.js";import"./button---ZJYA-K.js";import"./index-fUmLsCzv.js";import"./action-button-BsC9knCl.js";import"./dropdown-menu-RHvipy6t.js";import"./index-CYQD8SjJ.js";import"./index-D_ub_t65.js";import"./check-32E8HpGv.js";import"./circle-C1aHhR8R.js";import"./separator-CQaINmcN.js";import"./i18n-Dk7NL_SC.js";import"./index-Ral5BcRB.js";import"./conditional-wrapper-BBX8pIPQ.js";import"./pen-D-uMR61f.js";const{action:e}=__STORYBOOK_MODULE_ACTIONS__,g={title:"Components/Lists/List Item With Action",component:i,args:{onEdit:e("onEdit"),onDelete:e("onDelete"),onShare:e("onShare"),onClick:e("onClick")}},r={args:{title:"Title",description:"Description"},render:o=>t.jsx(n,{title:"List item with action",children:t.jsx("div",{className:"min-w-[450px]",children:t.jsxs(s,{bordered:!0,children:[t.jsx(i,{...o}),t.jsx(i,{...o}),t.jsx(i,{...o}),t.jsx(i,{...o})]})})})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
