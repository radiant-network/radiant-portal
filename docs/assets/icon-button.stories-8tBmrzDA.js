import{j as o}from"./jsx-runtime-D_zvdyIk.js";import{f as k}from"./index-DZ0MIZXx.js";import{I as a}from"./IconButton-C7j2XGxo.js";import{b as v,a as H}from"./utils-DXcs_An2.js";import{c as j}from"./createLucideIcon-BJ1WAg3L.js";import"./button.variants-DG8R81Cn.js";import"./index-C66Dxnp2.js";import"./utils-BNf5BS2b.js";import"./index-DUAV1Q2A.js";/**
 * @license lucide-react v0.482.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const b=[["path",{d:"M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z",key:"c3ymky"}],["path",{d:"M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08c.82.82 2.13.85 3 .07l2.07-1.9a2.82 2.82 0 0 1 3.79 0l2.96 2.66",key:"4oyue0"}],["path",{d:"m18 15-2-2",key:"60u0ii"}],["path",{d:"m15 18-2-2",key:"6p76be"}]],i=j("HeartHandshake",b),M={title:"Base/Buttons/Icon Button",component:a,tags:["autodocs"],args:{onClick:k(),size:"default"}},n={args:{icon:i},render:r=>o.jsx("div",{className:"flex flex-col gap-2",children:v.map(I=>o.jsx("div",{className:"flex gap-2",children:H.map(z=>o.jsx(a,{icon:r.icon,color:I,variant:z}))}))})},e={args:{icon:i},render:r=>o.jsxs("div",{className:"flex gap-2",children:[o.jsx(a,{color:"primary",size:"default",icon:r.icon}),o.jsx(a,{color:"primary",size:"xs",icon:r.icon}),o.jsx(a,{color:"primary",size:"sm",icon:r.icon}),o.jsx(a,{color:"primary",size:"md",icon:r.icon}),o.jsx(a,{color:"primary",size:"lg",icon:r.icon})]})},s={args:{icon:i,children:"Button",loading:!0,color:"primary"}},c={args:{icon:i,children:"Button",disabled:!0,color:"primary"}};var t,m,d;n.parameters={...n.parameters,docs:{...(t=n.parameters)==null?void 0:t.docs,source:{originalSource:`{
  args: {
    icon: HeartHandshakeIcon
  },
  render: args => <div className="flex flex-col gap-2">
      {buttonColors.map(color => {
      return <div className="flex gap-2">
            {buttonVariants.map(variant => <IconButton icon={args.icon} color={color} variant={variant} />)}
          </div>;
    })}
    </div>
}`,...(d=(m=n.parameters)==null?void 0:m.docs)==null?void 0:d.source}}};var l,p,u;e.parameters={...e.parameters,docs:{...(l=e.parameters)==null?void 0:l.docs,source:{originalSource:`{
  args: {
    icon: HeartHandshakeIcon
  },
  render: args => <div className="flex gap-2">
      <IconButton color="primary" size="default" icon={args.icon} />
      <IconButton color="primary" size="xs" icon={args.icon} />
      <IconButton color="primary" size="sm" icon={args.icon} />
      <IconButton color="primary" size="md" icon={args.icon} />
      <IconButton color="primary" size="lg" icon={args.icon} />
    </div>
}`,...(u=(p=e.parameters)==null?void 0:p.docs)==null?void 0:u.source}}};var g,x,y;s.parameters={...s.parameters,docs:{...(g=s.parameters)==null?void 0:g.docs,source:{originalSource:`{
  args: {
    icon: HeartHandshakeIcon,
    children: "Button",
    loading: true,
    color: "primary"
  }
}`,...(y=(x=s.parameters)==null?void 0:x.docs)==null?void 0:y.source}}};var f,h,B;c.parameters={...c.parameters,docs:{...(f=c.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    icon: HeartHandshakeIcon,
    children: "Button",
    disabled: true,
    color: "primary"
  }
}`,...(B=(h=c.parameters)==null?void 0:h.docs)==null?void 0:B.source}}};const O=["Variants","Sizes","Loading","Disabled"];export{c as Disabled,s as Loading,e as Sizes,n as Variants,O as __namedExportsOrder,M as default};
