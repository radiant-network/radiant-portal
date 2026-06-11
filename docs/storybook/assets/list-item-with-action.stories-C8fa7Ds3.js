import{j as t}from"./iframe-5hjCxaQ_.js";import{L as i,a as s}from"./list-item-with-action-D06WO2P3.js";import{a as n}from"./story-section-Dz-VNK5b.js";import"./preload-helper-PPVm8Dsz.js";import"./button-BFdsQ3Kp.js";import"./index-526z61a1.js";import"./action-button-Cl-iR9-B.js";import"./dropdown-menu-BxaMWWIo.js";import"./index-NgiKxE6c.js";import"./index-DJkBUnxK.js";import"./check-DQDqWsNZ.js";import"./circle-D6MwNdjA.js";import"./separator-CdreFVRa.js";import"./i18n-BCVPTX9O.js";import"./index-DwABPnsI.js";import"./conditional-wrapper-BBX8pIPQ.js";import"./pen-Cif18fOV.js";const{action:e}=__STORYBOOK_MODULE_ACTIONS__,g={title:"Components/Lists/List Item With Action",component:i,args:{onEdit:e("onEdit"),onDelete:e("onDelete"),onShare:e("onShare"),onClick:e("onClick")}},r={args:{title:"Title",description:"Description"},render:o=>t.jsx(n,{title:"List item with action",children:t.jsx("div",{className:"min-w-[450px]",children:t.jsxs(s,{bordered:!0,children:[t.jsx(i,{...o}),t.jsx(i,{...o}),t.jsx(i,{...o}),t.jsx(i,{...o})]})})})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
