import{j as e}from"./iframe-QXLGoJMs.js";import{B as i}from"./badge-D9pn_Pzm.js";import{b as t}from"./utils-D76j_Oop.js";import{U}from"./user-DhmGKiQT.js";import"./preload-helper-Dp1pzeXC.js";import"./separator-DCKEFDva.js";import"./index-DYoPxbEx.js";import"./x-Ba-rQlsM.js";const{fn:E}=__STORYBOOK_MODULE_TEST__,Y={title:"Badges/Badge",component:i,args:{}},n={args:{},render:r=>e.jsx("div",{className:"flex flex-col items-start gap-2",children:t.map((a,s)=>e.jsx(i,{variant:a,...r,children:a},s))})},d={args:{children:"Badge",onClose:E()},render:r=>e.jsx("div",{className:"flex flex-col items-start gap-2",children:t.map((a,s)=>e.jsx(i,{variant:a,...r,children:a},s))})},c={args:{children:"Badge",onClick:E()},render:r=>e.jsx("div",{className:"flex flex-col items-start gap-2",children:t.map((a,s)=>e.jsx(i,{variant:a,...r,children:a},s))})},o={args:{children:"Badge"},render:r=>e.jsx("div",{className:"flex flex-col items-start gap-2",children:t.map((a,s)=>e.jsxs(i,{variant:a,...r,children:[a," ",e.jsx(U,{})]},s))})},l={args:{children:"Badge",iconOnly:!0},render:r=>e.jsx("div",{className:"flex flex-col items-start gap-2",children:t.map((a,s)=>e.jsx(i,{variant:a,...r,children:e.jsx(U,{})},s))})},m={args:{children:"Badge",count:10},render:r=>e.jsx("div",{className:"flex flex-col items-start gap-2",children:t.map((a,s)=>e.jsx(i,{variant:a,...r,children:a},s))})};var g,p,x;n.parameters={...n.parameters,docs:{...(g=n.parameters)==null?void 0:g.docs,source:{originalSource:`{
  args: {},
  render: args => <div className="flex flex-col items-start gap-2">
      {badgeVariants.map((variant, index) => <Badge key={index} variant={variant} {...args}>
          {variant}
        </Badge>)}
    </div>
}`,...(x=(p=n.parameters)==null?void 0:p.docs)==null?void 0:x.source}}};var v,f,B;d.parameters={...d.parameters,docs:{...(v=d.parameters)==null?void 0:v.docs,source:{originalSource:`{
  args: {
    children: 'Badge',
    onClose: fn()
  },
  render: args => <div className="flex flex-col items-start gap-2">
      {badgeVariants.map((variant, index) => <Badge key={index} variant={variant} {...args}>
          {variant}
        </Badge>)}
    </div>
}`,...(B=(f=d.parameters)==null?void 0:f.docs)==null?void 0:B.source}}};var h,u,j;c.parameters={...c.parameters,docs:{...(h=c.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: {
    children: 'Badge',
    onClick: fn()
  },
  render: args => <div className="flex flex-col items-start gap-2">
      {badgeVariants.map((variant, index) => <Badge key={index} variant={variant} {...args}>
          {variant}
        </Badge>)}
    </div>
}`,...(j=(u=c.parameters)==null?void 0:u.docs)==null?void 0:j.source}}};var b,N,k;o.parameters={...o.parameters,docs:{...(b=o.parameters)==null?void 0:b.docs,source:{originalSource:`{
  args: {
    children: 'Badge'
  },
  render: args => <div className="flex flex-col items-start gap-2">
      {badgeVariants.map((variant, index) => <Badge key={index} variant={variant} {...args}>
          {variant} <User />
        </Badge>)}
    </div>
}`,...(k=(N=o.parameters)==null?void 0:N.docs)==null?void 0:k.source}}};var y,C,O;l.parameters={...l.parameters,docs:{...(y=l.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    children: 'Badge',
    iconOnly: true
  },
  render: args => <div className="flex flex-col items-start gap-2">
      {badgeVariants.map((variant, index) => <Badge key={index} variant={variant} {...args}>
          <User />
        </Badge>)}
    </div>
}`,...(O=(C=l.parameters)==null?void 0:C.docs)==null?void 0:O.source}}};var V,S,_;m.parameters={...m.parameters,docs:{...(V=m.parameters)==null?void 0:V.docs,source:{originalSource:`{
  args: {
    children: 'Badge',
    count: 10
  },
  render: args => <div className="flex flex-col items-start gap-2">
      {badgeVariants.map((variant, index) => <Badge key={index} variant={variant} {...args}>
          {variant}
        </Badge>)}
    </div>
}`,...(_=(S=m.parameters)==null?void 0:S.docs)==null?void 0:_.source}}};const q=["Variants","Closable","Clickable","WithIcon","IconOnly","WithCount"];export{c as Clickable,d as Closable,l as IconOnly,n as Variants,m as WithCount,o as WithIcon,q as __namedExportsOrder,Y as default};
