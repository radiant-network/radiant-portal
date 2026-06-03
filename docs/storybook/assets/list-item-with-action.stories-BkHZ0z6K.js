import{j as t}from"./iframe-ELwkN4WH.js";import{L as i,a as s}from"./list-item-with-action-BMJ8pSSZ.js";import{a as n}from"./story-section-BW9mZuMq.js";import"./preload-helper-PPVm8Dsz.js";import"./button-DVxJRXa8.js";import"./index-Ct7crFnJ.js";import"./action-button-B8RD553Y.js";import"./dropdown-menu-B5W2V41I.js";import"./index-DrATjyRU.js";import"./index-Ts0_7Z4Q.js";import"./check-BwKrSwsD.js";import"./circle-BM1LvZdU.js";import"./separator-DOzexuXx.js";import"./i18n-DRl3AD0J.js";import"./index-BIP8QzMY.js";import"./conditional-wrapper-BBX8pIPQ.js";import"./pen-C6c0Pzbd.js";const{action:e}=__STORYBOOK_MODULE_ACTIONS__,g={title:"Components/Lists/List Item With Action",component:i,args:{onEdit:e("onEdit"),onDelete:e("onDelete"),onShare:e("onShare"),onClick:e("onClick")}},r={args:{title:"Title",description:"Description"},render:o=>t.jsx(n,{title:"List item with action",children:t.jsx("div",{className:"min-w-[450px]",children:t.jsxs(s,{bordered:!0,children:[t.jsx(i,{...o}),t.jsx(i,{...o}),t.jsx(i,{...o}),t.jsx(i,{...o})]})})})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
