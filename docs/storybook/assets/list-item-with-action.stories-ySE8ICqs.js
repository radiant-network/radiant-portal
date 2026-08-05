import{j as t}from"./iframe-BzMpq4Hc.js";import{L as i,a as s}from"./list-item-with-action-BpJxh5Mw.js";import{a as n}from"./story-section-DVNANUlR.js";import"./preload-helper-PPVm8Dsz.js";import"./button-G_7WvFjb.js";import"./action-button-f97mKVJz.js";import"./dropdown-menu-dmEKL98B.js";import"./index-BG0WSpn-.js";import"./index-Cc45Ah96.js";import"./check-BBp2wSs8.js";import"./circle-Cikc3-Oi.js";import"./separator-BoZNDwc5.js";import"./i18n-DgcYhEYb.js";import"./index-DsnHWkyF.js";import"./conditional-wrapper-BBX8pIPQ.js";import"./pen-DHm1NQPK.js";const{action:e}=__STORYBOOK_MODULE_ACTIONS__,f={title:"Components/Lists/List Item With Action",component:i,args:{onEdit:e("onEdit"),onDelete:e("onDelete"),onShare:e("onShare"),onClick:e("onClick")}},r={args:{title:"Title",description:"Description"},render:o=>t.jsx(n,{title:"List item with action",children:t.jsx("div",{className:"min-w-[450px]",children:t.jsxs(s,{bordered:!0,children:[t.jsx(i,{...o}),t.jsx(i,{...o}),t.jsx(i,{...o}),t.jsx(i,{...o})]})})})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
