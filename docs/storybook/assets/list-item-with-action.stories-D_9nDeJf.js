import{j as t}from"./iframe-B_jnDYRw.js";import{L as i,a as s}from"./list-item-with-action-B098jC65.js";import{a as m}from"./story-section-4RqDghQR.js";import"./preload-helper-PPVm8Dsz.js";import"./button-CspqOU_f.js";import"./index-DfeYIiAg.js";import"./action-button-sxXzUOnj.js";import"./dropdown-menu-DdhXS6nr.js";import"./index-3VdlNnLx.js";import"./index-J2Zi4jnN.js";import"./check-DnHgWdHC.js";import"./circle-DM65GupB.js";import"./separator-C2WPDGRO.js";import"./i18n-Dc-D14XP.js";import"./index-BnQ-eqKb.js";import"./index-BLQqHNw6.js";import"./conditional-wrapper-BBX8pIPQ.js";import"./pen-Ehza42GC.js";const{action:e}=__STORYBOOK_MODULE_ACTIONS__,O={title:"Components/Lists/List Item With Action",component:i,args:{onEdit:e("onEdit"),onDelete:e("onDelete"),onShare:e("onShare"),onClick:e("onClick")}},r={args:{title:"Title",description:"Description"},render:o=>t.jsx(m,{title:"List item with action",children:t.jsx("div",{className:"min-w-[450px]",children:t.jsxs(s,{bordered:!0,children:[t.jsx(i,{...o}),t.jsx(i,{...o}),t.jsx(i,{...o}),t.jsx(i,{...o})]})})})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
