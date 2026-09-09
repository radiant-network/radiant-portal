import{j as t}from"./iframe-CgZaKe5d.js";import{L as i,a as r}from"./list-item-with-action-B0J1Dfdl.js";import{a as n}from"./story-section-Cd-IQlgl.js";import"./preload-helper-PPVm8Dsz.js";import"./conditional-wrapper-BBX8pIPQ.js";const{action:s}=__STORYBOOK_MODULE_ACTIONS__,p={title:"Components/Lists/List Item With Action",component:i,args:{onEdit:s("onEdit"),onDelete:s("onDelete"),onShare:s("onShare"),onClick:s("onClick")}},o={args:{title:"Title",description:"Description"},render:e=>t.jsx(n,{title:"List item with action",children:t.jsx("div",{className:"min-w-[450px]",children:t.jsxs(r,{bordered:!0,children:[t.jsx(i,{...e}),t.jsx(i,{...e}),t.jsx(i,{...e}),t.jsx(i,{...e})]})})})};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
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
}`,...o.parameters?.docs?.source}}};const L=["Default"];export{o as Default,L as __namedExportsOrder,p as default};
