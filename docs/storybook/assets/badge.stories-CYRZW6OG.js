import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{f as U}from"./index-DPYJpPba.js";import{B as i}from"./badge-DXI8q3e3.js";import{b as t}from"./utils-D76j_Oop.js";import{U as W}from"./user-3oWHM7_v.js";import"./index-C66Dxnp2.js";import"./utils-CDN07tui.js";import"./separator-ChZWIdMg.js";import"./index-CBYaBgW8.js";import"./index-sTUCEGFJ.js";import"./index-BWnBDfn-.js";import"./index-C-d7IIsQ.js";import"./index-Dy6y0jaD.js";import"./x-4HkHZ1eq.js";import"./createLucideIcon-B119WVF5.js";const P={title:"Badges/Badge",component:i,args:{}},n={args:{},render:r=>e.jsx("div",{className:"flex flex-col items-start gap-2",children:t.map((a,s)=>e.jsx(i,{variant:a,...r,children:a},s))})},d={args:{children:"Badge",onClose:U()},render:r=>e.jsx("div",{className:"flex flex-col items-start gap-2",children:t.map((a,s)=>e.jsx(i,{variant:a,...r,children:a},s))})},o={args:{children:"Badge",onClick:U()},render:r=>e.jsx("div",{className:"flex flex-col items-start gap-2",children:t.map((a,s)=>e.jsx(i,{variant:a,...r,children:a},s))})},c={args:{children:"Badge"},render:r=>e.jsx("div",{className:"flex flex-col items-start gap-2",children:t.map((a,s)=>e.jsxs(i,{variant:a,...r,children:[a," ",e.jsx(W,{})]},s))})},l={args:{children:"Badge",iconOnly:!0},render:r=>e.jsx("div",{className:"flex flex-col items-start gap-2",children:t.map((a,s)=>e.jsx(i,{variant:a,...r,children:e.jsx(W,{})},s))})},m={args:{children:"Badge",count:10},render:r=>e.jsx("div",{className:"flex flex-col items-start gap-2",children:t.map((a,s)=>e.jsx(i,{variant:a,...r,children:a},s))})};var g,p,x;n.parameters={...n.parameters,docs:{...(g=n.parameters)==null?void 0:g.docs,source:{originalSource:`{
  args: {},
  render: args => <div className="flex flex-col items-start gap-2">
      {badgeVariants.map((variant, index) => <Badge key={index} variant={variant} {...args}>
          {variant}
        </Badge>)}
    </div>
}`,...(x=(p=n.parameters)==null?void 0:p.docs)==null?void 0:x.source}}};var v,f,h;d.parameters={...d.parameters,docs:{...(v=d.parameters)==null?void 0:v.docs,source:{originalSource:`{
  args: {
    children: 'Badge',
    onClose: fn()
  },
  render: args => <div className="flex flex-col items-start gap-2">
      {badgeVariants.map((variant, index) => <Badge key={index} variant={variant} {...args}>
          {variant}
        </Badge>)}
    </div>
}`,...(h=(f=d.parameters)==null?void 0:f.docs)==null?void 0:h.source}}};var u,B,j;o.parameters={...o.parameters,docs:{...(u=o.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    children: 'Badge',
    onClick: fn()
  },
  render: args => <div className="flex flex-col items-start gap-2">
      {badgeVariants.map((variant, index) => <Badge key={index} variant={variant} {...args}>
          {variant}
        </Badge>)}
    </div>
}`,...(j=(B=o.parameters)==null?void 0:B.docs)==null?void 0:j.source}}};var b,N,k;c.parameters={...c.parameters,docs:{...(b=c.parameters)==null?void 0:b.docs,source:{originalSource:`{
  args: {
    children: 'Badge'
  },
  render: args => <div className="flex flex-col items-start gap-2">
      {badgeVariants.map((variant, index) => <Badge key={index} variant={variant} {...args}>
          {variant} <User />
        </Badge>)}
    </div>
}`,...(k=(N=c.parameters)==null?void 0:N.docs)==null?void 0:k.source}}};var y,C,V;l.parameters={...l.parameters,docs:{...(y=l.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    children: 'Badge',
    iconOnly: true
  },
  render: args => <div className="flex flex-col items-start gap-2">
      {badgeVariants.map((variant, index) => <Badge key={index} variant={variant} {...args}>
          <User />
        </Badge>)}
    </div>
}`,...(V=(C=l.parameters)==null?void 0:C.docs)==null?void 0:V.source}}};var S,O,I;m.parameters={...m.parameters,docs:{...(S=m.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    children: 'Badge',
    count: 10
  },
  render: args => <div className="flex flex-col items-start gap-2">
      {badgeVariants.map((variant, index) => <Badge key={index} variant={variant} {...args}>
          {variant}
        </Badge>)}
    </div>
}`,...(I=(O=m.parameters)==null?void 0:O.docs)==null?void 0:I.source}}};const Q=["Variants","Closable","Clickable","WithIcon","IconOnly","WithCount"];export{o as Clickable,d as Closable,l as IconOnly,n as Variants,m as WithCount,c as WithIcon,Q as __namedExportsOrder,P as default};
