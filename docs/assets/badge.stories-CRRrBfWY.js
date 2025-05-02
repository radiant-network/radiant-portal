import{j as e}from"./jsx-runtime-Cf8x2fCZ.js";import{B as s}from"./badge-DdUfarqx.js";import{f as b}from"./index-BZkcKs8Z.js";import{U as C}from"./user-Id7UOoFp.js";import"./index-yBjzXJbu.js";import"./utils-CytzSlOG.js";import"./index-C66Dxnp2.js";import"./x-DA4wTodG.js";import"./createLucideIcon-DKFpjrVJ.js";import"./index-tvICUrOf.js";const d=["default","secondary","destructive","outline","red","orange","yellow","lime","green","cyan","blue","violet","fuchsia","slate"],_={title:"Data Display/Badge",component:s,args:{}},t={args:{},render:r=>e.jsx("div",{className:"flex flex-col items-start gap-2",children:d.map(a=>e.jsx(s,{variant:a,...r,children:a}))})},i={args:{children:"Badge",onClose:b()},render:r=>e.jsx("div",{className:"flex flex-col items-start gap-2",children:d.map(a=>e.jsx(s,{variant:a,...r,children:a}))})},n={args:{children:"Badge",onClick:b()},render:r=>e.jsx("div",{className:"flex flex-col items-start gap-2",children:d.map(a=>e.jsx(s,{variant:a,...r,children:a}))})},o={args:{children:"Badge"},render:r=>e.jsx("div",{className:"flex flex-col items-start gap-2",children:d.map(a=>e.jsxs(s,{variant:a,...r,children:[a," ",e.jsx(C,{})]}))})};var l,c,m;t.parameters={...t.parameters,docs:{...(l=t.parameters)==null?void 0:l.docs,source:{originalSource:`{
  args: {},
  render: args => <div className="flex flex-col items-start gap-2">
      {badgeVariants.map(variant => <Badge variant={variant} {...args}>
          {variant}
        </Badge>)}
    </div>
}`,...(m=(c=t.parameters)==null?void 0:c.docs)==null?void 0:m.source}}};var g,p,x;i.parameters={...i.parameters,docs:{...(g=i.parameters)==null?void 0:g.docs,source:{originalSource:`{
  args: {
    children: 'Badge',
    onClose: fn()
  },
  render: args => <div className="flex flex-col items-start gap-2">
      {badgeVariants.map(variant => <Badge variant={variant} {...args}>
          {variant}
        </Badge>)}
    </div>
}`,...(x=(p=i.parameters)==null?void 0:p.docs)==null?void 0:x.source}}};var f,v,u;n.parameters={...n.parameters,docs:{...(f=n.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    children: 'Badge',
    onClick: fn()
  },
  render: args => <div className="flex flex-col items-start gap-2">
      {badgeVariants.map(variant => <Badge variant={variant} {...args}>
          {variant}
        </Badge>)}
    </div>
}`,...(u=(v=n.parameters)==null?void 0:v.docs)==null?void 0:u.source}}};var h,B,j;o.parameters={...o.parameters,docs:{...(h=o.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: {
    children: 'Badge'
  },
  render: args => <div className="flex flex-col items-start gap-2">
      {badgeVariants.map(variant => <Badge variant={variant} {...args}>
          {variant} <User />
        </Badge>)}
    </div>
}`,...(j=(B=o.parameters)==null?void 0:B.docs)==null?void 0:j.source}}};const w=["Variants","Closable","Clickable","WithIcon"];export{n as Clickable,i as Closable,t as Variants,o as WithIcon,w as __namedExportsOrder,_ as default};
