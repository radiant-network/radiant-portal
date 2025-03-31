import{j as a}from"./jsx-runtime-Cf8x2fCZ.js";import{B as e}from"./badge-Bpyk9mKr.js";import{f}from"./index-BZkcKs8Z.js";import"./index-yBjzXJbu.js";import"./utils-BNf5BS2b.js";import"./index-C66Dxnp2.js";import"./x-DA4wTodG.js";import"./createLucideIcon-DKFpjrVJ.js";import"./index-tvICUrOf.js";const v=["primary","destructive","info","success","warning"],B=["filled","outlined"],D={title:"Base/Data Display/Badge",component:e,tags:["autodocs"],args:{variant:"filled",color:"primary"}},r={args:{},render:()=>a.jsxs("div",{className:"flex flex-col gap-2",children:[v.map(o=>a.jsx("div",{className:"flex gap-2",children:B.map(i=>a.jsx(e,{color:o,variant:i,children:i}))})),a.jsxs("div",{className:"flex gap-2",children:[a.jsx(e,{className:"bg-magenta-700",children:"Custom"}),a.jsx(e,{className:"text-magenta-700 border-magenta-700",variant:"outlined",children:"Custom"})]})]})},s={args:{children:"Badge",onClose:f()},render:o=>a.jsx(e,{...o})},n={args:{},render:()=>a.jsxs("div",{className:"flex items-start gap-2",children:[a.jsx(e,{size:"sm",children:"Small"}),a.jsx(e,{size:"md",color:"primary",children:"Medium"}),a.jsx(e,{size:"lg",color:"primary",children:"Large"})]})};var t,d,l;r.parameters={...r.parameters,docs:{...(t=r.parameters)==null?void 0:t.docs,source:{originalSource:`{
  args: {},
  render: () => <div className="flex flex-col gap-2">
      {badgeColors.map(color => {
      return <div className="flex gap-2">
            {badgeVariants.map(variant => <Badge color={color} variant={variant}>
                {variant}
              </Badge>)}
          </div>;
    })}
      <div className="flex gap-2">
        <Badge className="bg-magenta-700">Custom</Badge>
        <Badge className="text-magenta-700 border-magenta-700" variant="outlined">
          Custom
        </Badge>
      </div>
    </div>
}`,...(l=(d=r.parameters)==null?void 0:d.docs)==null?void 0:l.source}}};var m,c,g;s.parameters={...s.parameters,docs:{...(m=s.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    children: 'Badge',
    onClose: fn()
  },
  render: args => <Badge {...args} />
}`,...(g=(c=s.parameters)==null?void 0:c.docs)==null?void 0:g.source}}};var p,x,u;n.parameters={...n.parameters,docs:{...(p=n.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {},
  render: () => <div className="flex items-start gap-2">
      <Badge size="sm">Small</Badge>
      <Badge size="md" color="primary">
        Medium
      </Badge>
      <Badge size="lg" color="primary">
        Large
      </Badge>
    </div>
}`,...(u=(x=n.parameters)==null?void 0:x.docs)==null?void 0:u.source}}};const E=["Variants","Closable","Sizes"];export{s as Closable,n as Sizes,r as Variants,E as __namedExportsOrder,D as default};
