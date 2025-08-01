import{j as r}from"./jsx-runtime-D_zvdyIk.js";import{B as s}from"./badge-aQXnmXeU.js";import{f as I}from"./index-B7YJKKKT.js";import{b as t}from"./utils-D76j_Oop.js";import{U}from"./user-CZ8KFWeE.js";import"./utils-D-KgF5mV.js";import"./index-C66Dxnp2.js";import"./separator-6xmuS_PL.js";import"./index-CGj_12n1.js";import"./index-COcwYKbe.js";import"./index-D8dqFcAi.js";import"./index-BBPXtLXU.js";import"./x-CubKniSv.js";import"./createLucideIcon-8Lr1oLzj.js";const L={title:"Data Display/Badge",component:s,args:{}},i={args:{},render:e=>r.jsx("div",{className:"flex flex-col items-start gap-2",children:t.map(a=>r.jsx(s,{variant:a,...e,children:a}))})},n={args:{children:"Badge",onClose:I()},render:e=>r.jsx("div",{className:"flex flex-col items-start gap-2",children:t.map(a=>r.jsx(s,{variant:a,...e,children:a}))})},d={args:{children:"Badge",onClick:I()},render:e=>r.jsx("div",{className:"flex flex-col items-start gap-2",children:t.map(a=>r.jsx(s,{variant:a,...e,children:a}))})},o={args:{children:"Badge"},render:e=>r.jsx("div",{className:"flex flex-col items-start gap-2",children:t.map(a=>r.jsxs(s,{variant:a,...e,children:[a," ",r.jsx(U,{})]}))})},c={args:{children:"Badge",iconOnly:!0},render:e=>r.jsx("div",{className:"flex flex-col items-start gap-2",children:t.map(a=>r.jsx(s,{variant:a,...e,children:r.jsx(U,{})}))})},l={args:{children:"Badge",count:10},render:e=>r.jsx("div",{className:"flex flex-col items-start gap-2",children:t.map(a=>r.jsx(s,{variant:a,...e,children:a}))})};var m,g,p;i.parameters={...i.parameters,docs:{...(m=i.parameters)==null?void 0:m.docs,source:{originalSource:`{
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
}`,...(S=(V=c.parameters)==null?void 0:V.docs)==null?void 0:S.source}}};var y,O,k;l.parameters={...l.parameters,docs:{...(y=l.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    children: 'Badge',
    count: 10
  },
  render: args => <div className="flex flex-col items-start gap-2">
      {badgeVariants.map(variant => <Badge variant={variant} {...args}>
          {variant}
        </Badge>)}
    </div>
}`,...(k=(O=l.parameters)==null?void 0:O.docs)==null?void 0:k.source}}};const M=["Variants","Closable","Clickable","WithIcon","IconOnly","WithCount"];export{d as Clickable,n as Closable,c as IconOnly,i as Variants,l as WithCount,o as WithIcon,M as __namedExportsOrder,L as default};
