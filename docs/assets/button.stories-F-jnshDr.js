import{j as t}from"./jsx-runtime-Cf8x2fCZ.js";import{fn as v}from"./index-BgJgh-x_.js";import{B as i}from"./button-CbbVWId-.js";import{b as g,a as h}from"./utils-DCfAwncM.js";import{c as y}from"./createLucideIcon-BOZfVBeY.js";import"./index-yBjzXJbu.js";import"./index-t5q4d8OJ.js";import"./index-Bjkhh2p3.js";import"./index-CC5eZYhG.js";import"./index-fNjTmf9T.js";import"./ActionButton-D4jVLNva.js";import"./dropdown-menu-xf-jiMEf.js";import"./index-KhTUl610.js";import"./Combination-CdAak5pT.js";import"./index-BiFLoO8l.js";import"./index-CTFHtJli.js";import"./index-V1T-MO6M.js";import"./utils-CytzSlOG.js";import"./check-1JYhj4AL.js";import"./button.variants-B79LQKoe.js";import"./index-C66Dxnp2.js";import"./ellipsis-e_tKH1yv.js";import"./spinner-BoKAmKqu.js";/**
 * @license lucide-react v0.482.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const z=[["path",{d:"M16 10h2",key:"8sgtl7"}],["path",{d:"M16 14h2",key:"epxaof"}],["path",{d:"M6.17 15a3 3 0 0 1 5.66 0",key:"n6f512"}],["circle",{cx:"9",cy:"11",r:"2",key:"yxgjnd"}],["rect",{x:"2",y:"5",width:"20",height:"14",rx:"2",key:"qneu4z"}]],B=y("IdCard",z),P={title:"Buttons/Button",component:i,args:{onClick:v(),loading:!1,disabled:!1,iconOnly:!1}},e={args:{size:"default"},render:a=>t.jsx("div",{className:"flex flex-col items-start gap-2",children:g.map(r=>t.jsx(i,{variant:r,...a,children:r}))})},s={args:{size:"default",iconOnly:!0},render:a=>t.jsx("div",{className:"flex flex-col items-start gap-2",children:g.map(r=>t.jsx(i,{variant:r,...a,children:t.jsx(B,{})}))})},o={args:{variant:"default"},render:a=>t.jsx("div",{className:"flex flex-col items-start gap-2",children:h.map(r=>t.jsxs(i,{size:r,...a,children:["Button ",r]}))})};var n,m,c;e.parameters={...e.parameters,docs:{...(n=e.parameters)==null?void 0:n.docs,source:{originalSource:`{
  args: {
    size: 'default'
  },
  render: args => {
    return <div className="flex flex-col items-start gap-2">
        {buttonVariants.map(variant => <Button variant={variant} {...args}>
            {variant}
          </Button>)}
      </div>;
  }
}`,...(c=(m=e.parameters)==null?void 0:m.docs)==null?void 0:c.source}}};var d,p,l;s.parameters={...s.parameters,docs:{...(d=s.parameters)==null?void 0:d.docs,source:{originalSource:`{
  args: {
    size: 'default',
    iconOnly: true
  },
  render: args => {
    return <div className="flex flex-col items-start gap-2">
        {buttonVariants.map(variant => <Button variant={variant} {...args}>
            <IdCardIcon />
          </Button>)}
      </div>;
  }
}`,...(l=(p=s.parameters)==null?void 0:p.docs)==null?void 0:l.source}}};var u,f,x;o.parameters={...o.parameters,docs:{...(u=o.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    variant: 'default'
  },
  render: args => {
    return <div className="flex flex-col items-start gap-2">
        {buttonSizes.map(size => <Button size={size} {...args}>
            Button {size}
          </Button>)}
      </div>;
  }
}`,...(x=(f=o.parameters)==null?void 0:f.docs)==null?void 0:x.source}}};const Q=["Variants","IconOnly","Sizes"];export{s as IconOnly,o as Sizes,e as Variants,Q as __namedExportsOrder,P as default};
