import{j as t}from"./iframe-BC4RzbTe.js";import{L as i,a as s}from"./list-item-with-action-B-iJn_fe.js";import{a as n}from"./story-section-DPrmmWzN.js";import"./preload-helper-PPVm8Dsz.js";import"./button-LUczZP4-.js";import"./action-button-CC0bpEam.js";import"./dropdown-menu-Baq_OXPj.js";import"./index-CbsMyLW-.js";import"./index-D1ZMpyoR.js";import"./check-CdGhgW-U.js";import"./circle-Ck_AokSU.js";import"./separator-C1ujT8UF.js";import"./i18n-B_9vMIaN.js";import"./index-nJ2VJ9o6.js";import"./conditional-wrapper-BBX8pIPQ.js";const{action:o}=__STORYBOOK_MODULE_ACTIONS__,I={title:"Components/Lists/List Item With Action",component:i,args:{onEdit:o("onEdit"),onDelete:o("onDelete"),onShare:o("onShare"),onClick:o("onClick")}},r={args:{title:"Title",description:"Description"},render:e=>t.jsx(n,{title:"List item with action",children:t.jsx("div",{className:"min-w-[450px]",children:t.jsxs(s,{bordered:!0,children:[t.jsx(i,{...e}),t.jsx(i,{...e}),t.jsx(i,{...e}),t.jsx(i,{...e})]})})})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
}`,...r.parameters?.docs?.source}}};const f=["Default"];export{r as Default,f as __namedExportsOrder,I as default};
