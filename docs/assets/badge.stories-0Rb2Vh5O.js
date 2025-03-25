import{j as a}from"./jsx-runtime-D_zvdyIk.js";import{B as e}from"./badge-BJQVajEj.js";import{f}from"./index-DZ0MIZXx.js";import"./utils-BNf5BS2b.js";import"./index-C66Dxnp2.js";import"./x-Cz0A3g9-.js";import"./createLucideIcon-BJ1WAg3L.js";import"./index-DUAV1Q2A.js";const v=["primary","destructive","info","success","warning"],B=["filled","outlined"],V={title:"Base/Data Display/Badge",component:e,tags:["autodocs"],args:{variant:"filled",color:"primary"}},r={args:{},render:()=>a.jsxs("div",{className:"flex flex-col gap-2",children:[v.map(o=>a.jsx("div",{className:"flex gap-2",children:B.map(i=>a.jsx(e,{color:o,variant:i,children:i}))})),a.jsxs("div",{className:"flex gap-2",children:[a.jsx(e,{className:"bg-magenta-700",children:"Custom"}),a.jsx(e,{className:"text-magenta-700 border-magenta-700",variant:"outlined",children:"Custom"})]})]})},s={args:{children:"Badge",onClose:f()},render:o=>a.jsx(e,{...o})},n={args:{},render:()=>a.jsxs("div",{className:"flex items-start gap-2",children:[a.jsx(e,{size:"sm",children:"Small"}),a.jsx(e,{size:"md",color:"primary",children:"Medium"}),a.jsx(e,{size:"lg",color:"primary",children:"Large"})]})};var d,t,l;r.parameters={...r.parameters,docs:{...(d=r.parameters)==null?void 0:d.docs,source:{originalSource:`{
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
}`,...(l=(t=r.parameters)==null?void 0:t.docs)==null?void 0:l.source}}};var m,c,g;s.parameters={...s.parameters,docs:{...(m=s.parameters)==null?void 0:m.docs,source:{originalSource:`{
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
}`,...(u=(x=n.parameters)==null?void 0:x.docs)==null?void 0:u.source}}};const D=["Variants","Closable","Sizes"];export{s as Closable,n as Sizes,r as Variants,D as __namedExportsOrder,V as default};
