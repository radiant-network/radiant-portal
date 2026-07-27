import{j as t}from"./iframe-DzVRG0r9.js";import{L as i,a as s}from"./list-item-with-action-C9qWxteb.js";import{a as n}from"./story-section-BRJcsgp1.js";import"./preload-helper-PPVm8Dsz.js";import"./button-CC3aT9NM.js";import"./action-button-iayBLEBs.js";import"./dropdown-menu-pNKsTklX.js";import"./index-BJp1TG9L.js";import"./index-OG0Rd7xy.js";import"./check-qyzdVwIr.js";import"./circle-DNcTvxaO.js";import"./separator-ZGlyiOtt.js";import"./i18n-Bn2K8w1P.js";import"./index-C6QLw8t0.js";import"./conditional-wrapper-BBX8pIPQ.js";import"./pen-CsIgtx0x.js";const{action:e}=__STORYBOOK_MODULE_ACTIONS__,f={title:"Components/Lists/List Item With Action",component:i,args:{onEdit:e("onEdit"),onDelete:e("onDelete"),onShare:e("onShare"),onClick:e("onClick")}},r={args:{title:"Title",description:"Description"},render:o=>t.jsx(n,{title:"List item with action",children:t.jsx("div",{className:"min-w-[450px]",children:t.jsxs(s,{bordered:!0,children:[t.jsx(i,{...o}),t.jsx(i,{...o}),t.jsx(i,{...o}),t.jsx(i,{...o})]})})})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
