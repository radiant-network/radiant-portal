import{j as s}from"./iframe-X1FdiBKE.js";import{A as a}from"./anchor-link-ehMFHXco.js";import"./preload-helper-PPVm8Dsz.js";const t=["primary","secondary"],c=["default","xs","sm","lg"],p={title:"Links/AnchorLink",component:a,argTypes:{size:{options:c,control:{type:"select"}},variant:{options:t,control:{type:"select"}}},args:{external:!0,size:"default",variant:"primary",mono:!1}},n={args:{},render:r=>s.jsx(a,{...r,children:"Anchor Link"})},e={args:{variant:"secondary"},render:r=>s.jsx(a,{...r,children:"Anchor Link"})},o={args:{mono:!0},render:r=>s.jsx(a,{...r,children:"Anchor Link"})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {},
  render: args => {
    return <AnchorLink {...args}>Anchor Link</AnchorLink>;
  }
}`,...n.parameters?.docs?.source}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'secondary'
  },
  render: args => {
    return <AnchorLink {...args}>Anchor Link</AnchorLink>;
  }
}`,...e.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    mono: true
  },
  render: args => {
    return <AnchorLink {...args}>Anchor Link</AnchorLink>;
  }
}`,...o.parameters?.docs?.source}}};const u=["Default","Secondary","Mono"];export{n as Default,o as Mono,e as Secondary,u as __namedExportsOrder,p as default};
