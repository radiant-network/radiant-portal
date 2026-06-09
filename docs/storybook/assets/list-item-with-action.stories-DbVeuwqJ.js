import{j as t}from"./iframe-CKiE6Nsl.js";import{L as i,a as s}from"./list-item-with-action-DBPBiAzA.js";import{a as n}from"./story-section-CH_OnjTD.js";import"./preload-helper-PPVm8Dsz.js";import"./button-Cy6cW3zr.js";import"./index-9FrZzKeW.js";import"./action-button-skYf-9FP.js";import"./dropdown-menu-DVEsqO9M.js";import"./index-CpQDBSVi.js";import"./index-CZWpuSYx.js";import"./check-CQNASh0O.js";import"./circle-B0UttFdb.js";import"./separator-D0Yo1ak_.js";import"./i18n-ZTG9nugd.js";import"./index-CAH79BqJ.js";import"./conditional-wrapper-BBX8pIPQ.js";import"./pen-BN0IUvfi.js";const{action:e}=__STORYBOOK_MODULE_ACTIONS__,g={title:"Components/Lists/List Item With Action",component:i,args:{onEdit:e("onEdit"),onDelete:e("onDelete"),onShare:e("onShare"),onClick:e("onClick")}},r={args:{title:"Title",description:"Description"},render:o=>t.jsx(n,{title:"List item with action",children:t.jsx("div",{className:"min-w-[450px]",children:t.jsxs(s,{bordered:!0,children:[t.jsx(i,{...o}),t.jsx(i,{...o}),t.jsx(i,{...o}),t.jsx(i,{...o})]})})})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
