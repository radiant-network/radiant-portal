import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{B as s}from"./badge-B5hMF8F4.js";import{f as I}from"./index-DtL3pAzF.js";import{b as t}from"./utils-D76j_Oop.js";import{U}from"./user-3oWHM7_v.js";import"./index-C66Dxnp2.js";import"./utils-D-KgF5mV.js";import"./separator-B36Ht569.js";import"./index-CBYaBgW8.js";import"./index-Dut9wsGU.js";import"./index-sTUCEGFJ.js";import"./index-BWnBDfn-.js";import"./x-4HkHZ1eq.js";import"./createLucideIcon-B119WVF5.js";const L={title:"Badges/Badge",component:s,args:{}},i={args:{},render:r=>e.jsx("div",{className:"flex flex-col items-start gap-2",children:t.map(a=>e.jsx(s,{variant:a,...r,children:a}))})},n={args:{children:"Badge",onClose:I()},render:r=>e.jsx("div",{className:"flex flex-col items-start gap-2",children:t.map(a=>e.jsx(s,{variant:a,...r,children:a}))})},d={args:{children:"Badge",onClick:I()},render:r=>e.jsx("div",{className:"flex flex-col items-start gap-2",children:t.map(a=>e.jsx(s,{variant:a,...r,children:a}))})},o={args:{children:"Badge"},render:r=>e.jsx("div",{className:"flex flex-col items-start gap-2",children:t.map(a=>e.jsxs(s,{variant:a,...r,children:[a," ",e.jsx(U,{})]}))})},c={args:{children:"Badge",iconOnly:!0},render:r=>e.jsx("div",{className:"flex flex-col items-start gap-2",children:t.map(a=>e.jsx(s,{variant:a,...r,children:e.jsx(U,{})}))})},l={args:{children:"Badge",count:10},render:r=>e.jsx("div",{className:"flex flex-col items-start gap-2",children:t.map(a=>e.jsx(s,{variant:a,...r,children:a}))})};var m,g,p;i.parameters={...i.parameters,docs:{...(m=i.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {},
  render: args => <div className="flex flex-col items-start gap-2">
      {badgeVariants.map(variant => <Badge variant={variant} {...args}>
          {variant}
        </Badge>)}
    </div>
}`,...(p=(g=i.parameters)==null?void 0:g.docs)==null?void 0:p.source}}};var x,v,f;n.parameters={...n.parameters,docs:{...(x=n.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: {
    children: 'Badge',
    onClose: fn()
  },
  render: args => <div className="flex flex-col items-start gap-2">
      {badgeVariants.map(variant => <Badge variant={variant} {...args}>
          {variant}
        </Badge>)}
    </div>
}`,...(f=(v=n.parameters)==null?void 0:v.docs)==null?void 0:f.source}}};var h,u,B;d.parameters={...d.parameters,docs:{...(h=d.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: {
    children: 'Badge',
    onClick: fn()
  },
  render: args => <div className="flex flex-col items-start gap-2">
      {badgeVariants.map(variant => <Badge variant={variant} {...args}>
          {variant}
        </Badge>)}
    </div>
}`,...(B=(u=d.parameters)==null?void 0:u.docs)==null?void 0:B.source}}};var j,b,N;o.parameters={...o.parameters,docs:{...(j=o.parameters)==null?void 0:j.docs,source:{originalSource:`{
  args: {
    children: 'Badge'
  },
  render: args => <div className="flex flex-col items-start gap-2">
      {badgeVariants.map(variant => <Badge variant={variant} {...args}>
          {variant} <User />
        </Badge>)}
    </div>
}`,...(N=(b=o.parameters)==null?void 0:b.docs)==null?void 0:N.source}}};var C,V,S;c.parameters={...c.parameters,docs:{...(C=c.parameters)==null?void 0:C.docs,source:{originalSource:`{
  args: {
    children: 'Badge',
    iconOnly: true
  },
  render: args => <div className="flex flex-col items-start gap-2">
      {badgeVariants.map(variant => <Badge variant={variant} {...args}>
          <User />
        </Badge>)}
    </div>
}`,...(S=(V=c.parameters)==null?void 0:V.docs)==null?void 0:S.source}}};var O,k,y;l.parameters={...l.parameters,docs:{...(O=l.parameters)==null?void 0:O.docs,source:{originalSource:`{
  args: {
    children: 'Badge',
    count: 10
  },
  render: args => <div className="flex flex-col items-start gap-2">
      {badgeVariants.map(variant => <Badge variant={variant} {...args}>
          {variant}
        </Badge>)}
    </div>
}`,...(y=(k=l.parameters)==null?void 0:k.docs)==null?void 0:y.source}}};const M=["Variants","Closable","Clickable","WithIcon","IconOnly","WithCount"];export{d as Clickable,n as Closable,c as IconOnly,i as Variants,l as WithCount,o as WithIcon,M as __namedExportsOrder,L as default};
