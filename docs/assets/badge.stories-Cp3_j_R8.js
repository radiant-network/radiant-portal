import{j as r}from"./jsx-runtime-Cf8x2fCZ.js";import{B as s}from"./badge-DOB1r4x9.js";import{fn as b}from"./index-Cf3xVBfy.js";import{b as d}from"./utils-4U2-jAxh.js";import{U as C}from"./user-iqzSZKBv.js";import"./index-yBjzXJbu.js";import"./utils-CytzSlOG.js";import"./index-C66Dxnp2.js";import"./x-Bt7o6wSZ.js";import"./createLucideIcon-BOZfVBeY.js";import"./index-t5q4d8OJ.js";const O={title:"Data Display/Badge",component:s,args:{}},t={args:{},render:e=>r.jsx("div",{className:"flex flex-col items-start gap-2",children:d.map(a=>r.jsx(s,{variant:a,...e,children:a}))})},i={args:{children:"Badge",onClose:b()},render:e=>r.jsx("div",{className:"flex flex-col items-start gap-2",children:d.map(a=>r.jsx(s,{variant:a,...e,children:a}))})},o={args:{children:"Badge",onClick:b()},render:e=>r.jsx("div",{className:"flex flex-col items-start gap-2",children:d.map(a=>r.jsx(s,{variant:a,...e,children:a}))})},n={args:{children:"Badge"},render:e=>r.jsx("div",{className:"flex flex-col items-start gap-2",children:d.map(a=>r.jsxs(s,{variant:a,...e,children:[a," ",r.jsx(C,{})]}))})};var c,l,m;t.parameters={...t.parameters,docs:{...(c=t.parameters)==null?void 0:c.docs,source:{originalSource:`{
  args: {},
  render: args => <div className="flex flex-col items-start gap-2">
      {badgeVariants.map(variant => <Badge variant={variant} {...args}>
          {variant}
        </Badge>)}
    </div>
}`,...(m=(l=t.parameters)==null?void 0:l.docs)==null?void 0:m.source}}};var g,p,x;i.parameters={...i.parameters,docs:{...(g=i.parameters)==null?void 0:g.docs,source:{originalSource:`{
  args: {
    children: 'Badge',
    onClose: fn()
  },
  render: args => <div className="flex flex-col items-start gap-2">
      {badgeVariants.map(variant => <Badge variant={variant} {...args}>
          {variant}
        </Badge>)}
    </div>
}`,...(x=(p=i.parameters)==null?void 0:p.docs)==null?void 0:x.source}}};var f,v,B;o.parameters={...o.parameters,docs:{...(f=o.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    children: 'Badge',
    onClick: fn()
  },
  render: args => <div className="flex flex-col items-start gap-2">
      {badgeVariants.map(variant => <Badge variant={variant} {...args}>
          {variant}
        </Badge>)}
    </div>
}`,...(B=(v=o.parameters)==null?void 0:v.docs)==null?void 0:B.source}}};var h,u,j;n.parameters={...n.parameters,docs:{...(h=n.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: {
    children: 'Badge'
  },
  render: args => <div className="flex flex-col items-start gap-2">
      {badgeVariants.map(variant => <Badge variant={variant} {...args}>
          {variant} <User />
        </Badge>)}
    </div>
}`,...(j=(u=n.parameters)==null?void 0:u.docs)==null?void 0:j.source}}};const R=["Variants","Closable","Clickable","WithIcon"];export{o as Clickable,i as Closable,t as Variants,n as WithIcon,R as __namedExportsOrder,O as default};
