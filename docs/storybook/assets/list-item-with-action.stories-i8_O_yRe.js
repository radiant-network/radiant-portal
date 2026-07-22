import{j as t}from"./iframe-BZB1EZgz.js";import{L as i,a as s}from"./list-item-with-action-D2__jGE_.js";import{a as n}from"./story-section-BDrkXYOE.js";import"./preload-helper-PPVm8Dsz.js";import"./button-D8HFhMXd.js";import"./action-button-DqxIOjdS.js";import"./dropdown-menu-C1MQh_QQ.js";import"./index-CA8vCrAG.js";import"./index-DjZJgZTe.js";import"./check-HFbzKaow.js";import"./circle-Dh8DU7_a.js";import"./separator-CcqX_m5t.js";import"./i18n-CQ0WOrKs.js";import"./index-B0w-Ttvh.js";import"./conditional-wrapper-BBX8pIPQ.js";import"./pen-81etmRyZ.js";const{action:e}=__STORYBOOK_MODULE_ACTIONS__,f={title:"Components/Lists/List Item With Action",component:i,args:{onEdit:e("onEdit"),onDelete:e("onDelete"),onShare:e("onShare"),onClick:e("onClick")}},r={args:{title:"Title",description:"Description"},render:o=>t.jsx(n,{title:"List item with action",children:t.jsx("div",{className:"min-w-[450px]",children:t.jsxs(s,{bordered:!0,children:[t.jsx(i,{...o}),t.jsx(i,{...o}),t.jsx(i,{...o}),t.jsx(i,{...o})]})})})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
