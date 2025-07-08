import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{B as s}from"./badge-D_UfbDzk.js";import{f as y}from"./index-B7YJKKKT.js";import{b as t}from"./utils-D76j_Oop.js";import{U as O}from"./user-Dv_C2EEw.js";import"./utils-D-KgF5mV.js";import"./index-C66Dxnp2.js";import"./x-ClsbQ_rO.js";import"./createLucideIcon-BMP5cxO1.js";import"./index-DQLiH3RP.js";const w={title:"Data Display/Badge",component:s,args:{}},i={args:{},render:r=>e.jsx("div",{className:"flex flex-col items-start gap-2",children:t.map(a=>e.jsx(s,{variant:a,...r,children:a}))})},n={args:{children:"Badge",onClose:y()},render:r=>e.jsx("div",{className:"flex flex-col items-start gap-2",children:t.map(a=>e.jsx(s,{variant:a,...r,children:a}))})},d={args:{children:"Badge",onClick:y()},render:r=>e.jsx("div",{className:"flex flex-col items-start gap-2",children:t.map(a=>e.jsx(s,{variant:a,...r,children:a}))})},c={args:{children:"Badge"},render:r=>e.jsx("div",{className:"flex flex-col items-start gap-2",children:t.map(a=>e.jsxs(s,{variant:a,...r,children:[a," ",e.jsx(O,{})]}))})},o={args:{children:"Badge",iconOnly:!0},render:r=>e.jsx("div",{className:"flex flex-col items-start gap-2",children:t.map(a=>e.jsx(s,{variant:a,...r,children:e.jsx(O,{})}))})};var l,m,g;i.parameters={...i.parameters,docs:{...(l=i.parameters)==null?void 0:l.docs,source:{originalSource:`{
  args: {},
  render: args => <div className="flex flex-col items-start gap-2">
      {badgeVariants.map(variant => <Badge variant={variant} {...args}>
          {variant}
        </Badge>)}
    </div>
}`,...(g=(m=i.parameters)==null?void 0:m.docs)==null?void 0:g.source}}};var p,x,f;n.parameters={...n.parameters,docs:{...(p=n.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    children: 'Badge',
    onClose: fn()
  },
  render: args => <div className="flex flex-col items-start gap-2">
      {badgeVariants.map(variant => <Badge variant={variant} {...args}>
          {variant}
        </Badge>)}
    </div>
}`,...(f=(x=n.parameters)==null?void 0:x.docs)==null?void 0:f.source}}};var v,B,h;d.parameters={...d.parameters,docs:{...(v=d.parameters)==null?void 0:v.docs,source:{originalSource:`{
  args: {
    children: 'Badge',
    onClick: fn()
  },
  render: args => <div className="flex flex-col items-start gap-2">
      {badgeVariants.map(variant => <Badge variant={variant} {...args}>
          {variant}
        </Badge>)}
    </div>
}`,...(h=(B=d.parameters)==null?void 0:B.docs)==null?void 0:h.source}}};var u,j,b;c.parameters={...c.parameters,docs:{...(u=c.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    children: 'Badge'
  },
  render: args => <div className="flex flex-col items-start gap-2">
      {badgeVariants.map(variant => <Badge variant={variant} {...args}>
          {variant} <User />
        </Badge>)}
    </div>
}`,...(b=(j=c.parameters)==null?void 0:j.docs)==null?void 0:b.source}}};var N,C,V;o.parameters={...o.parameters,docs:{...(N=o.parameters)==null?void 0:N.docs,source:{originalSource:`{
  args: {
    children: 'Badge',
    iconOnly: true
  },
  render: args => <div className="flex flex-col items-start gap-2">
      {badgeVariants.map(variant => <Badge variant={variant} {...args}>
          <User />
        </Badge>)}
    </div>
}`,...(V=(C=o.parameters)==null?void 0:C.docs)==null?void 0:V.source}}};const z=["Variants","Closable","Clickable","WithIcon","IconOnly"];export{d as Clickable,n as Closable,o as IconOnly,i as Variants,c as WithIcon,z as __namedExportsOrder,w as default};
