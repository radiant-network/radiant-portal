import{j as r}from"./jsx-runtime-Cf8x2fCZ.js";import{B as d}from"./badge-DKlDNltV.js";import{f as x}from"./index-BZkcKs8Z.js";import"./index-yBjzXJbu.js";import"./utils-BNf5BS2b.js";import"./index-C66Dxnp2.js";import"./x-DA4wTodG.js";import"./createLucideIcon-DKFpjrVJ.js";import"./index-tvICUrOf.js";const B=["default","secondary","destructive","outline"],v=["default","sm","md"],D={title:"Base/Data Display/Badge",component:d,tags:["autodocs"],args:{}},s={args:{size:"default"},render:e=>r.jsx("div",{className:"flex flex-col items-start gap-2",children:B.map(a=>r.jsx(d,{variant:a,...e,children:a}))})},t={args:{children:"Badge",onClose:x()},render:e=>r.jsx(d,{...e})},o={args:{variant:"default"},render:e=>r.jsx("div",{className:"flex flex-col items-start gap-2",children:v.map(a=>r.jsxs(d,{size:a,...e,children:["Badge ",a]}))})};var i,n,c;s.parameters={...s.parameters,docs:{...(i=s.parameters)==null?void 0:i.docs,source:{originalSource:`{
  args: {
    size: 'default'
  },
  render: args => <div className="flex flex-col items-start gap-2">
      {badgeVariants.map(variant => <Badge variant={variant} {...args}>
          {variant}
        </Badge>)}
    </div>
}`,...(c=(n=s.parameters)==null?void 0:n.docs)==null?void 0:c.source}}};var m,l,g;t.parameters={...t.parameters,docs:{...(m=t.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    children: 'Badge',
    onClose: fn()
  },
  render: args => <Badge {...args} />
}`,...(g=(l=t.parameters)==null?void 0:l.docs)==null?void 0:g.source}}};var p,u,f;o.parameters={...o.parameters,docs:{...(p=o.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    variant: 'default'
  },
  render: args => {
    return <div className="flex flex-col items-start gap-2">
        {badgeSizes.map(size => <Badge size={size} {...args}>
            Badge {size}
          </Badge>)}
      </div>;
  }
}`,...(f=(u=o.parameters)==null?void 0:u.docs)==null?void 0:f.source}}};const E=["Variants","Closable","Sizes"];export{t as Closable,o as Sizes,s as Variants,E as __namedExportsOrder,D as default};
