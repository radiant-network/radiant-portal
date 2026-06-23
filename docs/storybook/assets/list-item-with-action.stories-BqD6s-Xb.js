import{j as t}from"./iframe-CUHTCraV.js";import{L as i,a as s}from"./list-item-with-action-CwaO-hbl.js";import{a as n}from"./story-section-B5jupzCR.js";import"./preload-helper-PPVm8Dsz.js";import"./button-CZjHTKQy.js";import"./action-button-CdHWYpUk.js";import"./dropdown-menu-IpbMOAkX.js";import"./index-Cvvrdsfd.js";import"./index-Dd0IXZ1B.js";import"./check-DnkkXyPO.js";import"./circle-CpDNkknX.js";import"./separator-Cfebd5mI.js";import"./i18n-CvIos0gf.js";import"./index-DpmgubW-.js";import"./conditional-wrapper-BBX8pIPQ.js";import"./pen-C9NqaEsZ.js";const{action:e}=__STORYBOOK_MODULE_ACTIONS__,f={title:"Components/Lists/List Item With Action",component:i,args:{onEdit:e("onEdit"),onDelete:e("onDelete"),onShare:e("onShare"),onClick:e("onClick")}},r={args:{title:"Title",description:"Description"},render:o=>t.jsx(n,{title:"List item with action",children:t.jsx("div",{className:"min-w-[450px]",children:t.jsxs(s,{bordered:!0,children:[t.jsx(i,{...o}),t.jsx(i,{...o}),t.jsx(i,{...o}),t.jsx(i,{...o})]})})})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
