import{j as t}from"./iframe-DY5-UQdi.js";import{L as i,a as r}from"./list-item-with-action-Dx1maxyB.js";import{a as n}from"./story-section-BfGxLv6g.js";import"./preload-helper-PPVm8Dsz.js";import"./conditional-wrapper-BBX8pIPQ.js";import"./trash-F8MC998X.js";const{action:o}=__STORYBOOK_MODULE_ACTIONS__,L={title:"Components/Lists/List Item With Action",component:i,args:{onEdit:o("onEdit"),onDelete:o("onDelete"),onShare:o("onShare"),onClick:o("onClick")}},s={args:{title:"Title",description:"Description"},render:e=>t.jsx(n,{title:"List item with action",children:t.jsx("div",{className:"min-w-[450px]",children:t.jsxs(r,{bordered:!0,children:[t.jsx(i,{...e}),t.jsx(i,{...e}),t.jsx(i,{...e}),t.jsx(i,{...e})]})})})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
}`,...s.parameters?.docs?.source}}};const x=["Default"];export{s as Default,x as __namedExportsOrder,L as default};
