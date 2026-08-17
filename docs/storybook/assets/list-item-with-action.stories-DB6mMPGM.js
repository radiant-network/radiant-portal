import{j as t}from"./iframe-D7ER49TR.js";import{L as i,a as s}from"./list-item-with-action-oszintoY.js";import{a as n}from"./story-section-T7092GL1.js";import"./preload-helper-PPVm8Dsz.js";import"./button-P2tNjpVJ.js";import"./action-button-D6y5Szv8.js";import"./dropdown-menu-DgcnzvDN.js";import"./index-B6dqpAEy.js";import"./index-Dud_FKwN.js";import"./check-Dm7HKO46.js";import"./circle-CgC-JePX.js";import"./separator-BkZFpBO0.js";import"./i18n-D0rznIQh.js";import"./index-oucxxOkI.js";import"./conditional-wrapper-BBX8pIPQ.js";import"./pen-DJulMZSK.js";const{action:e}=__STORYBOOK_MODULE_ACTIONS__,f={title:"Components/Lists/List Item With Action",component:i,args:{onEdit:e("onEdit"),onDelete:e("onDelete"),onShare:e("onShare"),onClick:e("onClick")}},r={args:{title:"Title",description:"Description"},render:o=>t.jsx(n,{title:"List item with action",children:t.jsx("div",{className:"min-w-[450px]",children:t.jsxs(s,{bordered:!0,children:[t.jsx(i,{...o}),t.jsx(i,{...o}),t.jsx(i,{...o}),t.jsx(i,{...o})]})})})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
