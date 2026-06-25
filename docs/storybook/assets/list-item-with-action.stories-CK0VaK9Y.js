import{j as t}from"./iframe-x0eT-xyE.js";import{L as i,a as s}from"./list-item-with-action-vuuy9GGc.js";import{a as n}from"./story-section-B-UwUZjU.js";import"./preload-helper-PPVm8Dsz.js";import"./button-DKCq0MjW.js";import"./action-button-BSoyb7Vm.js";import"./dropdown-menu-B_gNLwrH.js";import"./index-dE50l6Wk.js";import"./index-Ol_TykaS.js";import"./check-C2XjndMj.js";import"./circle-B80l30cz.js";import"./separator-Da2YlRWj.js";import"./i18n-ETpqMXvg.js";import"./index-DFPPf6dC.js";import"./conditional-wrapper-BBX8pIPQ.js";import"./pen-BTDNxieO.js";const{action:e}=__STORYBOOK_MODULE_ACTIONS__,f={title:"Components/Lists/List Item With Action",component:i,args:{onEdit:e("onEdit"),onDelete:e("onDelete"),onShare:e("onShare"),onClick:e("onClick")}},r={args:{title:"Title",description:"Description"},render:o=>t.jsx(n,{title:"List item with action",children:t.jsx("div",{className:"min-w-[450px]",children:t.jsxs(s,{bordered:!0,children:[t.jsx(i,{...o}),t.jsx(i,{...o}),t.jsx(i,{...o}),t.jsx(i,{...o})]})})})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
