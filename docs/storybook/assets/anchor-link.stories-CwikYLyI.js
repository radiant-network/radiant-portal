import{j as s}from"./iframe-ZUKLh1y0.js";import{A as a}from"./anchor-link-CQdOHQPr.js";import"./preload-helper-Dp1pzeXC.js";const g=["primary","secondary"],k=["default","xs","sm","lg"],x={title:"Links/AnchorLink",component:a,argTypes:{size:{options:k,control:{type:"select"}},variant:{options:g,control:{type:"select"}}},args:{external:!0,size:"default",variant:"primary",mono:!1}},n={args:{},render:r=>s.jsx(a,{...r,children:"Anchor Link"})},e={args:{variant:"secondary"},render:r=>s.jsx(a,{...r,children:"Anchor Link"})},o={args:{mono:!0},render:r=>s.jsx(a,{...r,children:"Anchor Link"})};var t,c,i;n.parameters={...n.parameters,docs:{...(t=n.parameters)==null?void 0:t.docs,source:{originalSource:`{
  args: {},
  render: args => {
    return <AnchorLink {...args}>Anchor Link</AnchorLink>;
  }
}`,...(i=(c=n.parameters)==null?void 0:c.docs)==null?void 0:i.source}}};var d,m,p;e.parameters={...e.parameters,docs:{...(d=e.parameters)==null?void 0:d.docs,source:{originalSource:`{
  args: {
    variant: 'secondary'
  },
  render: args => {
    return <AnchorLink {...args}>Anchor Link</AnchorLink>;
  }
}`,...(p=(m=e.parameters)==null?void 0:m.docs)==null?void 0:p.source}}};var u,h,l;o.parameters={...o.parameters,docs:{...(u=o.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    mono: true
  },
  render: args => {
    return <AnchorLink {...args}>Anchor Link</AnchorLink>;
  }
}`,...(l=(h=o.parameters)==null?void 0:h.docs)==null?void 0:l.source}}};const f=["Default","Secondary","Mono"];export{n as Default,o as Mono,e as Secondary,f as __namedExportsOrder,x as default};
